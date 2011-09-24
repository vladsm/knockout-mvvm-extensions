$(document).ready(function() {

var utils = ko.mvvm.utils;

var Product = Class.define({
	initialize: function(id, title)
	{
		this.id = id;
		this.title = title;
	}
});

var ProductList = Class.define({
	initialize: function(products) {
		this.products = products;
		this.selectedProductId = ko.observable(null);

		ko.mvvm.observables.registerDependents(this);
	},
	
	selectedProduct: function() {
		var selectedProductId = this.selectedProductId();
		if (selectedProductId == null) {
			return null;
		}
		else {
			return ko.mvvm.enumerable.first(this.products, function(p) {return p.id == selectedProductId;}, null);
		}
	}.asDependentObservable(),

	setSelectedProduct: function(product) {
		this.selectedProductId(product == null ? null : product.id);
	}.asDependentObservableWrite("selectedProduct"),

	selectedProductTitle: function() {
		var p = this.selectedProduct();
		return p == null ? "" : p.title;
	}.asDependentObservable(),

	setSelectedProductTitle: function(title) {
		var product = ko.mvvm.enumerable.first(this.products, function(p) {return p.title == title;}, null);
		this.selectedProduct(product);
	}.asDependentObservableWrite("selectedProductTitle"),

	throttled1SelectedProductId: function() {
		return this.selectedProductId();
	}.asDependentObservable().extend({throttle: 500}),

	throttled2SelectedProductId: function() {
		return this.selectedProductId();
	}.asDependentObservable(),

	setThrottled2SelectedProductId: function(id) {
		this.selectedProductId(parseInt(id));
	}.asDependentObservableWrite("throttled2SelectedProductId").extend({throttle: 500})
});

var viewModel;

function bindViewModel() {
	viewModel = new ProductList([
		new Product(1, "Banana"),
		new Product(2, "Grape"),
		new Product(3, "Apple"),
		new Product(4, "Orange")
	]);

	ko.applyBindings(viewModel, $("#dependentObservablesTests")[0]);
}

module("Dependent observable markers");

test("Method marked with asDependentObservable() is a depenedent observable reader", function() {
	bindViewModel();

	viewModel.selectedProductId(3);
	equal(viewModel.selectedProductId(), 3);
	equal($("#dependentObservablesTests_selectedProductId").text(), "3");
	equal($("#dependentObservablesTests_selectedProductTitle").val(), "Apple");
});

test("Method marked with asDependentObservableWrite() is a depenedent observable writer", function() {
	bindViewModel();
	
	$("#dependentObservablesTests_selectedProductTitle").val("Grape").change();
	equal(viewModel.selectedProductId(), 2);
	equal($("#dependentObservablesTests_selectedProductId").html(), "2");
	equal($("#dependentObservablesTests_selectedProductTitle").val(), "Grape");
});

test("Methods marked with asDependentObservable() are extendable with 'throttle'", function() {
	bindViewModel();

	viewModel.selectedProductId(3);

	var div = $("#dependentObservablesTests_throttled1SelectedProductId");
	notEqual(div.html(), "3", "Dependent observables are not calculating synchronously");

	stop();
	delayedNotEqual(300, function() { return div.html(); }, "3", "Dependent observables are not calculating until timeout has elapsed");

	stop();
	delayedEqual(700, function() { return div.html(); }, "3", "Dependent observables are calculating after timeout has elapsed");
});

test("Methods marked with asDependentObservableWrite() are extendable with 'throttle'", function() {
	bindViewModel();

	var input = $("#dependentObservablesTests_throttled2SelectedProductId");

	input.val("1").change();
	notEqual(viewModel.selectedProductId(), 1, "Dependent observable writers are not called synchronously");

	stop();
	delayedNotEqual(300, function() { return viewModel.selectedProductId(); }, 1, "Dependent observable writers are not called timeout has elapsed");
	stop();
	delayedEqual(700, function() { return viewModel.selectedProductId(); }, 1, "Dependent observable writers are called after timeout has elapsed");
});

});
