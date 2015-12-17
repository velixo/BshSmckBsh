function World() {
	this.obstacles = [];

	this.add = function(obstacle) {
		console.log(obstacle.name + " added to world");
		this.obstacles[this.obstacles.length] = obstacle;
	};

	this.verticalCollision = function(player) {
		for (var i = 0; i < this.obstacles.length; i++) {
			var collision = this.obstacles[i].verticalCollision(player);
			if (collision) return this.obstacles[i].getCollisionInfo(player);
		}
		return NO_COLLISION;
	};

	this.horizontalCollision = function(player) {
		for (var i = 0; i < this.obstacles.length; i++) {
			var collision = this.obstacles[i].horizontalCollision(player);
			if (collision) return this.obstacles[i].getCollisionInfo(player);
		}
		return NO_COLLISION;
	};

	this.update = function() {
		for (var i = 0; i < this.obstacles.length; i++) {
			this.obstacles[i].update();
		};
	}
}

function Entity(x, y, name) {
	this.x = x;
	this.y = y;
	this.name = evalArg(name, "entity")
}

function CollisionInfo(collidedObj, collidedX, collidedY, collidedEdge) {
	this.collidedObj = collidedObj;
	this.collidedX = collidedX;
	this.collidedY = collidedY;
	this.collidedEdge = collidedEdge;
	this.toString = function() {
		return "[CollisionInfo: " + collidedObj.name + ", " + collidedX + ", "
								+ collidedY + ", " + collidedEdge + "]"
	}
}
var NO_COLLISION = new CollisionInfo(undefined, NaN, NaN, "");

function Rectangle(x, y, width, height, name) {
	Entity.call(this, x, y, name);
	this.width = width;
	this.height = height;

	this.getCollisionInfo = function(other) {
		var lEdge = this.x;
		var	rEdge = this.x + this.width;
		var otherLEdge = other.x;
		var	otherREdge = other.x + other.width;
		if (otherREdge >= lEdge && otherLEdge <= lEdge) {
			return new CollisionInfo(this, this.x - other.width, NaN, "left");
		} else if (otherLEdge <= rEdge && otherREdge >= rEdge) {
			return new CollisionInfo(this, this.x + this.width, NaN, "right");
		} else {
			return new CollisionInfo(this, NaN, NaN, "inside");
		}
	}
}

function Player(x, y, height, world) {
	Rectangle.call(this, x, y, height, height, "player");
	var xdir = 0;
	var xvel = 0.2;
	var yvel = 0.2;
	var world = world;

	this.update = function(deltatime) {
		this._updatePos(deltatime);
	};

	this._updatePos = function(deltatime) {
		var collInfo = world.horizontalCollision(this);
		if (typeof collInfo.collidedObj !== 'undefined') {
			console.log(collInfo.toString());
		}

		xdir = 0;
		if (keyPressed.D) {
			console.log("moving right x=" + this.x);
			xdir += 1;
		}
		if (keyPressed.A) {
			console.log("moving left x=" + this.x);
			xdir -= 1;
		}

		if (xdir === 1 && collInfo.collidedEdge === "left" ||
			xdir === -1 && collInfo.collidedEdge === "right") {
			this.x = collInfo.collidedX;
			console.log("Player collided! x=" + this.x)
		} else {
			this.x += xdir * xvel * deltatime;
		}
	}
}

//======== Barriers ========

function Floor(thickness) {
	Rectangle.call(this, 0, canvas.height - thickness, canvas.width, thickness, "floor");
	this.name = 'floor';

	this.verticalCollision = function(player) {
		return (player.y >= this.y);
	}

	this.horizontalCollision = function(player) {
		return false;
	}

	this.update = function() {
		this.y = canvas.height - thickness;
		this.width = canvas.width;
	}

	world.add(this);
}


function Wall(alignment, thickness) {
	this.alignment = alignment;

	if (alignment === 'left') {
		Rectangle.call(this, 0, 0, thickness, canvas.height, alignment + " wall");
	} else if (alignment === 'right') {
		Rectangle.call(this, canvas.width - thickness, 0, thickness, canvas.height, alignment + " wall");
	}

	this.verticalCollision = function(player) {
		return false;
	}

	this.horizontalCollision = function(player) {
		if (this.alignment === 'left') {
			return player.x <= this.width;
		} else if (this.alignment === 'right') {
			return player.x + player.width >= this.x;
		}
		return false;
	}

	this.update = function() {
		if (this.alignment === 'left') {
			this.x = 0;
		} else if (this.alignment === 'right') {
			this.x = canvas.width - thickness;
		}
		this.height = canvas.height;
	}

	world.add(this);
}

