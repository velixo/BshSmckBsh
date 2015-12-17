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

function Entity(x, y) {
	this.x = x;
	this.y = y;
}

function CollisionInfo(collidedObj, collidedX, collidedY, collidedEdge) {
	this.collidedObj = collidedObj;
	this.collidedX = collidedX;
	this.collidedY = collidedY;
	this.collidedEdge = collidedEdge;
}
var NO_COLLISION = new CollisionInfo(undefined, NaN, NaN, "");

function Rectangle(x, y, width, height) {
	Entity.call(this, x, y);
	this.width = width;
	this.height = height;

	this.getCollisionInfo = function(other) {
		var rightOfLeftEdge = other.x + other.width >= this.x;
		var leftOfRightEdge = other.x <= this.x + this.width;
		var collision = rightOfLeftEdge && leftOfRightEdge;
		if (collision) {
			if (leftOfRightEdge) {
				return new CollisionInfo(this, this.x + this.width, NaN, "right");
			} else if (rightOfLeftEdge) {
				return new CollisionInfo(this, this.x, NaN, "left");
			}
		}
		return NO_COLLISION;
	}
}

function Player(x, y, height, world) {
	Rectangle.call(this, x, y, height, height);
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
			console.log('Collision with ' + collidedObj.name);
		}

		xdir = 0;
		if (keyPressed.D) {
			xdir += 1;
		}
		if (keyPressed.A) {
			xdir -= 1;
		}

		if (xdir === 1 && collInfo.collidedEdge === "left" ||
			xdir === -1 && collInfo.collidedEdge === "right") {
			this.x = collInfo.collidedX;
			console.log("Player collided!")
		} else {
			this.x += xdir * xvel * deltatime;
		}
	}
}

//======== Barriers ========

function Floor(thickness) {
	Rectangle.call(this, 0, canvas.height - thickness, canvas.width, thickness);
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
	this.name = alignment;

	if (alignment === 'left') {
		Rectangle.call(this, 0, 0, thickness, canvas.height);
	} else if (alignment === 'right') {
		Rectangle.call(this, canvas.width - thickness, 0, thickness, canvas.height);
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

function _distanceTo(x, y, obj) {

}