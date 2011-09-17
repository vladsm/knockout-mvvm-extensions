(function() {

	if (typeof window.ko == "undefined") {
		throw "Knockout Javascript framework is not found."
	}

	if (typeof window.ko.mvvm == "undefined") {
		ko.mvvm = {};
	}

})();
