function Level() {
	this.components = [];
	this.update = function(deltatime) {
		for (var i = 0; i < this.components.length; i++) {
			this.components[i].update(deltatime);
		};
	};

	this.draw = function() {
		for (var i = 0; i < this.components.length; i++) {
			this.components[i].draw();
		};
	};
}

function Level1 () {
	//this.components = [];
	Level.call(this);
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

function Level2 () {
	Level.call(this);
	this.components.push(new Floor(30));
	this.components.push(new Wall('l', 30));
	this.components.push(new Wall('r', 30));

	this.components.push(new Rectangle(120, 0, 300, 800));
	this.components.push(new Rectangle(480, 0, 300, 800));
	this.components.push(new Rectangle(400, 0, 100, 600));

//	this.components.push(new Rectangle(120, 0, 40, 950));
//	this.components.push(new Rectangle(240, 0, 80, 950));
//	this.components.push(new Rectangle(400, 0, 120, 950));
//	this.components.push(new Rectangle(600, 0, 160, 950));
//	this.components.push(new Rectangle(840, 0, 200, 950));
//	this.components.push(new Rectangle(1120, 0, 240, 950));
//	this.components.push(new Rectangle(1440, 0, 280, 950));
}