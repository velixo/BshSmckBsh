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

function RectObstacle(x, y, width, height, name, includeInWorld) {
	Entity.call(this, x, y, name);
	this.width = width;
	this.height = height;
	includeInWorld = evalArg(includeInWorld, true);
	if (includeInWorld) world.add(this);
}

RectObstacle.prototype.update = function() {
	//implement
}

RectObstacle.prototype.draw = function() {
	drawRect(this.x, this.y, this.width, this.height);
}

RectObstacle.prototype.getCollisionInfo = function(other) {
	var edges = {
		lEdge: this.x,
		rEdge: this.x + this.width,
		tEdge: this.y,
		bEdge: this.y + this.height,
		otherLEdge: other.x,
		otherREdge: other.x + other.width,
		otherTEdge: other.y,
		otherBEdge: other.y + other.height,
		otherMiddleX: other.x + other.width / 2,
		otherMiddleY: other.y + other.height / 2
	};

	var xColl = this._checkXCollision(edges);
	var yColl = this._checkYCollision(edges);
	if (this._checkIfOtherIsInside(edges)) {
		return new CollisionInfo(this, undefined, undefined, 'i');
	}

	collEdgeStr = xColl.collXEdgeStr + yColl.collYEdgeStr;
	if (collEdgeStr.length > 0) {
		return new CollisionInfo(this, xColl.collXEdge, yColl.collYEdge, collEdgeStr);
	}
	return null;
}

RectObstacle.prototype._checkXCollision = function(edges) {
	var collXEdge, collXEdgeStr;
	var touchingY = this._touchingY(edges);
	if (edges.otherREdge >= edges.lEdge && edges.otherLEdge <= edges.lEdge && touchingY) {
		collXEdge = edges.lEdge;
		collXEdgeStr = 'l';
	} else if (edges.otherLEdge <= edges.rEdge && edges.otherREdge >= edges.rEdge && touchingY) {
		collXEdge = edges.rEdge;
		collXEdgeStr = 'r';
	} else {
		collXEdge = undefined;
		collXEdgeStr = '';
	}
	return {
		collXEdge: collXEdge,
		collXEdgeStr: collXEdgeStr
	};
}

RectObstacle.prototype._checkYCollision = function(edges) {
	var collYEdge, collYEdgeStr;
	var touchingX = this._touchingX(edges);
	if (edges.otherBEdge >= edges.tEdge && edges.otherTEdge <= edges.tEdge && touchingX) {
		collYEdge = edges.tEdge;
		collYEdgeStr = 't';
	} else if (edges.otherTEdge <= edges.bEdge && edges.otherBEdge >= edges.bEdge && touchingX) {
		collYEdge = edges.bEdge;
		collYEdgeStr = 'b';
	} else {
		collYEdge = undefined;
		collYEdgeStr = '';
	}
	return {
		collYEdge: collYEdge,
		collYEdgeStr: collYEdgeStr
	};
}

RectObstacle.prototype._touchingX = function(edges) {
	return edges.otherMiddleX >= edges.lEdge && edges.otherMiddleX <= edges.rEdge;
}

RectObstacle.prototype._touchingY = function(edges) {
	var t = edges.tEdge;
	var b = edges.bEdge;
	var ot = edges.otherTEdge;
	var ob = edges.otherBEdge;
	var crossingTop = (ob >= t) && !(ot >= t) && (ot <= b) && (ob <= b);
	var crossingBottom = (ob >= t) && (ot >= t) && (ot <= b) && !(ob <= b);
	var inside = (ob >= t) && (ot >= t) && (ot <= b) && (ob <= b);
	return (crossingTop || crossingBottom || inside);
}

RectObstacle.prototype._checkIfOtherIsInside = function(edges) {
	var insideXAxis = edges.otherREdge <= edges.rEdge && edges.otherLEdge >= edges.lEdge;
	var insideYAxis = edges.otherTEdge >= edges.tEdge && edges.otherBEdge <= edges.bEdge;
	return insideXAxis && insideYAxis;
}



function Floor(thickness) {
	RectObstacle.call(this, 0, canvas.height - thickness, canvas.width, thickness, "floor");
	this.name = 'floor';
}
Floor.prototype = Object.create(RectObstacle.prototype);
Floor.prototype.update = function() {
	this.y = canvas.height - this.height;
	this.width = canvas.width;
}
Floor.prototype._checkXCollision = function() {
	return {
		collXEdge: undefined,
		collXEdgeStr: ''
	};
}
Floor.prototype._checkYCollision = function(edges) {
	var collYEdge = undefined;
	var collYEdgeStr = '';
	if (edges.otherBEdge >= edges.tEdge) {
		collYEdge = edges.tEdge;
		collYEdgeStr = 't';
	}
	return {
		collYEdge: collYEdge,
		collYEdgeStr: collYEdgeStr
	};
}




function Wall(alignment, thickness) {
	this.alignment = alignment;

	if (alignment === 'l') {
		RectObstacle.call(this, 0, 0, thickness, canvas.height, alignment + " wall");
	} else if (alignment === 'r') {
		RectObstacle.call(this, canvas.width - thickness, 0, thickness, canvas.height, alignment + " wall");
	}
}

Wall.prototype = Object.create(RectObstacle.prototype);
Wall.prototype.update = function() {
	if (this.alignment === 'l') {
		this.x = 0;
	} else if (this.alignment === 'r') {
		this.x = canvas.width - this.width;
	}
	this.height = canvas.height;
}
Wall.prototype._checkYCollision = function() {
	return {
		collYEdge: undefined,
		collYEdgeStr: ''
	};
}
Wall.prototype._checkXCollision = function(edges) {
	var collXEdge = undefined;
	var collXEdgeStr = '';
	if (this.alignment === 'l') {
		if (edges.otherLEdge < edges.rEdge) {
			collXEdge = edges.rEdge;
			collXEdgeStr = 'r';
		}
	} else if (this.alignment === 'r') {
		if (edges.otherREdge > edges.lEdge) {
			collXEdge = edges.lEdge;
			collXEdgeStr = 'l';
		}
	}

	return {
		collXEdge: collXEdge,
		collXEdgeStr: collXEdgeStr
	};
}