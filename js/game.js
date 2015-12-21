/** This file is the main container of game logic.*/

var world;
var floor;
var lwall;
var rwall;
var platform1;
var platform2;
var platform3;

var player;
var animManager;

/** Called when page is loaded*/
function start() {
	console.log("game.start");
	world = new World();
//	floor = new Floor(30);
//	lwall = new Wall('l', 30);
//	rwall = new Wall('r', 30);
//	platform1 = new Rectangle(250, 600, 300, 40, "rectbroad");
//	platform2 = new Rectangle(700, 150, 100, 600, "recttall");
//	platform3 = new Rectangle(350, 800, 400, 40, "rectbroadunder");
	loadLevel1();
	animManager = new AnimationManager();
	console.log("animManager = " + animManager.toString());
	player = new Player(canvas.width / 2, 200, 40, world, animManager);
}

/** Called every new frame
 * @param {number} deltatime The time since the last frame was rendered, in milliseconds.
 */
function update(deltatime) {
	world.update();
	player.update(deltatime);

//	floor.draw();
//	lwall.draw();
//	rwall.draw();
//	platform1.draw();
//	platform2.draw();
//	platform3.draw();
	world.draw();
	drawCircle(player.x + player.width/2, player.y + player.width/2, player.width/2);
	drawText(player.x, player.y - 35, "Pale ale", "#0d0");

	animManager.drawAnimations();
}
