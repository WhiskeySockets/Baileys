///////////////////
// JS EVALUATION //
///////////////////

const protos = []
const modules = {
	"$InternalEnum": {
		exports: {
			exports: function (data) {
				data.__enum__ = true
				return data
			}
		}
	},
}

function packageName(name) {
	return name.replace("WebProtobufs", "").replace("Protobufs", "")
}

function requireModule(name) {
	if (!modules[name]) {
		throw new Error(`Unknown requirement ${name}`)
	}
	return modules[name].exports
}

function requireDefault(name) {
	return requireModule(name).exports
}

function ignoreModule(name) {
	if (name === "WAProtoConst") {
		return false
	} else if (!name.endsWith(".pb")) {
		// Ignore any non-protobuf modules, except WAProtoConst above
		return true
	} else if (name.startsWith("MAWArmadillo") && (name.endsWith("TableSchema.pb") || name.endsWith("TablesSchema.pb"))) {
		// Ignore internal table schemas
		return true
	} else if (name.startsWith("WAWebProtobufsMdStorage")) {
		return true
	} else if (["WAWebProtobufsAdv.pb", "WAWebProtobufsMmsRetry.pb", "WAWebProtobufSyncAction.pb", "WAWebProtobufsFingerprintV3.pb",
		"WAWebProtobufsDeviceCapabilities.pb", "WAWebProtobufsChatLockSettings.pb", "WAWebProtobufsUserPassword.pb",
		"WAProtocol.pb", "WAWebProtobufsProtocol.pb"].includes(name)) {
		// Ignore duplicates (e.g. WAAdv.pb is the same as WAWebProtobufsAdv.pb)
		return false
	} else if (["WAWa5.pb", "WAE2E.pb"].includes(name)) {
		// Ignore the shorter version of duplicates when the WebProtobufs one has more fields
		return true
	} else if (name === "WASignalLocalStorageProtocol.pb" || name === "WASignalWhisperTextProtocol.pb") {
		// Ignore standard signal protocol stuff
		return true
	} else {
		return false
	}
}

const lazyModules = {}

function defineModule(name, dependencies, callback, unknownIntOrNull) {
	if (ignoreModule(name)) {
		return
	} else if (modules[name]) {
		return // ignore duplicates
	}
	dependencies = dependencies.map(dep => dep)
	lazyModules[name] = {
		dependencies,
		load: () => {
			const exports = {}
			if (dependencies.length > 0) {
				callback(null, requireDefault, null, requireModule, null, null, exports)
			} else {
				callback(null, requireDefault, null, requireModule, exports, exports)
			}
			modules[name] = {exports, dependencies}
		}
	}
}

function loadLazyModule(name) {
	if (modules[name]) {
		return
	}
	const mod = lazyModules[name]
	if(!mod) return
	for (const dep of mod.dependencies) {
		loadLazyModule(dep)
	}
	console.log("Loading", name, mod?.dependencies)
	mod.load()
}

function loadLazyModules() {
	for (const name of Object.keys(lazyModules)) {
		loadLazyModule(name)
	}
}

global.self = global
global.__d = defineModule
global.window = {}

/*const neededFiles = new Map()
require("child_process").spawnSync("grep", ["-Er", `^__d\\("([A-Za-z0-9]+\\.pb|WAProtoConst)",`, 'js'])
	.stdout
	.toString()
	.split("\n")
	.forEach(line => {
		if (!line) {
			return
		}
		const match = line.match(/^(.+\.js):__d\("([A-Za-z0-9]+\.pb|WAProtoConst)",/)
		const file = match[1]
		const module = match[2]
		if (module.startsWith("MAWArmadillo") && (module.endsWith("TableSchema.pb") || module.endsWith("TablesSchema.pb"))) {
			return
		} else if (module.startsWith("Instamadillo")) {
			return
		}
		if (!neededFiles.has(file)) {
			neededFiles.set(file, [])
		}
		neededFiles.get(file).push(module)
	})
const neededFilesList = [...neededFiles.entries()]

const alreadyImported = new Set()
for (const [file, modules] of neededFilesList) {
	if (modules.every(mod => alreadyImported.has(mod))) {
		console.log("Skipping", file, "(only duplicates)")
	} else {
		modules.forEach(mod => alreadyImported.add(mod))
		console.log("Requiring", file, "for", modules)
		require(`./${file}`)
	}
}*/
require("./protos.js")
console.log("Requirements loaded, evaluating...")
loadLazyModules()
console.log("Everything required")

