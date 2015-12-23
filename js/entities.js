function World() {
	this.obstacles = [];

	this.add = function(obstacle) {
		console.log(obstacle.name + " added to world at x=" + obstacle.x + " y=" + obstacle.y);
		this.obstacles[this.obstacles.length] = obstacle;
	};

	this.remove = function(obj) {
		var index = this.obstacles.indexOf(obj);
		if (index !== -1) {
			this.obstacles.splice(index, 1);
		}
	}

	this.checkCollision = function(player) {
		var collisions = [];
		for (var i = 0; i < this.obstacles.length; i++) {
			var collInfo = this.obstacles[i].collidesWith(player);
			if (collInfo !== null && collInfo.collidedObj !== player) {
				collisions.push(collInfo);
			}
		}
		return collisions;
	}

	this.update = function(deltatime) {
		for (var i = 0; i < this.obstacles.length; i++) {
			this.obstacles[i].update(deltatime);
		};
	}

	this.draw = function() {
		for (var i = 0; i < this.obstacles.length; i++) {
			this.obstacles[i].draw();
		};
	}
}

function Entity(x, y, name) {
	this.x = x;
	this.y = y;
	this.name = evalArg(name, "entity")
}

function Blob(x, y, height) {
	Rectangle.call(this, x, y, height, height, "blob", true);
	this.deltaX = 0.4;
	this.deltaY = 0.4;
	this.health = 1;
	this.maxDeltaY = 0.9;
	this.maxDeltaX = 0.4;
	this.deltaYGravity = 0.013;

	this.lBlockedX = undefined;
	this.rBlockedX = undefined;
	this.tBlockedY = undefined;
	this.bBlockedY = undefined;

	this.deathFadeOutStart = 0;
	this.deathFadeOutEnd = 0;
}
Blob.prototype = Object.create(Rectangle.prototype);
Blob.prototype.update = function(deltatime) {
	this.lBlockedX = undefined;
	this.rBlockedX = undefined;
	this.tBlockedY = undefined;
	this.bBlockedY = undefined;
	var collisions = world.checkCollision(this);
	for (var i = 0; i < collisions.length; i++) {
		this._readCollisionEvent(collisions[i], deltatime);
	}
	if (this.rBlockedX !== undefined) {
		this.x = this.rBlockedX;
		this.deltaX = this.maxDeltaX;
	}
	if (this.lBlockedX !== undefined) {
		this.x = this.lBlockedX - this.width;
		this.deltaX = -this.maxDeltaX;
	}
	if (this.tBlockedY !== undefined) {
		this.y = this.tBlockedY - this.height;
		this.deltaY = -this.maxDeltaY;
	}
	if (this.bBlockedY !== undefined) {
		this.y = this.bBlockedY;
		this.deltaY = this.maxDeltaY;
	}

	this.deltaY += this.deltaYGravity;
	this.x += this.deltaX * deltatime;
	this.y += this.deltaY * deltatime;
}

Blob.prototype.draw = function() {
	if (this.health > 0) {
		drawCircle(this.x + this.width/2, this.y + this.width/2, this.width/2, '#0d0', 1);
	} else {
		var currTime = performance.now();
		if (currTime < this.deathFadeOutEnd) {
			var fadeProgress = (currTime - this.deathFadeOutStart) / (this.deathFadeOutEnd - this.deathFadeOutStart);
			var col = colorFloatToHex(1 - fadeProgress, 0, 0);
			drawCircle(this.x + this.width/2, this.y + this.width/2, this.width/2, col, 1-fadeProgress);
		} else {
			world.remove(this);
		}
	}
}

Blob.prototype.destroy = function() {
	if (this.health > 0) {
		this.health = -1;
		this.deathFadeOutStart = performance.now();
		this.deathFadeOutEnd = this.deathFadeOutStart + 700;
		console.log(this.name + " destroyed");
	};
}

