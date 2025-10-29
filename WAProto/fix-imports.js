import { readFileSync, writeFileSync } from 'fs'
import { exit } from 'process'

const filePath = './index.js'

try {
  let content = readFileSync(filePath, 'utf8')

  content = content.replace(/import \* as (\$protobuf) from/g, 'import $1 from')
  content = content.replace(/(['"])protobufjs\/minimal(['"])/g, '$1protobufjs/minimal.js$2')

  if (!content.includes('function longToString(')) {
    const marker = 'const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});\n\n'
    const helpers =
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
      '\tif (unsigned && normalized && typeof normalized === "object") {\n' +
      '\t\tnormalized.unsigned = true;\n' +
      '\t}\n' +
      '\treturn normalized.toString();\n' +
      '}\n\n' +
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
      '\tif (unsigned && normalized && typeof normalized === "object") {\n' +
      '\t\tnormalized.unsigned = true;\n' +
      '\t}\n' +
      '\treturn normalized.toNumber(unsigned);\n' +
      '}\n\n'

    content = content.replace(marker, `${marker}${helpers}`)
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
