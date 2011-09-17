(function() {

var Figure = Class.define({
	initialize: function(color) {
		this.color = color;
	},
	getArea: Class.abstract("getArea is not implemented.")
});

var Rectangle = Class.define(Figure, {
	initialize: function(dx, dy, color) {
		Rectangle.base.initialize.call(this, color);
		this.dx = dx;
		this.dy = dy;
	},

	getArea: function() {
		return this.dx*this.dy;
	}
});

var Square = Class.define(Rectangle, {
	initialize: function(dx, color) {
		Square.base.initialize.call(this, dx, dx, color);
	}
});


module("Object-oriented coding style utils");

test("The class is defined", function() {
	ok(typeof Figure != "undefined");
	ok(Figure != null);
});

test("The instance of the class is created", function() {
	var figure = new Figure();
	
	ok(figure != null);
	ok(figure instanceof Figure);
});

test("The instance of the class contains initializer and methods", function() {
	var figure = new Figure();
	
	function isDefinedMethod(method) {
		defined(method);
		ok(ko.mvvm.utils.isFunction(method));
	}

	isDefinedMethod(figure.initialize);
	isDefinedMethod(figure.getArea);
});

test("The class instance initializer (aka constructor) is invoking while instance creating", function() {
	var originalInitialize = Figure.prototype.initialize;
	Figure.prototype.initialize = function() {
		originalInitialize.apply(this, arguments);
		ok(true);
	};
	var figure = new Figure();
	Figure.prototype.initialize = originalInitialize;

	expect(1);
});

test("The instance member are initializing in constructor", function() {
	var figure = new Figure("red");
	
	equal(figure.color, "red");
});

test("The abstract method throws exception", function() {
	var figure = new Figure();

	raises(
		figure.getArea,
		function(ex) {
			return ex == "getArea is not implemented.";
		}
	);
});

test("Base constructor is invoking when it is requested and initializes inherited members of the instance", function() {
	var originalInitialize = Figure.prototype.initialize;
	Figure.prototype.initialize = function() {
		originalInitialize.apply(this, arguments);
		ok(true);
	};
	var rectangle = new Rectangle(10, 6, "blue");
	
	Figure.prototype.initialize = originalInitialize;

	equal(rectangle.color, "blue");
	expect(2);
});

test("Methods are overriding by the derived class", function() {
	var originalGetArea = Rectangle.prototype.getArea;
	Rectangle.prototype.getArea = function() {
		originalGetArea.apply(this, arguments);
		ok(true);
	}
	var rectangle = new Rectangle(10, 6, "blue");
	
	notRaises(rectangle.getArea);
	expect(2);

	Rectangle.prototype.getArea = originalGetArea;
});

test("Methods are inherited from the base class", function(){
	var square = new Square(10, "green");
	
	ok(square.getArea != null && ko.mvvm.utils.isFunction(square.getArea));
	var area = square.getArea();
	equal(area, 100);
});

})();
