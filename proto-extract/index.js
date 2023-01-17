const request = require('request-promise-native')
const acorn = require('acorn')
const walk = require('acorn-walk')
const fs = require('fs/promises')

const addPrefix = (lines, prefix) => lines.map(line => prefix + line)

const extractAllExpressions = (node) => {
	const expressions = [node]
	const exp = node.expression
	if(exp) {
		expressions.push(exp)
	}

	if(node.expression?.expressions?.length) {
		for(const exp of node.expression?.expressions) {
			expressions.push(...extractAllExpressions(exp))
		}
	}

	return expressions
}

async function findAppModules() {
	const ua = {
		headers: {
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:100.0) Gecko/20100101 Firefox/100.0',
			'Sec-Fetch-Dest': 'script',
			'Sec-Fetch-Mode': 'no-cors',
			'Sec-Fetch-Site': 'same-origin',
			'Referer': 'https://web.whatsapp.com/',
			'Accept': '*/*',
			'Accept-Language': 'Accept-Language: en-US,en;q=0.5',
		}
	}
	const baseURL = 'https://web.whatsapp.com'
	const index = await request.get(baseURL, ua)
	const bootstrapQRID = index.match(/src="\/bootstrap_qr.([0-9a-z]{10,}).js"/)[1]
	const bootstrapQRURL = baseURL + '/bootstrap_qr.' + bootstrapQRID + '.js'

	console.error('Found bootstrap_qr.js URL:', bootstrapQRURL)

	const qrData = await request.get(bootstrapQRURL, ua)
	const waVersion = qrData.match(/appVersion:"(\d\.\d+\.\d+)"/)[1]
	console.log('Current version:', waVersion)
	// This one list of types is so long that it's split into two JavaScript declarations.
	// The module finder below can't handle it, so just patch it manually here.
	const patchedQrData = qrData.replace('t.ActionLinkSpec=void 0,t.TemplateButtonSpec', 't.ActionLinkSpec=t.TemplateButtonSpec')
	//const patchedQrData = qrData.replace("Spec=void 0,t.", "Spec=t.")
	const qrModules = acorn.parse(patchedQrData).body[0].expression.arguments[0].elements[1].properties

	const result = qrModules.filter(m => {
		const hasProto = !!m.value.body.body.find(b => {
			const expressions = extractAllExpressions(b)
			return expressions?.find(e => e?.left?.property?.name === 'internalSpec')
		})
		if(hasProto) {
			return true
		}
	})

	return result
}

