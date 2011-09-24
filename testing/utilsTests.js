(function() {

module ("Common utils");

test("ko.mvvm.utils.defined works correctly", function() {
	var obj = {};
	var undefinedObj;

	defined(ko.mvvm.utils.defined);
	ok(ko.mvvm.utils.defined(obj));
	ok(!ko.mvvm.utils.defined());
	ok(!ko.mvvm.utils.defined(undefinedObj));
	ok(ko.mvvm.utils.defined(null));
	ok(ko.mvvm.utils.defined(false));
	ok(ko.mvvm.utils.defined(0));
	ok(ko.mvvm.utils.defined(""));
});

test("ko.mvvm.utils.isFunction works correctly", function() {
	function func() {return 0;}

	defined(ko.mvvm.utils.isFunction);
	ok(ko.mvvm.utils.isFunction(ko.mvvm.utils.emptyFunction));
	ok(ko.mvvm.utils.isFunction(function(){}));
	ok(ko.mvvm.utils.isFunction(func));
	ok(ko.mvvm.utils.isFunction(window.alert));
	ok(!ko.mvvm.utils.isFunction());
	ok(!ko.mvvm.utils.isFunction(null));
	ok(!ko.mvvm.utils.isFunction(window));
	ok(!ko.mvvm.utils.isFunction(1));
	ok(!ko.mvvm.utils.isFunction("function"));
	ok(!ko.mvvm.utils.isFunction({}));
});

test("ko.mvvm.utils.emptyFunction is defined", function() {
	defined(ko.mvvm.utils.emptyFunction);
	ok(ko.mvvm.utils.isFunction(ko.mvvm.utils.emptyFunction));
});

test("ko.mvvm.utils.isArray works correctly", function() {
	defined(ko.mvvm.utils.isArray);
	ok(ko.mvvm.utils.isArray([]));
	ok(ko.mvvm.utils.isArray([1,2,3]));
	ok(!ko.mvvm.utils.isArray({}));
	ok(!ko.mvvm.utils.isArray(null));
	ok(!ko.mvvm.utils.isArray(""));
	ok(!ko.mvvm.utils.isArray("123"));
	ok(!ko.mvvm.utils.isArray(new Date()));
	ok(!ko.mvvm.utils.isArray(function() {return 0;}));
});

})();
