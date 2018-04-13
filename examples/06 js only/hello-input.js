Relative.define({
	name: 'hello-input',
	constructor: class HelloInput extends Relative {
		connectedCallback() {
			let input = this.shadowRoot.querySelector("input")
			input.addEventListener(
				'keyup',
				() => {
					this.state.value = input.value
				}
			)
		}
		
		get template() {
			return `
				<template>
					<label>Your name:</label>
					<input type='text'/>
				</template>
			`
		}
	}
})