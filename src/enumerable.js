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
