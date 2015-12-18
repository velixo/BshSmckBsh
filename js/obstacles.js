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

function Rectangle(x, y, width, height, name, includeInWorld) {
	Entity.call(this, x, y, name);
	this.width = width;
	this.height = height;
	includeInWorld = evalArg(includeInWorld, true);
	if (includeInWorld) world.add(this);
}

Rectangle.prototype.update = function() {
	//implement
}

Rectangle.prototype.getCollisionInfo = function(other) {
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

Rectangle.prototype._checkXCollision = function(edges) {
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

Rectangle.prototype._checkYCollision = function(edges) {
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

Rectangle.prototype._touchingX = function(edges) {
	return edges.otherMiddleX >= edges.lEdge && edges.otherMiddleX <= edges.rEdge;
}

Rectangle.prototype._touchingY = function(edges) {
	return edges.otherbEdge <= edges.tEdge && edges.otherTEdge >= edges.bEdge;
}

Rectangle.prototype._checkIfOtherIsInside = function(edges) {
	var insideXAxis = edges.otherREdge <= edges.rEdge && edges.otherLEdge >= edges.lEdge;
	var insideYAxis = edges.otherTEdge >= edges.tEdge && edges.otherBEdge <= edges.bEdge;
	return insideXAxis && insideYAxis;
}



function Floor(thickness) {
	Rectangle.call(this, 0, canvas.height - thickness, canvas.width, thickness, "floor");
	this.name = 'floor';

//	this.update = function() {
//		this.y = canvas.height - thickness;
//		this.width = canvas.width;
//	}

	//world.add(this);
}
Floor.prototype = Object.create(Rectangle.prototype);
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




function Wall(alignment, thickness) {
	this.alignment = alignment;

	if (alignment === 'left') {
		Rectangle.call(this, 0, 0, thickness, canvas.height, alignment + " wall");
	} else if (alignment === 'right') {
		Rectangle.call(this, canvas.width - thickness, 0, thickness, canvas.height, alignment + " wall");
	}

//	this.update = function() {
//		if (this.alignment === 'left') {
//			this.x = 0;
//		} else if (this.alignment === 'right') {
//			this.x = canvas.width - thickness;
//		}
//		this.height = canvas.height;
//	}

	//world.add(this);
}
Wall.prototype = Object.create(Rectangle.prototype);
Wall.prototype.update = function() {
	if (this.alignment === 'left') {
		this.x = 0;
	} else if (this.alignment === 'right') {
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
	var collXEdge, collXEdgeStr;
	if (edges.otherREdge >= edges.lEdge && edges.otherLEdge <= edges.lEdge) {
		collXEdge = edges.lEdge;
		collXEdgeStr = 'l';
	} else if (edges.otherLEdge <= edges.rEdge && edges.otherREdge >= edges.rEdge) {
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