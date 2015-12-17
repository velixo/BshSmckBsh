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

/** Returns an object with info about the collision. collidedEdge can take
 * following values:
 * l: if collision occured on the objects left edge,
 * r: if collision occured on the objects right edge,
 * t: if collision occured on the objects top edge,
 * b: if collision occured on the objects bottom edge,
 * i: if the colliding object is inside this object */
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
		var edges = {
			lEdge: this.x,
			rEdge: this.x + this.width,
			tEdge: this.y,
			bEdge: this.y + this.height,
			otherLEdge: other.x,
			otherREdge: other.x + other.width,
			otherTEdge: other.y,
			otherBEdge: other.y + other.height
		}

		var xColl = checkXCollision(edges);
		var yColl = checkYCollision(edges);
		if (checkIfOtherIsInside(edges)) {
			return new CollisionInfo(this, NaN, NaN, 'i');
		}

		collEdgeStr = xColl.collXEdgeStr + xColl.collXEdgeStr;
		if (collEdgeStr.length > 0) {
			return new CollisionInfo(this, xColl.collXEdge, yColl.collYEdge, collEdgeStr);
		}
		return null;
	}

	var checkXCollision = function(edges) {
		var collXEdge, collXEdgeStr;
		if (edges.otherREdge >= edges.lEdge && edges.otherLEdge <= edges.lEdge) {
			collXEdge = edges.lEdge;
			collXEdgeStr = 'l';
		} else if (edges.otherLEdge <= edges.rEdge && edges.otherREdge >= edges.rEdge) {
			collXEdge = edges.rEdge;
			collXEdgeStr = 'r';
		}
		return {
			collXEdge: collXEdge,
			collXEdgeStr: collXEdgeStr
		};
	}

	var checkYCollision = function(edges) {
		var collYEdge, collYEdgeStr;
		if (edges.otherBEdge >= edges.tEdge && edges.otherTEdge <= edges.tEdge) {
			collYEdge = edges.tEdge;
			collYEdgeStr = 't';
		} else if (edges.otherTEdge <= edges.bEdge && edges.otherBEdge >= edges.bEdge) {
			collYEdge = edges.bEdge;
			collYEdgeStr = 'b';
		}
		return {
			collYEdge: collYEdge,
			collYEdgeStr: collYEdgeStr
		};
	}

	var checkIfOtherIsInside = function(edges) {
		var insideXAxis = edges.otherREdge <= edges.rEdge && edges.otherLEdge >= edges.lEdge;
		var insideYAxis = edges.otherTEdge >= edges.tEdge && edges.otherBEdge <= edges.bEdge;
		return insideXAxis && insideYAxis;
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

//======== Barriers ========

function Floor(thickness) {
	Rectangle.call(this, 0, canvas.height - thickness, canvas.width, thickness, "floor");
	this.name = 'floor';

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

