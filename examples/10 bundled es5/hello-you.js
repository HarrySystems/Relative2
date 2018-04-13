"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Relative = function (_HTMLElement) {
	_inherits(Relative, _HTMLElement);

	function Relative() {
		_classCallCheck(this, Relative);

		// shadow part inside the element
		var _this = _possibleConstructorReturn(this, (Relative.__proto__ || Object.getPrototypeOf(Relative)).call(this));

		_this.attachShadow({ mode: 'open' });

		// add template, style and imports to the current element
		var _arr = ["template", "styles", "imports"];
		for (var _i = 0; _i < _arr.length; _i++) {
			var tag = _arr[_i];
			var el = _this[tag];
			if (!!el) _this.shadowRoot.appendChild(Relative.create(el));
		}

		// attributes
		_this.state = new Proxy(_this, {
			get: function get(target, name) {
				if (target.hasAttribute(name)) try {
					return JSON.parse(target.getAttribute(name));
				} catch (ex) {
					return target.getAttribute(name);
				} else return undefined;
			},
			set: function set(target, name, value) {
				if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === 'object') target.setAttribute(name, JSON.stringify(value));else target.setAttribute(name, value);

				return true;
			}
		});
		return _this;
	}

	_createClass(Relative, [{
		key: "getComponentSnippet",
		value: function getComponentSnippet(tag) {
			try {
				return this.constructor.here.querySelector(tag) || undefined;
			} catch (ex) {
				return undefined;
			}
		}

		// Initialize component

	}, {
		key: "template",
		get: function get() {
			return this.getComponentSnippet("template");
		}
	}, {
		key: "styles",
		get: function get() {
			return this.getComponentSnippet("style");
		}
	}, {
		key: "imports",
		get: function get() {
			return this.getComponentSnippet("imports");
		}
	}], [{
		key: "define",
		value: function define(_ref) {
			var name = _ref.name,
			    constructor = _ref.constructor;

			// if no name defined, find out a name based on the class
			if (name === undefined) name = constructor.name.replace(/\.?([A-Z]+)/g, function (x, y) {
				return "-" + y.toLowerCase();
			}).replace(/^-/, "");

			// save it's name to "is" property
			constructor.is = name;

			// find out where we are executing the script
			constructor.here = (document.currentScript.ownerDocument || document).querySelector("[component='" + name + "']");

			// define as an window customElement
			window.customElements.define(name, constructor);
		}

		// Create element from html string, tag or template

	}, {
		key: "create",
		value: function create(html) {
			//console.log(html)
			if (html instanceof Element) {
				// import from template
				if (!!html.content) return document.importNode(html.content, true);
				// create a copy
				else return html.cloneNode(true);
			} else if (!!html) {
				// if it's a tag, create a fragment
				if (html.trim().startsWith("<")) {
					var i,
					    a = document.createElement("div"),
					    b = document.createDocumentFragment();
					a.innerHTML = html;
					while (i = a.firstChild) {
						b.appendChild(i);
					}if (b.children[0].tagName == "TEMPLATE") return Relative.create(b.children[0]);else return b.children.length == 1 ? b.children[0] : b.children;
				}
				// if it's a tag name, call itself
				else {
						return Relative.create("<" + html + ">");
					}
			}
		}

		// watch for changes

	}, {
		key: "watch",
		value: function watch(_ref2) {
			var name = _ref2.name,
			    element = _ref2.element,
			    callback = _ref2.callback,
			    options = _ref2.options;

			// create watchers property if it doesn't exist
			if (element.watchers === undefined) element.watchers = {};

			// disconnect it there's a watcher with the same name
			if (element.watchers[name]) element.watchers[name].disconnect();

			// create new watcher
			element.watchers[name] = new MutationObserver(callback);

			// start watching
			element.watchers[name].observe(element, options);
		}
	}]);

	return Relative;
}(HTMLElement);

Relative.define({
	name: 'hello-you',
	constructor: function (_Relative) {
		_inherits(HelloYou, _Relative);

		function HelloYou() {
			_classCallCheck(this, HelloYou);

			return _possibleConstructorReturn(this, (HelloYou.__proto__ || Object.getPrototypeOf(HelloYou)).apply(this, arguments));
		}

		_createClass(HelloYou, [{
			key: "attributeChangedCallback",
			value: function attributeChangedCallback() {
				if (!!this.state.your_name) this.shadowRoot.innerHTML = "Hello " + this.state.your_name + "!";else this.shadowRoot.innerHTML = "";
			}
		}], [{
			key: "observedAttributes",
			get: function get() {
				return ['your_name'];
			}
		}]);

		return HelloYou;
	}(Relative)
});

Relative.define({
	name: 'hello-input',
	constructor: function (_Relative2) {
		_inherits(HelloInput, _Relative2);

		function HelloInput() {
			_classCallCheck(this, HelloInput);

			return _possibleConstructorReturn(this, (HelloInput.__proto__ || Object.getPrototypeOf(HelloInput)).apply(this, arguments));
		}

		_createClass(HelloInput, [{
			key: "connectedCallback",
			value: function connectedCallback() {
				var _this4 = this;

				var input = this.shadowRoot.querySelector("input");
				input.addEventListener('keyup', function () {
					_this4.state.value = input.value;
				});
			}
		}, {
			key: "template",
			get: function get() {
				return "\n\t\t\t\t<template>\n\t\t\t\t\t<label>Your name:</label>\n\t\t\t\t\t<input type='text'/>\n\t\t\t\t</template>\n\t\t\t";
			}
		}]);

		return HelloInput;
	}(Relative)
});

Relative.define({
	name: 'hello-world',
	constructor: function (_Relative3) {
		_inherits(HelloWorld, _Relative3);

		function HelloWorld() {
			_classCallCheck(this, HelloWorld);

			return _possibleConstructorReturn(this, (HelloWorld.__proto__ || Object.getPrototypeOf(HelloWorld)).apply(this, arguments));
		}

		_createClass(HelloWorld, [{
			key: "connectedCallback",
			value: function connectedCallback() {
				// hello-you
				var you = Relative.create("hello-you");
				this.shadowRoot.append(you);

				// br
				this.shadowRoot.append(Relative.create("br"));

				// input
				var input = Relative.create("<hello-input value='world'>");
				this.shadowRoot.append(input);

				Relative.watch({
					element: input,
					callback: function callback() {
						you.state.your_name = input.state.value;
					},
					options: {
						attributes: true
					}
				});
			}
		}]);

		return HelloWorld;
	}(Relative)
});