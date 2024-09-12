const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const PROTOSPATH = '../WAProto/'
const JSCOMMAND = `pbjs -t static-module -w commonjs -o `
const TSCOMMAND = `pbts -o `

const protoDirs = fs.readdirSync(PROTOSPATH)

const exportArr = []
let exportStr = ''

console.log(`Generating statics for ${protoDirs.length} protos`)
//iterate in every folder
protoDirs.forEach(dir => {
  //ignore scripts
  if(dir.includes('index')) return

  //set full dir
  const pathDir = PROTOSPATH + dir
  //get name from file XXX.js = XXX
  const name = dir.split('.')[0]

  //add import statement to string
  exportStr += `import { ${name} } from '${pathDir}'\n`
  //add proto name to exportArr to add in export statement
  exportArr.push(name)

  //read all protos in dir
  const protoFiles = fs.readdirSync(pathDir)

  //iterate of all proto files
  protoFiles.forEach(protoFile => {
    //accept only .proto files
    if(!protoFile.endsWith('.proto')) return

    //generate paths
    const protoPath = path.join(pathDir, protoFile)
    const outputJSPath = path.join(pathDir, 'index.js')
    const outputTSPath = path.join(pathDir, 'index.d.ts')

    try {
      //run commands
      execSync(JSCOMMAND + outputJSPath + ' ' + protoPath)
      execSync(TSCOMMAND + outputTSPath + ' ' + outputJSPath)
      console.log(`Generated statics from ${protoPath}`)
    } catch (error) {
      console.error(`Error generating statics from ${protoPath}:`, error)
    }
  })
})

console.log(`Generating index.ts`)

//It will be generate a index.ts exporting all protos
//All properties in every proto will be expanded to proto var 
fs.writeFileSync(
  PROTOSPATH + 'index.ts',
  exportStr +
  `
const proto = { 
${exportArr.map(v => '  ...' + v).join(',\n')}
}
  
export { proto }`
  
)

console.log(`Generated statics`)