(async() => {
	const unspecName = name => name.endsWith('Spec') ? name.slice(0, -4) : name
	const unnestName = name => name.split('$').slice(-1)[0]
	const getNesting = name => name.split('$').slice(0, -1).join('$')
	const makeRenameFunc = () => (
		name => {
			name = unspecName(name)
			return name// .replaceAll('$', '__')
			//  return renames[name] ?? unnestName(name)
		}
	)
	// The constructor IDs that can be used for enum types
	// const enumConstructorIDs = [76672, 54302]

	const modules = await findAppModules()

	// Sort modules so that whatsapp module id changes don't change the order in the output protobuf schema
	// const modules = []
	// for (const mod of wantedModules) {
	//     modules.push(unsortedModules.find(node => node.key.value === mod))
	// }

	// find aliases of cross references between the wanted modules
	const modulesInfo = {}
	const moduleIndentationMap = {}
	modules.forEach(({ key, value }) => {
		const requiringParam = value.params[2].name
		modulesInfo[key.value] = { crossRefs: [] }
		walk.simple(value, {
			VariableDeclarator(node) {
				if(node.init && node.init.type === 'CallExpression' && node.init.callee.name === requiringParam && node.init.arguments.length === 1) {
					modulesInfo[key.value].crossRefs.push({ alias: node.id.name, module: node.init.arguments[0].value })
				}
			}
		})
	})

	// find all identifiers and, for enums, their array of values
	for(const mod of modules) {
		const modInfo = modulesInfo[mod.key.value]
		const rename = makeRenameFunc(mod.key.value)

		// all identifiers will be initialized to "void 0" (i.e. "undefined") at the start, so capture them here
		walk.ancestor(mod, {
			UnaryExpression(node, anc) {
				if(!modInfo.identifiers && node.operator === 'void') {
					const assignments = []
					let i = 1
					anc.reverse()
					while(anc[i].type === 'AssignmentExpression') {
						assignments.push(anc[i++].left)
					}

					const makeBlankIdent = a => {
						const key = rename(a.property.name)
						const indentation = getNesting(key)
						const value = { name: key }

						moduleIndentationMap[key] = moduleIndentationMap[key] || { }
						moduleIndentationMap[key].indentation = indentation

						if(indentation.length) {
							moduleIndentationMap[indentation] = moduleIndentationMap[indentation] || { }
							moduleIndentationMap[indentation].members = moduleIndentationMap[indentation].members || new Set()
							moduleIndentationMap[indentation].members.add(key)
						}

						return [key, value]
					}

					modInfo.identifiers = Object.fromEntries(assignments.map(makeBlankIdent).reverse())

				}
			}
		})
		const enumAliases = {}
		// enums are defined directly, and both enums and messages get a one-letter alias
		walk.simple(mod, {
			VariableDeclarator(node) {
				if(
					node.init?.type === 'CallExpression'
                    // && enumConstructorIDs.includes(node.init.callee?.arguments?.[0]?.value)
                    && !!node.init.arguments.length
                    && node.init.arguments[0].type === 'ObjectExpression'
                    && node.init.arguments[0].properties.length
				) {
					const values = node.init.arguments[0].properties.map(p => ({
						name: p.key.name,
						id: p.value.value
					}))
					enumAliases[node.id.name] = values
				}
			},
			AssignmentExpression(node) {
				if(node.left.type === 'MemberExpression' && modInfo.identifiers[rename(node.left.property.name)]) {
					const ident = modInfo.identifiers[rename(node.left.property.name)]
					ident.alias = node.right.name
					// enumAliases[ident.alias] = enumAliases[ident.alias] || []
					ident.enumValues = enumAliases[ident.alias]
				}
			},
		})
	}

	// find the contents for all protobuf messages
	for(const mod of modules) {
		const modInfo = modulesInfo[mod.key.value]
		const rename = makeRenameFunc(mod.key.value)

		// message specifications are stored in a "internalSpec" attribute of the respective identifier alias
		walk.simple(mod, {
			AssignmentExpression(node) {
				if(node.left.type === 'MemberExpression' && node.left.property.name === 'internalSpec' && node.right.type === 'ObjectExpression') {
					const targetIdent = Object.values(modInfo.identifiers).find(v => v.alias === node.left.object.name)
					if(!targetIdent) {
						console.warn(`found message specification for unknown identifier alias: ${node.left.object.name}`)
						return
					}

					// partition spec properties by normal members and constraints (like "__oneofs__") which will be processed afterwards
					const constraints = []
					let members = []
					for(const p of node.right.properties) {
						p.key.name = p.key.type === 'Identifier' ? p.key.name : p.key.value
						const arr = p.key.name.substr(0, 2) === '__' ? constraints : members
						arr.push(p)
					}

					members = members.map(({ key: { name }, value: { elements } }) => {
						let type
						const flags = []
						const unwrapBinaryOr = n => (n.type === 'BinaryExpression' && n.operator === '|') ? [].concat(unwrapBinaryOr(n.left), unwrapBinaryOr(n.right)) : [n]

						// find type and flags
						unwrapBinaryOr(elements[1]).forEach(m => {
							if(m.type === 'MemberExpression' && m.object.type === 'MemberExpression') {
								if(m.object.property.name === 'TYPES') {
									type = m.property.name.toLowerCase()
								} else if(m.object.property.name === 'FLAGS') {
									flags.push(m.property.name.toLowerCase())
								}
							}
						})

						// determine cross reference name from alias if this member has type "message" or "enum"
						if(type === 'message' || type === 'enum') {
							const currLoc = ` from member '${name}' of message '${targetIdent.name}'`
							if(elements[2].type === 'Identifier') {
								type = Object.values(modInfo.identifiers).find(v => v.alias === elements[2].name)?.name
								if(!type) {
									console.warn(`unable to find reference of alias '${elements[2].name}'` + currLoc)
								}
							} else if(elements[2].type === 'MemberExpression') {
								const crossRef = modInfo.crossRefs.find(r => r.alias === elements[2].object.name)
								if(crossRef && modulesInfo[crossRef.module].identifiers[rename(elements[2].property.name)]) {
									type = rename(elements[2].property.name)
								} else {
									console.warn(`unable to find reference of alias to other module '${elements[2].object.name}' or to message ${elements[2].property.name} of this module` + currLoc)
								}
							}
						}

						return { name, id: elements[0].value, type, flags }
					})

					// resolve constraints for members
					constraints.forEach(c => {
						if(c.key.name === '__oneofs__' && c.value.type === 'ObjectExpression') {
							const newOneOfs = c.value.properties.map(p => ({
								name: p.key.name,
								type: '__oneof__',
								members: p.value.elements.map(e => {
									const idx = members.findIndex(m => m.name === e.value)
									const member = members[idx]
									members.splice(idx, 1)
									return member
								})
							}))
							members.push(...newOneOfs)
						}
					})

					targetIdent.members = members
				}
			}
		})
	}

	const decodedProtoMap = { }
	const spaceIndent = ' '.repeat(4)
	for(const mod of modules) {
		const modInfo = modulesInfo[mod.key.value]
		const identifiers = Object.values(modInfo.identifiers)

		// enum stringifying function
		const stringifyEnum = (ident, overrideName = null) => [].concat(
			[`enum ${overrideName || ident.displayName || ident.name} {`],
			addPrefix(ident.enumValues.map(v => `${v.name} = ${v.id};`), spaceIndent),
			['}']
		)

		// message specification member stringifying function
		const stringifyMessageSpecMember = (info, completeFlags, parentName = undefined) => {
			if(info.type === '__oneof__') {
				return [].concat(
					[`oneof ${info.name} {`],
					addPrefix([].concat(...info.members.map(m => stringifyMessageSpecMember(m, false))), spaceIndent),
					['}']
				)
			} else {
				if(info.flags.includes('packed')) {
					info.flags.splice(info.flags.indexOf('packed'))
					info.packed = ' [packed=true]'
				}

				if(completeFlags && info.flags.length === 0) {
					info.flags.push('optional')
				}

				const ret = []
				const indentation = moduleIndentationMap[info.type]?.indentation
				let typeName = unnestName(info.type)
				if(indentation !== parentName && indentation) {
					typeName = `${indentation.replaceAll('$', '.')}.${typeName}`
				}

				// if(info.enumValues) {
				//     // typeName = unnestName(info.type)
				//     ret = stringifyEnum(info, typeName)
				// }

				ret.push(`${info.flags.join(' ') + (info.flags.length === 0 ? '' : ' ')}${typeName} ${info.name} = ${info.id}${info.packed || ''};`)
				return ret
			}
		}

		// message specification stringifying function
		const stringifyMessageSpec = (ident) => {
			const members = moduleIndentationMap[ident.name]?.members
			const result = []
			result.push(
				`message ${ident.displayName || ident.name} {`,
				...addPrefix([].concat(...ident.members.map(m => stringifyMessageSpecMember(m, true, ident.name))), spaceIndent),
			)

			if(members?.size) {
				const sortedMembers = Array.from(members).sort()
				for(const memberName of sortedMembers) {
					let entity = modInfo.identifiers[memberName]
					if(entity) {
						const displayName = entity.name.slice(ident.name.length + 1)
						entity = { ...entity, displayName }
						result.push(...addPrefix(getEntity(entity), spaceIndent))
					} else {
						console.log('missing nested entity ', memberName)
					}
				}
			}

			result.push('}')
			result.push('')

			return result
		}

		const getEntity = (v) => {
			let result
			if(v.members) {
				result = stringifyMessageSpec(v)
			} else if(v.enumValues?.length) {
				result = stringifyEnum(v)
			} else {
				result = ['// Unknown entity ' + v.name]
			}

			return result
		}

		const stringifyEntity = v => {
			return {
				content: getEntity(v).join('\n'),
				name: v.name
			}
		}

		for(const value of identifiers) {
			const { name, content } = stringifyEntity(value)
			if(!moduleIndentationMap[name]?.indentation?.length) {
				decodedProtoMap[name] = content
			}
			// decodedProtoMap[name] = content
		}
	}

	// console.log(moduleIndentationMap)
	const decodedProto = Object.keys(decodedProtoMap).sort()
	const sortedStr = decodedProto.map(d => decodedProtoMap[d]).join('\n')

	const decodedProtoStr = `syntax = "proto2";\npackage proto;\n\n${sortedStr}`
	const destinationPath = '../WAProto/WAProto.proto'
	await fs.writeFile(destinationPath, decodedProtoStr)

	console.log(`Extracted protobuf schema to "${destinationPath}"`)
})()
