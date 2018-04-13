class Relative extends HTMLElement {
	constructor() {
		super()
		
		// shadow part inside the element
		this.attachShadow({ mode: 'open' })
			
		// add template, style and imports to the current element
		for(let tag of ["template", "styles", "imports"]) {
			let el = this[tag]
			if(!!el)
				this.shadowRoot.appendChild(Relative.create(el))
		}

		// attributes
		this.state = new Proxy(
			this,
			{
				get: (target, name) => {
					if(target.hasAttribute(name))
						try { return JSON.parse(target.getAttribute(name)) }
						catch (ex){	return target.getAttribute(name) }
					else
						return undefined
				},
				set: (target, name, value) => {
					if(typeof value === 'object')
						target.setAttribute(name, JSON.stringify(value))
					else
						target.setAttribute(name, value)
						
					return true
				}
			}
		)
	}
	
	get template() {
		return this.getComponentSnippet("template")
	}
	
	get styles() {
		return this.getComponentSnippet("style")
	}
	
	get imports() {
		return this.getComponentSnippet("imports")
	}
	
	getComponentSnippet(tag) {
		try{
			return this.constructor.here.querySelector(tag) || undefined
		}
		catch(ex){
			return undefined
		}
	}

	// Initialize component
	static define({name, constructor}) {
		// if no name defined, find out a name based on the class
		if(name === undefined)
			name = constructor.name.replace(/\.?([A-Z]+)/g, (x,y) => `-${y.toLowerCase()}`).replace(/^-/, "")

		// save it's name to "is" property
		constructor.is = name
		
		// find out where we are executing the script
		constructor.here = (
				document.currentScript.ownerDocument 
			||	document
		).querySelector("[component='" + name + "']")
			
		// define as an window customElement
		window.customElements.define(
			name,
			constructor
		)
	}
	
	// Create element from html string, tag or template
	static create(html) {
		//console.log(html)
		if(html instanceof Element) {
			// import from template
			if(!!html.content)
				return document.importNode(html.content, true)
			// create a copy
			else
				return html.cloneNode(true)
		}
		else if(!!html) {
			// if it's a tag, create a fragment
			if(html.trim().startsWith("<")) {
				var	i
					,a=document.createElement("div")
					,b=document.createDocumentFragment();
					a.innerHTML=html;
				while(i=a.firstChild)b.appendChild(i);
				
				if(b.children[0].tagName == "TEMPLATE")
					return Relative.create(b.children[0])
				else
					return 	b.children.length == 1
							?	b.children[0]
							:	b.children
			}
			// if it's a tag name, call itself
			else {
				return Relative.create(`<${html}>`)
			}
		}
	}

	// watch for changes
	static watch({name, element, callback, options}) {
		// create watchers property if it doesn't exist
		if(element.watchers === undefined)
			element.watchers = {}
			
		// disconnect it there's a watcher with the same name
		if(element.watchers[name])
			element.watchers[name].disconnect()

		// create new watcher
		element.watchers[name] = new MutationObserver(callback)
		
		// start watching
		element.watchers[name]
			.observe(
				element,
				options
			)
	}
}