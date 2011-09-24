$(document).ready(function() {

var utils = ko.mvvm.utils;

var TestBinding = Class.define(ko.mvvm.binding.BaseBinding, {
	initBinding: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		TestBinding.base.initBinding.apply(this, arguments);
		this.unwrap(valueAccessor());
		ok(true, "Binding has been initialized");
	},

	updateBinding: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		TestBinding.base.updateBinding.apply(this, arguments);
		this.unwrap(valueAccessor());
		ok(true, "Binding has been updated");
	}
});

module("Bindings object model");

test("ko.mvvm.binding is defined", function() {
	ok(utils.defined(ko.mvvm.binding), "ko.mvvm.binding is defined");
});

test("Bindings can be defined using binding object model", function() {
	ko.mvvm.binding.register("test", TestBinding);

	var testBindingHandler = ko.bindingHandlers.test;
	ok(utils.defined(testBindingHandler), "Binding handler is defined");
	ok(utils.defined(testBindingHandler.init) && utils.isFunction(testBindingHandler.init), "Binding handler has init function");
	ok(utils.defined(testBindingHandler.update) && utils.isFunction(testBindingHandler.update), "Binding handler has update function");

	var viewModel= {value: ko.observable(1)};
	ko.applyBindings(viewModel, $("#bindingObjectModelTests1")[0]);
	viewModel.value(2);
	expect(6);

	delete ko.bindingHandlers.test;
});

var DerivedTestBinding = Class.define(ko.mvvm.binding.BindingWrap, {
	initialize: function() {
		DerivedTestBinding.base.initialize.call(this, "baseTest");
	},

	initBinding: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		DerivedTestBinding.base.initBinding.apply(this, arguments);
		ok(true, "Derived binding has been initialized");
	},

	updateBinding: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		DerivedTestBinding.base.updateBinding.apply(this, arguments);
		ok(true, "Derived binding has been updated");
	}
});

test("The wraps over the existing binding handlers can be overridden", function() {
	ko.mvvm.binding.register("baseTest", TestBinding);
	ko.mvvm.binding.register("derivedTest", DerivedTestBinding);

	var viewModel= {value: ko.observable(1)};
	ko.applyBindings(viewModel, $("#bindingObjectModelTests2")[0]);
	viewModel.value(2);
	expect(6);

	delete ko.bindingHandlers.baseTest;
	delete ko.bindingHandlers.derivedTest;
});

});
