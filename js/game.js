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
var playerName;

/** Called when page is loaded*/
function start() {
	console.log("game.start");
	playerName = prompt("Enter your name:");
	world = new World();
	loadLevel1();
	animManager = new AnimationManager();
	player = new Player(canvas.width / 2, 200, 40, world, animManager);
}

/** Called every new frame
 * @param {number} deltatime The time since the last frame was rendered, in milliseconds.
 */
function update(deltatime) {
	world.update();
	player.update(deltatime);
	world.draw();
	drawCircle(player.x + player.width/2, player.y + player.width/2, player.width/2);
	drawText(player.x, player.y - 35, playerName, "#0d0");
	animManager.drawAnimations();
}
