(function() {

module ("Common utils");

test("ko.mvvm.utils.isDefined works correctly", function() {
	var obj = {};
	var undefinedObj;

	defined(ko.mvvm.utils.isDefined);
	ok(ko.mvvm.utils.isDefined(obj));
	ok(!ko.mvvm.utils.isDefined());
	ok(!ko.mvvm.utils.isDefined(undefinedObj));
	ok(ko.mvvm.utils.isDefined(null));
	ok(ko.mvvm.utils.isDefined(false));
	ok(ko.mvvm.utils.isDefined(0));
	ok(ko.mvvm.utils.isDefined(""));
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

})();