function dereference(obj, module, currentPath, next, ...remainder) {
	if (!next) {
		return obj
	}
	if (!obj.messages[next]) {
		obj.messages[next] = {messages: {}, enums: {}, __module__: module, __path__: currentPath, __name__: next}
	}
	return dereference(obj.messages[next], module, currentPath.concat([next]), ...remainder)
}

function dereferenceSnake(obj, currentPath, path) {
	let next = path[0]
	path = path.slice(1)
	while (!obj.messages[next]) {
		if (path.length === 0) {
			return [obj, currentPath, next]
		}
		next += path[0]
		path = path.slice(1)
	}
	return dereferenceSnake(obj.messages[next], currentPath.concat([next]), path)
}

function renameModule(name) {
	return packageName(name.replace(".pb", ""))
}

function renameDependencies(dependencies) {
	return dependencies
		.filter(name => name.endsWith(".pb"))
		.map(renameModule)
		// .map(name => name === "WAProtocol" ? "WACommon" : name)
}

function renameType(protoName, fieldName, field) {
	fieldName = fieldName.replace(/Spec$/, "")
	if (protoName === "WAWebProtobufsE2E" && fieldName.startsWith("Message$")) {
		fieldName = fieldName.replace(/^Message\$/, "")
	} else if (protoName === "WASyncAction" && fieldName.startsWith("SyncActionValue$")) {
		fieldName = fieldName.replace(/^SyncActionValue\$/, "")
	}
	return fieldName
}

for (const [name, module] of Object.entries(modules)) {
	if (!name.endsWith(".pb")) {
		continue
	} else if (!module.exports) {
		console.warn(name, "has no exports")
		continue
	}
	// Slightly hacky way to get rid of WAProtocol.pb and just use the MessageKey in WACommon
	// if (name === "WAProtocol.pb" || name === "WAWebProtobufsProtocol.pb") {
	// 	if (Object.entries(module.exports).length > 1) {
	// 		console.warn("WAProtocol.pb has more than one export")
	// 	}
	// 	module.exports["MessageKeySpec"].__name__ = "MessageKey"
	// 	module.exports["MessageKeySpec"].__module__ = "WACommon"
	// 	module.exports["MessageKeySpec"].__path__ = []
	// 	continue
	// }
	const proto = {
		__protobuf__: true,
		messages: {},
		enums: {},
		__name__: renameModule(name),
		dependencies: renameDependencies(module.dependencies),
	}
	const upperSnakeEnums = []
	for (const [name, field] of Object.entries(module.exports)) {
		const namePath = renameType(proto.__name__, name, field).split("$")
		field.__name__ = namePath[namePath.length - 1]
		namePath[namePath.length - 1] = field.__name__
		field.__path__ = namePath.slice(0, -1)
		field.__module__ = proto.__name__
		if (field.internalSpec) {
			dereference(proto, proto.__name__, [], ...namePath).message = field.internalSpec
		} else if (namePath.length === 1 && name.toUpperCase() === name) {
			upperSnakeEnums.push(field)
		} else {
			dereference(proto, proto.__name__, [], ...namePath.slice(0, -1)).enums[field.__name__] = field
		}
	}
	// Some enums have uppercase names, instead of capital case with $ separators.
	// For those, we need to find the right nesting location.
	for (const field of upperSnakeEnums) {
		field.__enum__ = true
		const [obj, path, name] = dereferenceSnake(proto, [], field.__name__.split("_").map(part => part[0] + part.slice(1).toLowerCase()))
		field.__path__ = path
		field.__name__ = name
		field.__module__ = packageName(proto.__name__)
		obj.enums[name] = field
	}
	protos.push(proto)
}

