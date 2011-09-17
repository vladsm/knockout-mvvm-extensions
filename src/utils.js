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
