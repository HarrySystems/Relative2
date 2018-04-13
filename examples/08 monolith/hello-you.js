Relative.define({
	name: 'hello-you',
	constructor: class HelloYou extends Relative {
		connectedCallback() {
			// save arrow function for further usage
			this.updateName = () => {
				this.state.your_name = this.shadowRoot.querySelector('#name').value
			}
			
			// call in the first time you run
			this.updateName()
			
			// call on keyup
			this.shadowRoot.querySelector('#name').addEventListener(
				'keyup',
				this.updateName
			)
		}
		
		attributeChangedCallback() {
			if(!!this.state.your_name)
				this.shadowRoot.querySelector("label").innerHTML = `Hello ${this.state.your_name}!`
			else
				this.shadowRoot.querySelector("label").innerHTML = ""
		}
		
		static get observedAttributes() {
			return ['your_name'];
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