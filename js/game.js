/** This file is the main container of game logic.*/

var world;
var floor;
var lwall;
var rwall;
var platform;

var player;

/** Called when page is loaded*/
function start() {
	console.log("game.start");
	world = new World();
	floor = new Floor(30);
	lwall = new Wall('left', 30);
	rwall = new Wall('right', 30);
	platform = new Rectangle(250, 500, 300, 40, "rect");
	player = new Player(canvas.width / 2, 200, 40, world);
}

/** Called every new frame
 * @param {number} deltatime The time since the last frame was rendered, in milliseconds.
 */
function update(deltatime) {
	world.update();
	player.update(deltatime);

	drawRect(floor.x, floor.y, floor.width, floor.height);
	drawRect(lwall.x, lwall.y, lwall.width, lwall.height);
	drawRect(rwall.x, rwall.y, rwall.width, rwall.height);
	drawRect(platform.x, platform.y, platform.width, platform.height);
	drawCircle(player.x + player.width/2, player.y + player.width/2, player.width/2);
}
