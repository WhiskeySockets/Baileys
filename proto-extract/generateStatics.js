const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const PROTOSPATH = '../WAProto/'
const JSCOMMAND = `pbjs -t static-module -w commonjs -o `
const TSCOMMAND = `pbts -o `

const protoDirs = fs.readdirSync(PROTOSPATH)

const exportArr = []

console.log(`Generating statics for ${protoDirs.length} protos`)
protoDirs.forEach(dir => {
  if(dir.includes('index')) return

  dir = PROTOSPATH + dir
  exportArr.push(`export * from '${dir}'`)
  const protoFiles = fs.readdirSync(dir)
  
  protoFiles.forEach(protoFile => {
    if(!protoFile.endsWith('.proto')) return
    const protoPath = path.join(dir, protoFile)
    const outputJSPath = path.join(dir, 'index.js')
    const outputTSPath = path.join(dir, 'index.ts')

    try {
      execSync(JSCOMMAND + outputJSPath + ' ' + protoPath)
      execSync(TSCOMMAND + outputTSPath + ' ' + outputJSPath)
      console.log(`Generated statics from ${protoPath}`)
    } catch (error) {
      console.error(`Error generating statics from ${protoPath}:`, error)
    }
  })
})

fs.writeFileSync(PROTOSPATH + 'index.ts', exportArr.join('\n'))

console.log(`Generated statics`)