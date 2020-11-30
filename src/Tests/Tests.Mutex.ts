import { strict as assert } from 'assert'
import { Mutex } from '../WAConnection/Mutex'

const DEFAULT_WAIT = 1000

class MyClass {
    didDoWork = false
    values: { [k: string]: number } = {}
    counter = 0

    @Mutex ()
    async myFunction () {
        if (this.didDoWork) return

        await new Promise (resolve => setTimeout(resolve, DEFAULT_WAIT))
        if (this.didDoWork) {
            throw new Error ('work already done')
        }
        this.didDoWork = true
    }
    @Mutex (key => key)
    async myKeyedFunction (key: string) {
        if (!this.values[key]) {
            await new Promise (resolve => setTimeout(resolve, DEFAULT_WAIT))
            if (this.values[key]) throw new Error ('value already set for ' + key)
            this.values[key] = Math.floor(Math.random ()*100)
        }
        return this.values[key]
    }
    @Mutex (key => key)
    async myQueingFunction (key: string) {
        await new Promise (resolve => setTimeout(resolve, DEFAULT_WAIT))
    }
    @Mutex ()
    async myErrorFunction () {
        await new Promise (resolve => setTimeout(resolve, 100))
        this.counter += 1
        if (this.counter % 2 === 0) {
            throw new Error ('failed')
        }
    }
}

describe ('garbage', () => {
    it ('should only execute once', async () => {
        const stuff = new MyClass ()
        const start = new Date ()
        await Promise.all ([...Array(1000)].map(() => stuff.myFunction ()))
        const diff = new Date ().getTime()-start.getTime()
        assert.ok (diff < DEFAULT_WAIT*1.25)
    })
    it ('should only execute once based on the key', async () => {
        const stuff = new MyClass ()
        const start = new Date ()
        /* 
            In this test, the mutex will lock the function based on the key.
            
            So, if the function with argument `key1` is underway
            and another function with key `key1` is called,
            the call is blocked till the first function completes.
            However, if argument `key2` is passed, the function is allowed to pass.
        */
        const keys = ['key1', 'key2', 'key3']
        const duplicates = 1000
        const results = await Promise.all (
            keys.flatMap (key => (
                [...Array(duplicates)].map(() => stuff.myKeyedFunction (key))
            ))
        )
        assert.deepStrictEqual (
            results.slice(0, duplicates).filter (r => r !== results[0]),
            []
        )

        const diff = new Date ().getTime()-start.getTime()
        assert.ok (diff < DEFAULT_WAIT*1.25)
    })
    it ('should execute operations in a queue', async () => {
        const stuff = new MyClass ()
        const start = new Date ()

        const keys = ['key1', 'key2', 'key3']

        await Promise.all (
            keys.flatMap (key => (
                [...Array(2)].map(() => stuff.myQueingFunction (key))
            ))
        )

        const diff = new Date ().getTime()-start.getTime()
        assert.ok (diff < DEFAULT_WAIT*2.2 && diff > DEFAULT_WAIT*1.5)
    })
    it ('should throw an error on selected items', async () => {
        const stuff = new MyClass ()
        const start = new Date ()

        const WAIT = 100
        const FUNCS = 40
        const results = await Promise.all (
            [...Array(FUNCS)].map(() => stuff.myErrorFunction ().catch(err => err.message))
        )

        const diff = new Date ().getTime()-start.getTime()
        assert.ok (diff < WAIT*FUNCS*1.1)

        assert.strictEqual (
            results.filter (r => r === 'failed').length,
            FUNCS/2 // half should fail
        )
    })
})