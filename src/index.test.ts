import {createComputed, createRoot} from 'solid-js'

// TODO move type def to @lume/cli, map @types/jest's `expect` type into the
// global env.
declare global {
	function expect(...args: any[]): any
}

// Test helper shared with other test files.
export function testButterflyProps(b: {colors: number; wingSize: number}, initialColors = 3) {
	let count = 0

	createRoot(() => {
		createComputed(() => {
			b.colors
			b.wingSize
			count++
		})
	})

	expect(b.colors).toBe(initialColors, 'initial colors value')
	expect(b.wingSize).toBe(2, 'initial wingSize value')
	expect(count).toBe(1, 'Should be reactive')

	b.colors++

	expect(b.colors).toBe(initialColors + 1, 'incremented colors value')
	expect(count).toBe(2, 'Should be reactive')

	b.wingSize++

	expect(b.wingSize).toBe(3, 'incremented wingSize value')
	expect(count).toBe(3, 'Should be reactive')
}
