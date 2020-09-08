import { promisify } from 'util'
import { exec as exec0 } from 'child_process'

const exec = promisify (exec0)

async function run () {
    await exec ('pbjs -t static-module -w commonjs -o ./WAMessage/WAMessage.js ./src/Binary/def.proto')
    await exec ('pbts -o ./WAMessage/WAMessage.d.ts ./WAMessage/WAMessage.js')
}
run ()