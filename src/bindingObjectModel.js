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
