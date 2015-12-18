function World() {
	this.obstacles = [];

	this.add = function(obstacle) {
		console.log(obstacle.name + " added to world");
		this.obstacles[this.obstacles.length] = obstacle;
	};

	this.checkCollision = function(player) {
		var collisions = [];
		for (var i = 0; i < this.obstacles.length; i++) {
			console.log(this.obstacles[i]);
			var collInfo = this.obstacles[i].getCollisionInfo(player);
			if (collInfo !== null) collisions.push(collInfo);
		}
		return collisions;
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
	Rectangle.call(this, x, y, height, height, "player", false);
	var xdir = 0;
	var xvel = 0.2;
	var yvel = 0;
	var yvelMultiplier = 0.02;
	var yvelThreshold = 15;
	var world = world;

	var lBlockedX = undefined;
	var rBlockedX = undefined;
	var tBlockedY = undefined;
	var bBlockedY = undefined;
	var touchingSurface = false;

	this.update = function(deltatime) {
		this._updatePos(deltatime);
	};

	this._updatePos = function(deltatime) {
		touchingSurface = lBlockedX !== undefined ||
						rBlockedX !== undefined ||
						tBlockedY !== undefined;

		xdir = 0;
		if (keyPressed.D) {
			xdir += 1;
		}
		if (keyPressed.A) {
			xdir -= 1;
		}
		if (keyPressed.W && touchingSurface) {
			yvel = -0.5;
		}

		lBlockedX = undefined;
		rBlockedX = undefined;
		tBlockedY = undefined;
		bBlockedY = undefined;
		var collisions = world.checkCollision(this);
		for (var i = 0; i < collisions.length; i++) {
			this._handleCollisionEvent(collisions[i], deltatime);
		}

		if (lBlockedX !== undefined) {
			this.x = lBlockedX - this.width;
			xDir = 0;
		}
		if (rBlockedX !== undefined) {
			this.x = rBlockedX;
			xDir = 0;
		}
		this.x += xdir * xvel * deltatime;

		if (tBlockedY !== undefined && yvel > 0) {
			this.y = tBlockedY - this.height;
			yvel = 0;
		} else if (bBlockedY !== undefined && yvel < 0) {
			this.y = bBlockedY;
			yvel += yvelMultiplier;
		} else {
			if (yvel >= yvelThreshold) {
				yvel = yvelThreshold;
			} else {
				yvel += yvelMultiplier;
			}
			this.y += yvel * deltatime;
		}
	}

	this._handleCollisionEvent = function(collInfo, deltatime) {
		var collEdgeStr = collInfo.collidedEdge;
		if (collEdgeStr.indexOf('l') !== -1) {
			if (lBlockedX !== undefined) {
				lBlockedX = (lBlockedX < collInfo.collidedX) ? collInfo.collidedX : lBlockedX;
			} else {
				lBlockedX = collInfo.collidedX;
			}
		}

		if (collEdgeStr.indexOf('r') !== -1) {
			if (rBlockedX !== undefined) {
				rBlockedX = (rBlockedX > collInfo.collidedX) ? collInfo.collidedX : rBlockedX;
			} else {
				rBlockedX = collInfo.collidedX;
			}
		}

		if (collEdgeStr.indexOf('t') !== -1) {
			if (tBlockedY !== undefined) {
				tBlockedY = (tBlockedY > collInfo.collidedY) ? collInfo.collidedY : tBlockedY;
			} else {
				tBlockedY = collInfo.collidedY;
			}
		}

		if (collEdgeStr.indexOf('b') !== -1) {
			if (bBlockedY !== undefined) {
				bBlockedY = (bBlockedY < collInfo.collidedY) ? collInfo.collidedY : bBlockedY;
			} else {
				bBlockedY = collInfo.collidedY;
			}
		}
	}
}
