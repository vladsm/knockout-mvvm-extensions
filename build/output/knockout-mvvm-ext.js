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
(function(utils) {

ko.mvvm.enumerable = {
	foreach: function(collection, action, context) {
		ensureCollection(collection);
		if (!utils.isFunction(action)) throw "Action is not a function";

		if (utils.defined(context)) {
			action = action.bind(context);
		}
		
		for (var i = 0; i < collection.length; ++i) {
			action(collection[i], i);
		}
	},

	where: function(collection, predicate, predicateContext) {
		ensureCollection(collection);
		if (!utils.isFunction(predicate)) throw "Predicate is not a function";

		if (utils.defined(predicateContext)) {
			predicate = predicate.bind(predicateContext);
		}
		
		var result = [];
		ko.mvvm.enumerable.foreach(collection, function(item) {
			if (predicate(item)) {
				result.push(item);
			}
		});

		return result;
	},

	first: function(collection, predicate, defaultValue, predicateContext) {
		var filteredCollection;

		if (predicate != null) {
			filteredCollection = ko.mvvm.enumerable.where(collection, predicate, predicateContext);
		}
		else {
			filteredCollection = collection;
		}

		if (filteredCollection != null && filteredCollection.length > 0) {
			return filteredCollection[0];
		}

		if (utils.defined(defaultValue)) return defaultValue;

		throw "Out of range";
	}

//	$: function(collection) {
//		return new EnumerableWrapper(collection);
//	}
};

var collectionNullReferenceException = "Collection is null reference";

function ensureCollection(collection) {
	if (collection == null) {
		throw "Collection is null reference";
	}
	if (!utils.isArray(collection)) {
		throw "Collection object is invalid";
	}
}

//var EnumerableWrapper = Class.define({
//	initialize: function(collection) {
//		if (!(collection instanceof EnumerableWrapper) || !utils.isArray(collection)) {
//			throw new "Object is not supported as an enumerable";
//		}
//		this.collection = collection;
//	}
//});

})(ko.mvvm.utils);
(function(utils) {

var dependentObservableTag = "ko$mvvm$observables$dependentObservable";

ko.utils.extend(Function.prototype,
{
	asDependentObservable: function(name) {
		if (!utils.isFunction(this)) throw "asDependentObservable marker is applicaple to functions only";
		this[dependentObservableTag] = { name: name, read: this, write: null };
		return extendable(this);
	},
	asDependentObservableWrite: function(name) {
		if (!utils.isFunction(this)) throw "asDependentObservableWrite marker is applicaple to functions only";
		this[dependentObservableTag] = { name: name, read: null, write: this };
		return extendable(this);
	}
});

function extendable(fn) {
	fn.extend = function(ext) {
		fn[dependentObservableTag].extendProps = ext;
		return fn;
	};
	return fn;
};


if (!utils.defined(ko.mvvm.observables)) {
	ko.mvvm.observables = {};
}

ko.mvvm.observables.registerDependents = function(viewModel) {
	var dependentObservables = {};
	var dependentObservable;
	for (var memberName in viewModel) {
		var member = viewModel[memberName];
		if (!utils.isFunction(member)) continue;

		dependentObservable = member[dependentObservableTag];
		if (!utils.defined(dependentObservable)) continue;

		if (dependentObservable.name == null) dependentObservable.name = memberName;

		var registeredDependentObservable = dependentObservables[dependentObservable.name];
		if (registeredDependentObservable == null) {
			dependentObservables[dependentObservable.name] = dependentObservable;
		}
		else {
			for (var n in dependentObservable) {
				if (dependentObservable[n] != null) {
					registeredDependentObservable[n] = dependentObservable[n];
				}
			}
		}
	}
	for (var name in dependentObservables) {
		dependentObservable = dependentObservables[name];
		if (dependentObservable.read == null) {
			throw "Dependent observable '" + name + "' is incorrectly defined.";
		}
		var viewModelProp = ko.dependentObservable(
			{
				read: dependentObservable.read,
				write: dependentObservable.write,
				owner: viewModel
			}
		);
		if (dependentObservable.extendProps) {
			viewModelProp = viewModelProp.extend(dependentObservable.extendProps);
		}
		viewModel[name] = viewModelProp;
	}
};

})(ko.mvvm.utils);
ko.mvvm.binding = {
	register: function(bindingName, bindingClass) {
		var bindingHandler = new bindingClass();
		ko.bindingHandlers[bindingName] = bindingHandler;
	}
};


ko.mvvm.binding.BaseBinding = Class.define({
	initialize: function() {
		this.init = this.initBinding.bind(this);
		this.update = this.updateBinding.bind(this);
	},
	
	initBinding: function(element, valueAccessor, allBindingsAccessor, viewModel) {},
	
	updateBinding: function(element, valueAccessor, allBindingsAccessor, viewModel) {},

	unwrap: function(value) {
		if (value == null) return null;
		return ko.utils.unwrapObservable(value);
	}
});


ko.mvvm.binding.BindingWrap = Class.define(ko.mvvm.binding.BaseBinding,
{
	initialize: function(bindingHandlerName) {
		ko.mvvm.binding.BindingWrap.base.initialize.call(this);

		this.bindingHandler = ko.bindingHandlers[bindingHandlerName];
	},

	initBinding: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		if (this.bindingHandler.init) {
			this.bindingHandler.init(element, valueAccessor, allBindingsAccessor, viewModel);
		}
	},

	updateBinding: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		if (this.bindingHandler.update) {
			this.bindingHandler.update(element, valueAccessor, allBindingsAccessor, viewModel);
		}
	}
});
