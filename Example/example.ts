import makeConnection from '../src'
import * as fs from 'fs'

async function example() {
    const conn = makeConnection({
        credentials: './auth_info.json'
    })
    conn.ev.on('connection.update', state => {
        console.log(state)
    })
}

example().catch((err) => console.log(`encountered error`, err))