function loadLevel1 () {
	floor = new Floor(30);
	lwall = new Wall('l', 30);
	rwall = new Wall('r', 30);
	new Rectangle(100, 200, 250, 40);
	new Rectangle(120, 700, 40, 250);
	new Rectangle(200, 220, 40, 280);
	new Rectangle(250, 600, 300, 40);

	new Rectangle(350, 900, 700, 40);
	new Rectangle(500, 300, 350, 40);
	new Rectangle(700, 150, 40, 150);

	new Rectangle(700, 450, 40, 350);
	new Rectangle(1000, 400, 100, 40);
	new Rectangle(1000, 420, 40, 280);
	new Rectangle(1000, 0, 40, 60)

	new Rectangle(1200, 800, 400, 40);
	new Rectangle(1230, 250, 550, 40);
	new Rectangle(1400, 550, 350, 40);
	new Rectangle(1400, 0, 40, 130);

	new Rectangle(1450, 270, 150, 100);
	new Rectangle(1560, 820, 40, 130);
	new Rectangle(1630, 570, 40, 100);

	console.log("Level 1 loaded");
}