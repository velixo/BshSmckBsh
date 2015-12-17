function World() {
	this.obstacles = [];

	this.add = function(obstacle) {
		console.log(obstacle.name + " added to world");
		this.obstacles[this.obstacles.length] = obstacle;
	};

	this.checkCollision = function(player) {
		for (var i = 0; i < this.obstacles.length; i++) {
			var collInfo = this.obstacles[i].getCollisionInfo(player);
			if (collInfo !== null) return collInfo;
		}
		return null;
	}

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
		var collInfo = world.checkCollision(this);

		xdir = 0;
		if (keyPressed.D) {
			xdir += 1;
		}
		if (keyPressed.A) {
			xdir -= 1;
		}

		if (collInfo !== null && xdir === 1 && collInfo.collidedEdge.indexOf('l') !== -1) {
			this.x = collInfo.collidedX - this.width;
		} else if (collInfo !== null && xdir === -1 && collInfo.collidedEdge.indexOf('r') !== -1) {
			this.x = collInfo.collidedX;
		} else {
			this.x += xdir * xvel * deltatime;
		}
	}
}
