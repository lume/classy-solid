import {signal, effect, memo, stopEffects, component, startEffects} from './index.js'
import {render} from 'solid-js/web'
import html from 'solid-js/html'
import {onCleanup} from 'solid-js'

//////////////////////////////////////////////////
// Make plain classes reactive with Solid signals.

class Counter {
	@signal count = 0

	// @ts-expect-error not unused
	@effect #logCount() {
		// Log the count whenever it changes.
		console.log(`Count is: ${this.count}`)
	}

	increment() {
		this.count++
	}
}

class Example extends Counter {
	@signal num = 10

	@memo get #sum() {
		return this.count + this.num
	}

	// @ts-expect-error not unused
	@effect #logSum() {
		// Log the sum whenever it changes.
		console.log(`Sum is: ${this.#sum}`)
	}
}

const ex = new Example() // starts effects, logs "Count is: 0", "Sum is: 10"

ex.count = 5 // Logs "Count is: 5", "Sum is: 15"
ex.num = 20 // Logs "Sum is: 25"

setInterval(() => ex.increment(), 1000)

// ...later, clean up when done...
setTimeout(() => stopEffects(ex), 3000)

//////////////////////////////////////////////////
// Optionally use classes as Solid components.

@component
class MyComp {
	@signal message = 'Hello, World!'
	@signal name = 'Tom'

	template() {
		setTimeout(() => (this.message = 'Hello after 3 seconds!'), 3000)

		return html`
			<div>
				<h1>${() => this.message}</h1>

				<p>My name is ${() => this.name}.</p>

				<p>The count is: ${() => ex.count}</p>
			</div>
		`
	}
}

render(
	// prettier-ignore
	() => html`
		<${MyComp} name="Joe"></>

		<p>(Also see console output.)</p><br />
	`,
	document.body,
)

//////////////////////////////////////////////////
// Use reactivity with Custom Elements.
// For an additional set of utilities for concisely defining Custom Elements,
// see the @lume/element package built on top of classy-solid.

class ElementWithEffects extends HTMLElement {
	connectedCallback() {
		startEffects(this)
	}

	disconnectedCallback() {
		stopEffects(this)
	}
}

class MyElement extends ElementWithEffects {
	#root = this.attachShadow({mode: 'open'})

	@signal count = 0

	// @ts-expect-error not unused
	@effect #logCount() {
		// Show the count whenever it changes.
		this.#root.textContent = `<${this.tagName.toLowerCase()}> Count is: ${this.count}`
	}

	// @ts-expect-error not unused
	@effect #interval() {
		const int = setInterval(() => this.count++, 1000)
		onCleanup(() => clearInterval(int))
	}
}

customElements.define('my-element', MyElement)

const el = document.createElement('my-element')

document.body.append(el)

// ...Later, remove the element to stop its effects...
setTimeout(() => el.remove(), 3000)

// ...Later, add the element back to see effects restart...
setTimeout(() => document.body.append(el), 6000)
