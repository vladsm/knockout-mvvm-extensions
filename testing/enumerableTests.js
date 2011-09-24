(function(enumerable, utils) {

module("Enumerable utils");

test("ko.mvvm.enumerable member methods throw exceptions on invalid input", function() {
	var methods = [
		{
			method: "foreach",
			arguments: [utils.emptyFunction]
		},
		{
			method: "where",
			arguments: [utils.emptyFunction]
		},
		{
			method: "first",
			arguments: [utils.emptyFunction, null]
		},
	];
	var collectionCases = [
		{
			collection: null,
			exception: "Collection is null reference"
		},
		{ collection: {} },
		{ collection: 1 },
		{ collection: "string" },
		{ collection: utils.emptyFunction },
		{ collection: new Date() }
	];
	for (var i = 0; i < methods.length; ++i) {
		var method = methods[i];
		for (var j = 0; j < collectionCases.length; ++j) {
			var args = [collectionCases[j].collection].concat([method.arguments]);
			raises(
				function() { enumerable[method.method].apply(enumerable, args); },
				function(ex) { return ex == (collectionCases[j].exception || "Collection object is invalid"); }
			);
		}
	}
});

test("ko.mvvm.observable.foreach() throws exception on invalid action", function() {
	var actions = [null, {}, 1, "string", new Date(), []];
	for (var i = 0; i < actions.length; ++i) {
		raisesString(
			function() {enumerable.foreach([1,2], actions[i]);},
			"Action is not a function"
		);
	}
});

test("ko.mvvm.enumerable.foreach() doesn't call action on empty collection", function() {
	var count = 0;
	enumerable.foreach([], function() {
		count++;
	});
	ok(count == 0, "The action shouldn't be called");
});

test("ko.mvvm.enumerable.foreach() enumerates correctly", function() {
	var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	var foreachIsOk = true;
	var currentIndex = 0;
	var action = function(item, index) {
		if (item != numbers[currentIndex] || index != currentIndex) {
			foreachIsOk = false;
		}
		currentIndex++;
	}
	enumerable.foreach(numbers, action);
	ok(foreachIsOk);
	equal(currentIndex, 10);
});

test("ko.mvvm.enumerable.foreach() passes valid context object to action", function() {
	enumerable.foreach([1], function() { equal(this, "Custom context"); }, "Custom context");
});

function even(n) { return n%2 == 0; }

test("ko.mvvm.enumerable.where() filters correctly", function() {
	same(enumerable.where([], function() { return true; }), []);
	same(enumerable.where([], function() { return false; }), []);
	same(enumerable.where([1, 2, 3], function() { return false; }), []);
	same(enumerable.where([1, 2, 3], function() { return true; }), [1, 2, 3]);
	same(enumerable.where([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], even), [2, 4, 6, 8, 10]);
});

test("ko.mvvm.enumerable.where() passes valid context object to predicate", function() {
	enumerable.where([1], function() { equal(this, "Custom context"); }, "Custom context");
});

test("ko.mvvm.enumerable.first return correct first item", function() {
	equal(enumerable.first([1, 2, 3]), 1);
	equal(enumerable.first([1, 2, 3, 4, 5, 6], even), 2);
});

test("ko.mvvm.enumerable.first throws exception when there are no items and defaults", function() {
	var outOfRangeEx = "Out of range";
	raisesString(function() { enumerable.first([]); }, outOfRangeEx);
	raisesString(function() { enumerable.first([1, 3, 5], even); }, outOfRangeEx);
	expect(2);
});

test("ko.mvvm.enumerable.first returns default value when there are no items and default is specified", function() {
	equal(enumerable.first([], null, null), null);
	equal(enumerable.first([], null, 1000), 1000);
	equal(enumerable.first([1, 3, 5], even, null), null);
	equal(enumerable.first([1, 3, 5], even, 1000), 1000);
});

})(ko.mvvm.enumerable, ko.mvvm.utils);
