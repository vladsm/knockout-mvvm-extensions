ko.mvvm.Class =
{
	define: function(baseClass, prototypeContent) {
		if (typeof prototypeContent == "undefined" && typeof baseClass != "undefined") {
			prototypeContent = baseClass;
			baseClass = null;
		}
		if (typeof prototypeContent == "undefined") {
			prototypeContent = {};
		}

		function theClass() {
			this.initialize.apply(this, arguments);
		}

		theClass.prototype.constructor = theClass;

		if (baseClass) {
			var subclass = function() { };
			subclass.prototype = baseClass.prototype;
			theClass.prototype = new subclass();
			theClass.base = baseClass.prototype;
		}

		for (var prototypeItemName in prototypeContent) {
			theClass.prototype[prototypeItemName] = prototypeContent[prototypeItemName];
		}

		if (!theClass.prototype.initialize) {
			theClass.prototype.initialize = function() { };
		}

		return theClass;
	},

	abstract: function(message) {
		return function() { throw message || "Abstract method is not overridden."; };
	}
};

window.Class = ko.mvvm.Class;
