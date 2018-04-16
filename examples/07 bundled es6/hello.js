Relative.define({
	name: 'hello-you',
	constructor: class HelloYou extends Relative {
		attributeChangedCallback() {
			if(!!this.state.your_name)
				this.shadowRoot.innerHTML = `Hello ${this.state.your_name}!`
			else
				this.shadowRoot.innerHTML = ""
		}
		
		static get observedAttributes() {
			return ['your_name'];
		}
	}
})

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

Relative.define({
	name: 'hello-world',
	constructor: class HelloWorld extends Relative {
		connectedCallback() {
			// hello-you
				let you = Relative.create(`hello-you`)
				this.shadowRoot.append(you)
			
			// br
				this.shadowRoot.append(Relative.create(`br`))
			
			// input
				let input = Relative.create(`<hello-input value='world'>`)
				this.shadowRoot.append(input)
				
				Relative.observe({
					element: input,
					callback: () => {
						you.state.your_name = input.state.value
					},
					options: {
						attributes: true
					}
				})
		}
	}
})