////////////////////////////////
// PROTOBUF SCHEMA GENERATION //
////////////////////////////////

function indent(lines, indent = "\t") {
	return lines.map(line => line ? `${indent}${line}` : "")
}

function flattenWithBlankLines(...items) {
	return items
		.flatMap(item => item.length > 0 ? [item, [""]] : [])
		.slice(0, -1)
		.flatMap(item => item)
}

function protoifyChildren(container, proto3) {
	return flattenWithBlankLines(
		...Object.values(container.enums).map(protoifyEnum),
		...Object.values(container.messages).map(msg => protoifyMessage(msg, proto3)),
	)
}

function protoifyEnum(enumDef) {
	const values = []
	const names = Object.fromEntries(Object.entries(enumDef).map(([name, value]) => [value, name]))
	if (!names["0"]) {
		if (names["-1"]) {
			enumDef[names["-1"]] = 0
		} else {
			// TODO add snake case
			// values.push(`${enumDef.__name__.toUpperCase()}_AUTOGEN_UNKNOWN = 0;`)
		}
	}
	for (const [name, value] of Object.entries(enumDef)) {
		if (name.startsWith("__") && name.endsWith("__")) {
			continue
		}
		values.push(`${name} = ${value};`)
	}
	return [`enum ${enumDef.__name__} ` + "{", ...indent(values), "}"]
}

const {TYPES, TYPE_MASK, FLAGS} = requireModule("WAProtoConst")

function mapFieldTypeName(ref, parentModule, parentPath) {
	if (typeof ref === "object") {
		return fieldTypeName(TYPES.MESSAGE, ref, parentModule, parentPath)
	} else {
		return fieldTypeName(ref, undefined, parentModule, parentPath)
	}
}

function fieldTypeName(typeID, typeRef, parentModule, parentPath) {
	switch (typeID) {
		case TYPES.INT32:
			return "int32"
		case TYPES.INT64:
			return "int64"
		case TYPES.UINT32:
			return "uint32"
		case TYPES.UINT64:
			return "uint64"
		case TYPES.SINT32:
			return "sint32"
		case TYPES.SINT64:
			return "sint64"
		case TYPES.BOOL:
			return "bool"
		case TYPES.ENUM:
		case TYPES.MESSAGE:
			let pathStartIndex = 0
			for (let i = 0; i < parentPath.length && i < typeRef.__path__.length; i++) {
				if (typeRef.__path__[i] === parentPath[i]) {
					pathStartIndex++
				} else {
					break
				}
			}
			const namePath = []
			if (typeRef.__module__ !== parentModule) {
				namePath.push(typeRef.__module__)
				pathStartIndex = 0
			}
			namePath.push(...typeRef.__path__.slice(pathStartIndex))
			namePath.push(typeRef.__name__)
			return namePath.join(".")
		case TYPES.MAP:
			return `map<${mapFieldTypeName(typeRef[0], parentModule, parentPath)}, ${mapFieldTypeName(typeRef[1], parentModule, parentPath)}>`
		case TYPES.FIXED64:
			return "fixed64"
		case TYPES.SFIXED64:
			return "sfixed64"
		case TYPES.DOUBLE:
			return "double"
		case TYPES.STRING:
			return "string"
		case TYPES.BYTES:
			return "bytes"
		case TYPES.FIXED32:
			return "fixed32"
		case TYPES.SFIXED32:
			return "sfixed32"
		case TYPES.FLOAT:
			return "float"
	}
}

const staticRenames = {
	id: "ID",
	jid: "JID",
	encIv: "encIV",
	iv: "IV",
	ptt: "PTT",
	hmac: "HMAC",
	url: "URL",
	fbid: "FBID",
	jpegThumbnail: "JPEGThumbnail",
	dsm: "DSM",
}

