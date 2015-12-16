function World() {
	this.obstacles = [];

	this.add = function(obstacle) {
		console.log(obstacle.name + " added to world");
		this.obstacles[this.obstacles.length] = obstacle;
	};

	this.verticalCollision = function(player) {
		for (var i = 0; i < this.obstacles.length; i++) {
			var collision = this.obstacles[i].verticalCollision(player);
			if (collision) return this.obstacles[i];
		}
		return 'undefined';
	};

	this.horizontalCollision = function(player) {
		for (var i = 0; i < this.obstacles.length; i++) {
			var collision = this.obstacles[i].horizontalCollision(player);
			if (collision) return this.obstacles[i];
		}
		return undefined;
	};

	this.update = function() {
		for (var i = 0; i < this.obstacles.length; i++) {
			this.obstacles[i].update();
		};
	}
}


function Floor(thickness) {
	this.x = 0;
	this.y = canvas.height - thickness;
	this.width = canvas.width;
	this.height = thickness;
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
		this.x = 0;
	} else if (alignment === 'right') {
		this.x = canvas.width - thickness;
	}

	this.y = 0;
	this.width = thickness;
	this.height = canvas.height;
	this.name = alignment;

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