Blob.prototype._readCollisionEvent = function(collInfo, deltatime) {
	var collEdgeStr = collInfo.collidedEdge;
	if (collEdgeStr.indexOf('l') !== -1) {
		if (this.lBlockedX !== undefined) {
			this.lBlockedX = (this.lBlockedX < collInfo.collidedX) ? collInfo.collidedX : this.lBlockedX;
		} else {
			this.lBlockedX = collInfo.collidedX;
		}
	}

	if (collEdgeStr.indexOf('r') !== -1) {
		if (this.rBlockedX !== undefined) {
			this.rBlockedX = (this.rBlockedX > collInfo.collidedX) ? collInfo.collidedX : this.rBlockedX;
		} else {
			this.rBlockedX = collInfo.collidedX;
		}
	}

	if (collEdgeStr.indexOf('t') !== -1) {
		if (this.tBlockedY !== undefined) {
			this.tBlockedY = (this.tBlockedY > collInfo.collidedY) ? collInfo.collidedY : this.tBlockedY;
		} else {
			this.tBlockedY = collInfo.collidedY;
		}
	}

	if (collEdgeStr.indexOf('b') !== -1) {
		if (this.bBlockedY !== undefined) {
			this.bBlockedY = (this.bBlockedY < collInfo.collidedY) ? collInfo.collidedY : this.bBlockedY;
		} else {
			this.bBlockedY = collInfo.collidedY;
		}
	}
}


function Player(x, y, height, effectsManager, playerName) {
	Rectangle.call(this, x, y, height, height, playerName, false);
	this.effectsManager = effectsManager;
	this.xdir = 0;
	this.xvel = 0.2;
	this.yvel = 0;
	this.xvelMultiplier = 0.5;
	this.yvelMultiplier = 0.02;
	this.yvelThreshold = 15;
	this.jumpRatio = 3;

	this.lBlockedX = undefined;
	this.rBlockedX = undefined;
	this.tBlockedY = undefined;
	this.bBlockedY = undefined;
	this.touchingSurface = false;

	this._onHit = function(argList) {
		var effectsManager = argList[0];
		var player = argList[1];
		var dir = argList[2];
		var world = argList[3];
		var collisions = (new HitBox(player, dir)).checkCollisionsWithWorld();
		if (collisions !== null || collisions !== undefined) {
			for (var i = 0; i < collisions.length; i++) {
				if (collisions[i].collidedObj.name === 'blob') {
					collisions[i].collidedObj.destroy();
				}
			}
		}
		effectsManager.startEffect(player, 'hit', dir);
	}

	//add start animation for up arrow key
	addKeyPressFunction(38, false, [effectsManager, this, 'u', world], this._onHit);
	//add start animation for right arrow key
	addKeyPressFunction(39, false, [effectsManager, this, 'r', world], this._onHit);
	//add start animation for down arrow key
	addKeyPressFunction(40, false, [effectsManager, this, 'd', world], this._onHit);
	//add start animation for left arrow key
	addKeyPressFunction(37, false, [effectsManager, this, 'l', world], this._onHit);
}
Player.prototype = Object.create(Rectangle.prototype);
Player.prototype.draw = function() {
	drawCircle(this.x + this.width/2, this.y + this.width/2, this.width/2, '#00d');
	drawText(this.x, this.y - 35, this.name, "#00d");
}

Player.prototype.update = function(deltatime) {
	this.touchingSurface = this._checkTouchingSurface();
	this.xdir = 0;
	if (keyPressed.D) {
		this.xdir += 1;
	}
	if (keyPressed.A) {
		this.xdir -= 1;
	}
	if (keyPressed.W && this.touchingSurface) {
		this.yvel = -0.5;
		if (this.lBlockedX !== undefined) {
			this.xvel = -this.xvelMultiplier * this.jumpRatio;
		} else if (this.rBlockedX !== undefined) {
			this.xvel = this.xvelMultiplier * this.jumpRatio;
		}
	}

	this.lBlockedX = undefined;
	this.rBlockedX = undefined;
	this.tBlockedY = undefined;
	this.bBlockedY = undefined;
	var collisions = world.checkCollision(this);
	for (var i = 0; i < collisions.length; i++) {
		this._readCollisionEvent(collisions[i], deltatime);
	}

	this.touchingSurface = this._checkTouchingSurface(this.lBlockedX, this.rBlockedX, this.tBlockedY, this.bBlockedY)
	if (this.lBlockedX !== undefined) {
		this.x = this.lBlockedX - this.width;
		if (this.xvel > 0) this.xvel = 0;
	}
	if (this.rBlockedX !== undefined) {
		this.x = this.rBlockedX;
		if (this.xvel < 0) this.xvel = 0;
	}
	if (this.xdir !== 0) {
		this.xvel = this.xvelMultiplier * this.xdir;
	} else if (this.touchingSurface) {
		this.xvel *= 0.8;
	} else {
		this.xvel *= 0.95;
	}
	this.x += this.xvel * deltatime;

	if (this.tBlockedY !== undefined && this.yvel > 0) {
		this.y = this.tBlockedY - this.height;
		this.yvel = 0;
	} else if (this.bBlockedY !== undefined && this.yvel < 0) {
		this.y = this.bBlockedY;
		this.yvel += this.yvelMultiplier;
	} else {
		if (this.yvel >= this.yvelThreshold) {
			this.yvel = this.yvelThreshold;
		} else {
			this.yvel += this.yvelMultiplier;
		}
		this.y += this.yvel * deltatime;
	}
}

