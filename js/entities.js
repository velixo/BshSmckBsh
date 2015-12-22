function World() {
	this.obstacles = [];

	this.add = function(obstacle) {
		console.log(obstacle.name + " added to world");
		this.obstacles[this.obstacles.length] = obstacle;
	};

	this.remove = function(obj) {
		var index = this.obstacles.indexOf(obj);
		if (index !== -1) {
			obstacles.splice(index, 1);
		}
	}

	this.checkCollision = function(player) {
		var collisions = [];
		for (var i = 0; i < this.obstacles.length; i++) {
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

function Blob(x, y, height, world) {
	RectObstacle.call(this, x, y, height, height, "blob", false);
	this.deltaX = 0.4;
	this.deltaY = 0.4;
	this.health = 1;
	var maxDeltaY = 0.9;
	var maxDeltaX = 0.4;
	var deltaYGravity = 0.013;
	var world = world;

	var lBlockedX = undefined;
	var rBlockedX = undefined;
	var tBlockedY = undefined;
	var bBlockedY = undefined;

	this.update = function(deltatime) {
		lBlockedX = undefined;
		rBlockedX = undefined;
		tBlockedY = undefined;
		bBlockedY = undefined;
		var collisions = world.checkCollision(this);
		for (var i = 0; i < collisions.length; i++) {
			this._readCollisionEvent(collisions[i], deltatime);
		}

		if (rBlockedX !== undefined) {
			this.x = rBlockedX;
			this.deltaX = maxDeltaX;
		}
		if (lBlockedX !== undefined) {
			this.x = lBlockedX - this.width;
			this.deltaX = -maxDeltaX;
		}
		if (tBlockedY !== undefined) {
			this.y = tBlockedY - this.height;
			this.deltaY = -maxDeltaY;
		}
		if (bBlockedY !== undefined) {
			this.y = bBlockedY;
			this.deltaY = maxDeltaY;
		}

		this.deltaY += deltaYGravity;
		this.x += this.deltaX*deltatime;
		this.y += this.deltaY*deltatime;
	}

	this.deathFadeOutStart = 0;
	this.deathFadeOutEnd = 0;
	this.draw = function() {
		if (health > 1) {
			drawCircle(this.x + this.width/2, this.y + this.width/2, this.width/2, '#0d0');
		} else {
			var currTime = performance.now();
			if (currTime < this.deathFadeOutEnd) {
				var fadeProgress = (this.deathFadeOutEnd - currTime) / (this.deathFadeOutEnd - this.deathFadeOutStart);
				var col = colorFloatToHex(1 - fadeProgress, 0, 0);
				drawCircle(this.x + this.width/2, this.y + this.width/2, this.width/2, col, 1-fadeProgress);
			} else {
				world.remove(this);
			}
		}
	}

	this.destroy = function() {
		this.health = -1;
		this.deathFadeOutStart = performance.now();
		this.deathFadeOutEnd = this.deathFadeOutStart + 1000;
		console.log(this.name + " destroyed");
	}

	this._readCollisionEvent = function(collInfo, deltatime) {
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

function Player(x, y, height, world, effectsManager) {
	RectObstacle.call(this, x, y, height, height, "player", false);
	this.effectsManager = effectsManager;
	var xdir = 0;
	var xvel = 0.2;
	var yvel = 0;
	var xvelMultiplier = 0.5;
	var yvelMultiplier = 0.02;
	var yvelThreshold = 15;
	var jumpRatio = 3;
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
		touchingSurface = this._checkTouchingSurface(lBlockedX, rBlockedX, tBlockedY, bBlockedY)

		xdir = 0;
		if (keyPressed.D) {
			xdir += 1;
		}
		if (keyPressed.A) {
			xdir -= 1;
		}
		if (keyPressed.W && touchingSurface) {
			yvel = -0.5;
			if (lBlockedX !== undefined) {
				xvel = -xvelMultiplier * jumpRatio;
			} else if (rBlockedX !== undefined) {
				xvel = xvelMultiplier * jumpRatio;
			}
		}

		lBlockedX = undefined;
		rBlockedX = undefined;
		tBlockedY = undefined;
		bBlockedY = undefined;
		var collisions = world.checkCollision(this);
		for (var i = 0; i < collisions.length; i++) {
			this._readCollisionEvent(collisions[i], deltatime);
		}

		touchingSurface = this._checkTouchingSurface(lBlockedX, rBlockedX, tBlockedY, bBlockedY)
		if (lBlockedX !== undefined) {
			this.x = lBlockedX - this.width;
			if (xvel > 0) xvel = 0;
		}
		if (rBlockedX !== undefined) {
			this.x = rBlockedX;
			if (xvel < 0) xvel = 0;
		}
		if (xdir !== 0) {
			xvel = xvelMultiplier * xdir;
		} else if (touchingSurface) {
			xvel *= 0.8;
		} else {
			xvel *= 0.95;
		}
		this.x += xvel * deltatime;

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

	this._readCollisionEvent = function(collInfo, deltatime) {
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

	this._checkTouchingSurface = function (lBlockedX, rBlockedX, tBlockedY, bBlockedY) {
		return lBlockedX !== undefined ||
				rBlockedX !== undefined ||
				tBlockedY !== undefined;
	}

	//add start animation for up arrow key
	addKeyPressFunction(38, false, [effectsManager, player], function(argList) {
		var effectsManager = argList[0];
		var player = argList[1];
		var collisions = world.checkCollision(getHitArea(this, 'u'));
		if (collisions !== null || collisions !== undefined) {
			for (var i = 0; i < collisions.length; i++) {
				if (collisions[i].name === 'blob') {
					collisions[i].destroy();
				}
			}
		}
		effectsManager.startEffect(player, 'hit', 'u');
	});
	//add start animation for right arrow key
	addKeyPressFunction(39, false, [effectsManager, player], function(argList) {
		var effectsManager = argList[0];
		var player = argList[1];
		var collisions = world.checkCollision(getHitArea(this, 'r'));
		if (collisions !== null || collisions !== undefined) {
			for (var i = 0; i < collisions.length; i++) {
				if (collisions[i].name === 'blob') {
					collisions[i].destroy();
				}
			}
		}
		effectsManager.startEffect(player, 'hit', 'r');
	});
	//add start animation for down arrow key
	addKeyPressFunction(40, false, [effectsManager, player], function(argList) {
		var effectsManager = argList[0];
		var player = argList[1];
		var collisions = world.checkCollision(getHitArea(this, 'd'));
		if (collisions !== null || collisions !== undefined) {
			for (var i = 0; i < collisions.length; i++) {
				if (collisions[i].name === 'blob') {
					collisions[i].destroy();
				}
			}
		}
		effectsManager.startEffect(player, 'hit', 'd');
	});
	//add start animation for left arrow key
	addKeyPressFunction(37, false, [effectsManager, player], function(argList) {
		var effectsManager = argList[0];
		var player = argList[1];
		var collisions = world.checkCollision(getHitArea(this, 'l'));
		if (collisions !== null || collisions !== undefined) {
			for (var i = 0; i < collisions.length; i++) {
				if (collisions[i].name === 'blob') {
					collisions[i].destroy();
				}
			}
		}
		effectsManager.startEffect(player, 'hit', 'l');
	});
}

function getHitArea(player, dir) {
	var hitX;
	var hitY;
	if (dir === 'u') {
		hitX = player.x - player.width;
		hitY = player.y - player.height * 3;
	} else if (dir === 'r') {
		hitX = player.x + player.width;
		hitY = player.y - player.height;
	} else if (dir === 'd') {
		hitX = player.x - player.width;
		hitY = player.y + player.height;
	} else if (dir === 'l') {
		hitX = player.x - player.width * 3;
		hitY = player.y - player.height;
	} else {
		console.log("Direction " + dir + " cannot be animated");
		return null;
	}
	return new RectObstacle(hitX, hitY, player.width * 3, player.height * 3, '', false);
}