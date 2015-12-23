function Level1 () {
	this.components = [];
	this.components.push(new Floor(30));
	this.components.push(new Wall('l', 30));
	this.components.push(new Wall('r', 30));
	this.components.push(new Rectangle(100, 200, 250, 40));
	this.components.push(new Rectangle(120, 700, 40, 250));
	this.components.push(new Rectangle(200, 220, 40, 280));

	this.components.push(new Rectangle(250, 600, 300, 40));
	this.components.push(new Rectangle(350, 900, 700, 40));
	this.components.push(new Rectangle(500, 300, 350, 40));

	this.components.push(new Rectangle(700, 150, 40, 150));
	this.components.push(new Rectangle(700, 450, 40, 350));
	this.components.push(new Rectangle(1000, 0, 40, 60))

	this.components.push(new Rectangle(1000, 400, 100, 40));
	this.components.push(new Rectangle(1000, 420, 40, 280));
	this.components.push(new Rectangle(1200, 800, 400, 40));

	this.components.push(new Rectangle(1230, 250, 550, 40));
	this.components.push(new Rectangle(1400, 0, 40, 130));
	this.components.push(new Rectangle(1400, 550, 350, 40));

	this.components.push(new Rectangle(1450, 270, 150, 100));
	this.components.push(new Rectangle(1560, 820, 40, 130));
	this.components.push(new Rectangle(1630, 570, 40, 100));
	console.log("Level 1 loaded");
}

Level1.prototype.update = function(deltatime) {
	for (var i = 0; i < this.components.length; i++) {
		this.components[i].update(deltatime);
	};
};

Level1.prototype.draw = function() {
	for (var i = 0; i < this.components.length; i++) {
		this.components[i].draw();
	};
};