Player.prototype._readCollisionEvent = function(collInfo, deltatime) {
	var collEdgeStr = collInfo.collidedEdge;
	if (collEdgeStr.indexOf('l') !== -1) {
		if (this.lBlockedX !== undefined) {
			this.lBlockedX = (this.lBlockedX < collInfo.collidedX) ? collInfo.collidedX : this.lBlockedX;
		} else {
			this.lBlockedX = collInfo.collidedX;
		}
	}

	if (collEdgeStr.indexOf('r') !== -1) {
		if (this.rBlockedX !== undefined) {
			this.rBlockedX = (this.rBlockedX > collInfo.collidedX) ? collInfo.collidedX : this.rBlockedX;
		} else {
			this.rBlockedX = collInfo.collidedX;
		}
	}

	if (collEdgeStr.indexOf('t') !== -1) {
		if (this.tBlockedY !== undefined) {
			this.tBlockedY = (this.tBlockedY > collInfo.collidedY) ? collInfo.collidedY : this.tBlockedY;
		} else {
			this.tBlockedY = collInfo.collidedY;
		}
	}

	if (collEdgeStr.indexOf('b') !== -1) {
		if (this.bBlockedY !== undefined) {
			this.bBlockedY = (this.bBlockedY < collInfo.collidedY) ? collInfo.collidedY : this.bBlockedY;
		} else {
			this.bBlockedY = collInfo.collidedY;
		}
	}
}

Player.prototype._checkTouchingSurface = function () {
	return this.lBlockedX !== undefined ||
			this.rBlockedX !== undefined ||
			this.tBlockedY !== undefined;
}

function HitBox(player, dir) {
	this.width = player.width * 3;
	this.height = player.height * 3;
	if (dir === 'u') {
		this.x = player.x - player.width;
		this.y = player.y - player.height * 3;
	} else if (dir === 'r') {
		this.x = player.x + player.width;
		this.y = player.y - player.height;
	} else if (dir === 'd') {
		this.x = player.x - player.width;
		this.y = player.y + player.height;
	} else if (dir === 'l') {
		this.x = player.x - player.width * 3;
		this.y = player.y - player.height;
	} else {
		return null;
	}
}
HitBox.prototype.checkCollisionsWithWorld = function() {
	var collisions = [];
	for (var i = 0; i < world.obstacles.length; i++) {
		var collInfo = this.collidesWith(world.obstacles[i]);
		if (collInfo !== null) collisions.push(collInfo);
	};
	return collisions;
}

HitBox.prototype.collidesWith = function(other) {
	var l = this.x;
	var r = this.x + this.width;
	var t = this.y;
	var b = this.y + this.height;
	var ol = other.x;
	var or = other.x + other.width;
	var ot = other.y;
	var ob = other.y + other.height;

	var crossingLeft = (or > l) && !(ol > l) && (ol < r) && (or < r);
	var crossingRight = (or > l) && (ol > l) && (ol < r) && !(or < r);
	var insideX = (or > l) && (ol > l) && (ol < r) && (or < r);
	var crossingTop = (ob > t) && !(ot > t) && (ot < b) && (ob < b);
	var crossingBottom = (ob > t) && (ot > t) && (ot < b) && !(ob < b);
	var insideY = (ob > t) && (ot > t) && (ot < b) && (ob < b);

	var actCrossingL = crossingLeft && (crossingTop || insideY || crossingBottom);
	var actCrossingR = crossingRight && (crossingTop || insideY || crossingBottom);
	var actCrossingT = crossingTop && (crossingLeft || insideX || crossingRight);
	var actCrossingB = crossingBottom && (crossingLeft || insideX || crossingRight);
	var actInside = insideX && insideY;

	if (actCrossingL || actCrossingR || actCrossingT || actCrossingB || actInside) {
		return new CollisionInfo(other, undefined, undefined, 'c');
	}
	return null;
}
