function loadLevel1 () {
	floor = new Floor(30);
	lwall = new Wall('l', 30);
	rwall = new Wall('r', 30);
	new RectObstacle(100, 200, 250, 40);
	new RectObstacle(120, 700, 40, 250);
	new RectObstacle(200, 220, 40, 280);
	new RectObstacle(250, 600, 300, 40);

	new RectObstacle(350, 900, 700, 40);
	new RectObstacle(500, 300, 350, 40);
	new RectObstacle(700, 150, 40, 150);

	new RectObstacle(700, 450, 40, 350);
	new RectObstacle(1000, 400, 100, 40);
	new RectObstacle(1000, 420, 40, 280);
	new RectObstacle(1000, 0, 40, 60)

	new RectObstacle(1200, 800, 400, 40);
	new RectObstacle(1230, 250, 550, 40);
	new RectObstacle(1400, 550, 350, 40);
	new RectObstacle(1400, 0, 40, 130);

	new RectObstacle(1450, 270, 150, 100);
	new RectObstacle(1560, 820, 40, 130);
	new RectObstacle(1630, 570, 40, 100);

	console.log("Level 1 loaded");
}