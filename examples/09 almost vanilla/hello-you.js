Relative.define({
	name: 'hello-you',
	constructor: class HelloYou extends Relative {
		connectedCallback() {
			// save arrow function for further usage
			(this.updateName = () => {
				let value = `Hello ${this.shadowRoot.querySelector('#name').value}!`
				if(!!value)
					this.shadowRoot.querySelector("label").innerHTML = value
				else
					this.shadowRoot.querySelector("label").innerHTML = ""
			})()
			
			// call on keyup
			this.shadowRoot.querySelector('#name').addEventListener(
				'keyup',
				this.updateName
			)
		}
		
		get template() {
			return `
				<template>
					<label></label>
					<br>
					<label>Your Name:</label>
					<input type='text' id='name' value='world'/>
				</template>
			`
		}
	}
})