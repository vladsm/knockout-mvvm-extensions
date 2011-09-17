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
