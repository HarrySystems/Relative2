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
				
				Relative.watch({
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