function fixFieldName(name) {
	if (name === "id") {
		return "ID"
	} else if (name === "encIv") {
		return "encIV"
	}
	return staticRenames[name] ?? name
		.replace(/Id([A-Zs]|$)/, "ID$1")
		.replace("Jid", "JID")
		.replace(/Ms([A-Z]|$)/, "MS$1")
		.replace(/Ts([A-Z]|$)/, "TS$1")
		.replace(/Mac([A-Z]|$)/, "MAC$1")
		.replace("Url", "URL")
		.replace("Cdn", "CDN")
		.replace("Json", "JSON")
		.replace("Jpeg", "JPEG")
		.replace("Sha256", "SHA256")
}

function protoifyField(name, [index, flags, typeRef], parentModule, parentPath, isOneOf, proto3) {
	const preflags = []
	const postflags = [""]
	const isMap = (flags & TYPE_MASK) === TYPES.MAP
	if (!isOneOf) {
		if ((flags & FLAGS.REPEATED) !== 0) {
			preflags.push("repeated")
		} else if (!proto3) {
			if ((flags & FLAGS.REQUIRED) === 0) {
				preflags.push("optional")
			} else {
				preflags.push("required")
			}
		}
	}
	preflags.push(fieldTypeName(flags & TYPE_MASK, typeRef, parentModule, parentPath))
	if ((flags & FLAGS.PACKED) !== 0) {
		postflags.push(`[packed=true]`)
	}
	return `${preflags.join(" ")} ${fixFieldName(name)} = ${index}${postflags.join(" ")};`
}

function protoifyFields(fields, parentModule, parentPath, isOneOf, proto3) {
	return Object.entries(fields).map(([name, definition]) => protoifyField(name, definition, parentModule, parentPath, isOneOf, proto3))
}

function protoifyMessage(message, proto3) {
	const sections = [protoifyChildren(message, proto3)]
	const spec = message.message
	const fullMessagePath = message.__path__.concat([message.__name__])
	for (const [name, fieldNames] of Object.entries(spec.__oneofs__ ?? {})) {
		const fields = Object.fromEntries(fieldNames.map(fieldName => {
			const def = spec[fieldName]
			delete spec[fieldName]
			return [fieldName, def]
		}))
		sections.push([`oneof ${name} ` + "{", ...indent(protoifyFields(fields, message.__module__, fullMessagePath, true, proto3)), "}"])
	}
	if (spec.__reserved__) {
		console.warn("Found reserved keys:", message.__name__, spec.__reserved__)
	}
	delete spec.__oneofs__
	delete spec.__reserved__
	sections.push(protoifyFields(spec, message.__module__, fullMessagePath, false, proto3))
	return [`message ${message.__name__} ` + "{", ...indent(flattenWithBlankLines(...sections)), "}"]
}

const needsProto3 = {
	"WAReporting": true
}

function protoifyModule(module) {
	const output = []
	const proto3 = needsProto3[module.__name__]
	if (proto3) {
		output.push(`syntax = "proto3";`)
	} else {
		output.push(`syntax = "proto2";`)
	}
	output.push(`package ${packageName(module.__name__)};`)
	output.push("")
	if (module.dependencies.length > 0) {
		for (const dependency of module.dependencies) {
			output.push(`import "../${packageName(dependency)}/${packageName(dependency)}.proto";`)
		}
		output.push("")
	}
	const children = protoifyChildren(module, proto3)
	children.push("")
	return output.concat(children)
}

const fs = require("fs")

for (const proto of protos) {
	fs.mkdirSync('../WAProto/' + packageName(proto.__name__), {recursive: true})
	fs.writeFileSync(`../WAProto/${packageName(proto.__name__)}/${packageName(proto.__name__)}.proto`, protoifyModule(proto).join("\n"))
}
