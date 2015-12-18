/** This file is the main container of game logic.*/

var world;
var floor;
var lwall;
var rwall;
var platform1;
var platform2;

var player;

/** Called when page is loaded*/
function start() {
	console.log("game.start");
	world = new World();
	floor = new Floor(30);
	lwall = new Wall('left', 30);
	rwall = new Wall('right', 30);
	platform1 = new Rectangle(250, 600, 300, 40, "rectbroad");
	platform2 = new Rectangle(700, 150, 100, 600, "recttall");
	player = new Player(canvas.width / 2, 200, 40, world);
}

/** Called every new frame
 * @param {number} deltatime The time since the last frame was rendered, in milliseconds.
 */
function update(deltatime) {
	world.update();
	player.update(deltatime);

	floor.draw();
	lwall.draw();
	rwall.draw();
	platform1.draw();
	platform2.draw();
	drawCircle(player.x + player.width/2, player.y + player.width/2, player.width/2);
}
