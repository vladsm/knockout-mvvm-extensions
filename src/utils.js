if (typeof ko.mvvm.utils == "undefined") {
	ko.mvvm.utils = {};
}

ko.utils.extend(ko.mvvm.utils, {
	defined: function(obj) {
		return (typeof obj != "undefined");
	},

	isFunction: function(func) {
		return (typeof func == "function");
	},
		
	emptyFunction: function() {},

	isArray: function(obj) {
		if (obj == null) return false;
		return Object.prototype.toString.call(obj) == "[object Array]";
	}
});
