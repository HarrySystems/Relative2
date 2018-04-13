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