const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const PROTOSPATH = '../WAProto/'
const JSCOMMAND = ['pbjs -t static-module -w commonjs --keep-case']
const TSCOMMAND = 'pbts -o'

const outputJSPath = path.join(PROTOSPATH, 'index.js')
const outputTSPath = path.join(PROTOSPATH, 'index.d.ts')
const protoDirs = fs.readdirSync(PROTOSPATH)

console.log(`Generating statics for ${protoDirs.length} protos`)
//iterate in every folder
protoDirs.forEach(dir => {
  //ignore scripts
  if(dir.includes('index')) return

  //set full dir
  const pathDir = PROTOSPATH + dir

  //read all protos in dir
  const protoFiles = fs.readdirSync(pathDir)

  //iterate of all proto files
  protoFiles.forEach(protoFile => {
    //accept only .proto files
    if(!protoFile.endsWith('.proto')) return

    //generate paths
    const protoPath = path.join(pathDir, protoFile)

    //push path to pbjs command
    JSCOMMAND.push(protoPath)
  })
})

//push out dir
JSCOMMAND.push('-o ' + outputJSPath)

try {
  //run commands
  execSync(JSCOMMAND.join(' '))
  execSync(TSCOMMAND + outputTSPath + ' ' + outputJSPath)
  console.log(`Generated statics`)
} catch (error) {
  console.error(`Error generating statics`, error)
}