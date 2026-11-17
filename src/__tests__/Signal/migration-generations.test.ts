import { MigrationGenerations } from '../../Signal/migration-generations'

it('bounds migration history without reviving an admission captured before migration', () => {
	const history = new MigrationGenerations(2)
	const initial = history.get('peer')
	history.advance(['peer'])
	const first = history.get('peer')
	history.advance(['peer'])
	history.advance(['second', 'third'])
	expect(history.size).toBe(2)
	expect(history.get('peer')).not.toBe(initial)
	expect(history.get('peer')).not.toBe(first)
	const afterEviction = history.get('peer')
	history.advance(['peer'])
	history.advance(['fourth', 'fifth'])
	expect(history.size).toBe(2)
	expect(history.get('peer')).not.toBe(afterEviction)
})

it('keeps quiet admissions stable until pruning requires a fresh address lookup', () => {
	const history = new MigrationGenerations(2)
	const untouched = history.get('quiet')
	history.advance(['one', 'two'])
	expect(history.get('quiet')).toBe(untouched)
	history.advance(['three'])
	expect(history.get('quiet')).not.toBe(untouched)
	const fresh = history.get('quiet')
	expect(history.get('quiet')).toBe(fresh)
})

it('bounds sustained distinct migrations and keeps a batch generation consistent', () => {
	const history = new MigrationGenerations(8)
	for (let user = 0; user < 2000; user++) {
		const keys = [`pn-${user}`, `hosted-${user}`, `lid-${user}`, `hosted-lid-${user}`]
		history.advance(keys)
		expect(history.size).toBeLessThanOrEqual(8)
		expect(new Set(keys.map(key => history.get(key))).size).toBe(1)
	}
})
