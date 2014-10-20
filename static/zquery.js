/**
 * zQuery v1.0
 * Created By Pro of zetaNetwork for Learning Purposes
 * http://s4.zetaboards.com/zetanetwork
 */
(function(window, document, undefined) {
	//Constructor with an optional element selector.
	var zquery = function(a) {
		//No "new" needed.
		if (this === window){
			return new this.zquery(a);
		}
		//If a selector is defined.
		if (typeof a == 'string') {
		/* 
		if (a.match(/^#/)) {
				a = a.replace(/^#/, '');
				this.a = document.getElementById(a);
		}
		else if (a.match(/^\./)) {
				a = a.replace(/^\./, '');
				a = document.getElementsByClassName(a);
				
				this.a = [];
				
				for(var b = 0; b < a.length; b++){
						this.a.push(a[b]);
				}
		}
		else {
				this.a = document.querySelectorAll(a);
		}
		*/
			//querySelectorAll works with children etc.
			this.a = document.querySelectorAll(a);
		}
		else if (a instanceof HTMLElement) {
			this.a = a;
		}

		//Save this for later.
		var zquery = this;
		//Custom prototype function :r
		this.extend = this.prototype;
		//Internal extend function.
		this.fn = function(a) {
			for (var b in a) {
				this[b] = a[b];
			}
		};
		//Some basic utilities.
		this.fn({
			//Returns whether the provided variable is a string or not.
			isString: function(a) {
				return (typeof a === 'string');
			},
			//Returns whether the provided variable is a number or not.
			isNumber: function(a) {
				return (typeof a === 'number');
			},
			//Returns whether the provided variable is a boolean or not.
			isBoolean: function(a) {
				return (typeof a === 'boolean');
			},
			//Returns whether the provided variable is an object or not.
			isObject: function(a) {
				return (typeof a === 'object');
			},
			//Returns whether the provided variable is a function or not.
			isFunction: function(a) {
				return (typeof a === 'function');
			},
			//Returns whether the provided variable is an array or not.
			isArray: function(a) {
				return (a.constructor === [].constructor);
			},
			isDefined: function(a) {
				return (a !== undefined);
			}
		});
		//Arrays as well as other stuff.
		this.fn({
			//Loops through every element in an array performing a defined function and returns the array.
			each: function(a, d) {
				if (this.isDefined(a)) {
					if (this.isArray(a)) {
						for (var b = 0; b < a.length; b++) {
							if (d) {
								d(a[b]);
							}
						}
					}
					else {
						for (var b = 0; b < this.a.length; b++) {
							a(this.a[b]);
						}
					}
				}
				return this.isArray(a) ? a : this;
			},
			//JavaScript equivilant of the PHP htmlspecialchars.
			htmlspecialchars: function(a) {
				var b = document.createElement('div');
				a = document.createTextNode(a);
				b.appendChild(a);
				a = b.innerHTML;
				document.removeChild(b);
				return a;
			},
			//Return/change the text of an element.
			text: function(a) {
				if (this.isDefined(a)) {
					//Encode all html characters
					a = this.htmlspecialchars(a);
					this.each(function(b) {
						b.innerHTML = a;
					});
					return this;
				}
				else {
					this.each(function(b) {
						var c = b.innerHTML;
						c = c.replace(/<[^<]>/g, '');
						return c;
					});
				}
			},
			//Returns/changes the html of an element.
			html: function(a) {
				if (this.isDefined(a)) {
					this.each(function(b) {
						b.innerHTML = a;
					});
					return this;
				}
				else {
					return this.a[0].innerHTML;
				}
			}
		});

		//AJAX methods.
		this.fn({
			//AJAX method to perform AJAX requests.
			ajax: function(a) {
				//Default AJAX parameters.
				var b = {
					async: true,
					type: '',
					url: '',
					username: '',
					password: '',
					post: '',
					success: '',
					failure: ''
				};
				//Add any unprovided parameters with the default ones.
				for (var c in b) {
					if (!a.hasOwnProperty(c)) {
						a[c] = b[c];
					}
				}
				//Determine which object to create.
				var d = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
				//When the request is finished.
				d.onreadystatechange = function() {
					if (d.readyState === 4) {
						//If the request was performed successfully.
						if (d.status === 200) {
							//Execute the success function if any.
							if (a.success) {
								//Return the reponseText or responseXML depending on the request type.
								a.success(a.type === 'XML' ? d.responseXML : d.responseText);
							}
						}
						//If the request was a failure execute the failure function if provided.
						else {
							a.failure();
						}
					}
				};
				//If the request type is POST.
				if (a.type === 'POST') {
					d.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
					//Open a new AJAX request.
					d.open(a.type, a.url, a.async, a.username, a.password);
					//Load any possible post parameters
					var e = '';
					for (var f in a.post) {
						e += f + '=' + a.post[f] + '&';
					}
					//Make sure that the post parameters don't have that last & and send the request.
					e.replace(/$&/, '');
					d.send(e);
				}
				else {
					//Open a new AJAX request and send it.
					d.open(a.type, a.url, a.async, a.username, a.password);
					d.send();
				}
			},
			// /Get method to perform basic GET requests.
			get: function(a, b) {
				//If a callback function is defined.
				if (this.isDefined(b)) {
					this.ajax({
						type: 'GET',
						url: a,
						success: b
					});
				}
				//If no callback function is defined.
				else {
					this.ajax({
						type: 'GET',
						url: a
					});
				}
			},
			//Post method to perform basic POST requests.
			post: function(a, b, c) {
				//If any callback functions or post parameters are specified.
				if (this.isDefined(b)) {
					if (this.isDefined(c)) {
						//Callback function.
						this.ajax({
							type: 'POST',
							url: a,
							post: b,
							success: c
						});
					}
					else {
						//Callback function.
						if (this.isFunction(b)) {
							this.ajax({
								type: 'POST',
								url: a,
								success: b
							});
						}
						//Post parameters.
						else if (this.isObject(b)) {
							this.ajax({
								type: 'POST',
								url: a,
								post: b
							});
						}
					}
				}
				//Only the URL is provided.
				else {
					this.ajax({
						type: 'POST',
						url: a
					});
				}
			},
			//Loads the contents of a page into that of an element.
			load: function(a) {
				this.ajax({
					type: 'GET',
					url: a,
					success: function(b) {
						var c = this.a;
						if (c instanceof HTMLElement) {
							c.innerHTML = b;
						}
						else {
							for (var d = 0; d < c.length; d++) {
								c[d].innerHTML = b;
							}
						}
					}
				});
			}
		});
		//Event handlers.
		this.fn({
			//Event bind function to bind events.
			bind: function(a, b, f) {
				var c = this.a;
				var e = !! document.addEventListener ? 'addEventListener' : 'attachEvent';
				var g = this.isDefined(f) ? f : false;
				if (c instanceof HTMLElement) {
					c[e](a, b(c), g);
				}
				else {
					for (var d = 0; d < c.length; d++) {
						c[d][e](a, b(c[d]), g);
					}
				}
				return this;
			},
			//Unbind events.
			unbind: function(a, b, f) {
				var c = this.a;
				var e = !! document.addEventListener ? 'removeEventListener' : 'detachEvent';
				var g = this.isDefined(f) ? f : false;
				if (c instanceof HTMLElement) {
					c[e](a, b(c), g);
				}
				else {
					for (var d = 0; d < c.length; d++) {
						c[d][e](a, b(c[d]), g);
					}
				}
				return this;
			},
			//Event handler for clicks, essentially the bind function using click.
			click: function(a) {
				this.bind('click', a);
				return this;
			},
			//Event handler for hover
			hover: function(a, b) {
				this.bind('mouseenter', a);
				if (this.isDefined(b)) {
					this.bind('mouseleave', b);
				}
				return this;
			}
		});
		//Element attributes
		this.fn({
			getAttr: function(a) {
				var b = this.a;
				if (b instanceof HTMLElement) {
					return !b.hasAttr(a) ? null : b.getAttribute(a);
				}
				else {
					var c = [];
					for (var n = 0; n < b.length; n++) {
						c.push(b[n].getAttribute(a));
					}
					return c;
				}
			},
			setAttr: function(a, c) {
				var b = this.a;
				if (b instanceof HTMLElement) {
					if (b.hasAttr(a)) {
						b.setAttribute(a, c);
						return true;
					}
					else {
						return null;
					}
				}
				else {
					var d = [];
					for (var n = 0; n < b.length; n++) {
						if (b[n].hasAttr(a)) {
							b[n].setAttribute(a, c);
							d.push(true);
						}
						else {
							d.push(null);
						}
					}
					return d;
				}
			},
			hasAttr: function(a) {
				var b = this.a;
				if (b instanceof HTMLElement) {
					return b.hasAttribute(a) !== null && b.hasAttribute(a) !== false ? true : false;
				}
				else {
					var c = [];
					for (var n = 0; n < b.length; b++) {
						if (b[n].hasAttribute(a) !== null && b.hasAttribute(a) !== false) {
							c.push(true);
						}
						else {
							c.push(false);
						}
					}
					return c;
				}
			},
			attr: function(a, b) {
				if (this.isDefined(b)) {}
				else {}
			}
		});
		//Return this to enable chaining.
		return this;
	};
	//Access shortcuts.
	if (!window.$) {
		window.$ = window.zq = window.zquery = zquery;
	}
	else {
		window.$$ = window.zq = window.zquery = zquery;
	}
})(this, document);