function defined(obj, message) {
	return ok(typeof obj != "undefined", message);
}

function notRaises(block, message) {
	try {
		block();
		ok(true, message);
	}
	catch (ex) {
		ok(false, message);
	}
}

function raisesString(block, expectedException, message) {
	raises(block, function(ex) {return ex == expectedException; }, message);
}

function delayedOk(timeout, block, message) {
	window.setTimeout(
		function()
		{
			ok(block, message);
			start();
		},
		timeout
	);
}

function delayedEqual(timeout, actualGetter, expected, message) {
	window.setTimeout(
		function()
		{
			equal(actualGetter(), expected, message);
			start();
		},
		timeout
	);
}

function delayedNotEqual(timeout, actualGetter, expected, message) {
	window.setTimeout(
		function()
		{
			notEqual(actualGetter(), expected, message);
			start();
		},
		timeout
	);
}
