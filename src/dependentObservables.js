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
