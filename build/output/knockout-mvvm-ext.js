// Knockout MVVM Extensions JavaScript library v0.1
// (c) 2011 Vladimir Smirnov (vladsm@gmail.com)
// License: MIT (http://www.opensource.org/licenses/mit-license.php)
// 
// jQuery and Knockout javascript libraries are required to be referenced.
(function() {

	if (typeof window.ko == "undefined") {
		throw "Knockout Javascript framework is not found."
	}

	if (typeof window.ko.mvvm == "undefined") {
		ko.mvvm = {};
	}

})();
if (typeof ko.mvvm.utils == "undefined") {
	ko.mvvm.utils = {};
}

ko.utils.extend(
	ko.mvvm.utils,
	{
		isDefined: function(obj) {
			return (typeof obj != "undefined");
		},

		isFunction: function(func) {
			return (typeof func == "function");
		},
		
		emptyFunction: function() {}
	}
);
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
