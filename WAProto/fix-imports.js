import { readFileSync, writeFileSync } from 'fs';
import { exit } from 'process';

const filePath = './index.js'

try {
  let content = readFileSync(filePath, 'utf8')

  content = content.replace(/import \* as (\$protobuf) from/g, 'import $1 from')
  content = content.replace(/(['"])protobufjs\/minimal(['"])/g, '$1protobufjs/minimal.js$2')

  const marker = 'const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});\n\n'
  const longToStringHelper =
    'function longToString(value, unsigned) {\n' +
    '\tif (typeof value === "string") {\n' +
    '\t\treturn value;\n' +
    '\t}\n' +
    '\tif (typeof value === "number") {\n' +
    '\t\treturn String(value);\n' +
    '\t}\n' +
    '\tif (!$util.Long) {\n' +
    '\t\treturn String(value);\n' +
    '\t}\n' +
    '\tconst normalized = $util.Long.fromValue(value);\n' +
    '\tconst prepared = unsigned && normalized && typeof normalized.toUnsigned === "function"\n' +
    '\t\t? normalized.toUnsigned()\n' +
    '\t\t: normalized;\n' +
    '\treturn prepared.toString();\n' +
    '}\n\n'
  const longToNumberHelper =
    'function longToNumber(value, unsigned) {\n' +
    '\tif (typeof value === "number") {\n' +
    '\t\treturn value;\n' +
    '\t}\n' +
    '\tif (typeof value === "string") {\n' +
    '\t\tconst numeric = Number(value);\n' +
    '\t\treturn numeric;\n' +
    '\t}\n' +
    '\tif (!$util.Long) {\n' +
    '\t\treturn Number(value);\n' +
    '\t}\n' +
    '\tconst normalized = $util.Long.fromValue(value);\n' +
    '\tconst prepared = unsigned && normalized && typeof normalized.toUnsigned === "function"\n' +
    '\t\t? normalized.toUnsigned()\n' +
    '\t\t: typeof normalized.toSigned === "function"\n' +
    '\t\t\t? normalized.toSigned()\n' +
    '\t\t\t: normalized;\n' +
    '\treturn prepared.toNumber();\n' +
    '}\n\n'

  if (!content.includes('function longToString(')) {
    const markerIndex = content.indexOf(marker)
    if (markerIndex === -1) {
      throw new Error('Unable to inject Long helpers: marker not found in WAProto index output')
    }

    content = content.replace(marker, `${marker}${longToStringHelper}${longToNumberHelper}`)
  } else {
    const longToStringRegex = /function longToString\(value, unsigned\) {\n[\s\S]*?\n}\n\n/
    const longToNumberRegex = /function longToNumber\(value, unsigned\) {\n[\s\S]*?\n}\n\n/

    if (!longToStringRegex.test(content) || !longToNumberRegex.test(content)) {
      throw new Error('Unable to update Long helpers: existing definitions not found')
    }

    content = content.replace(longToStringRegex, longToStringHelper)
    content = content.replace(longToNumberRegex, longToNumberHelper)
  }

  const longPattern = /([ \t]+d\.(\w+) = )o\.longs === String \? \$util\.Long\.prototype\.toString\.call\(m\.\2\) : o\.longs === Number \? new \$util\.LongBits\(m\.\2\.low >>> 0, m\.\2\.high >>> 0\)\.toNumber\((true)?\) : m\.\2;/g
  content = content.replace(longPattern, (_match, prefix, field, unsignedFlag) => {
    const unsignedArg = unsignedFlag ? ', true' : ''
    return `${prefix}o.longs === String ? longToString(m.${field}${unsignedArg}) : o.longs === Number ? longToNumber(m.${field}${unsignedArg}) : m.${field};`
  })

  writeFileSync(filePath, content, 'utf8')
  console.log(`✅ Fixed imports in ${filePath}`)
} catch (error) {
  console.error(`❌ Error fixing imports: ${error.message}`)
  exit(1)
}
