(function() {

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

	abstract: function(methodDeclaration) {
		return abstractStub;
	}
};

var abstractException = "Abstract method is not overridden.";
var abstractStub = function() {
	throw abstractException;
};
abstractStub.hint = function(message) {
	return function() { throw (message || abstractExceptions); };
}

})();

window.Class = ko.mvvm.Class;
