/** This file is the main container of game logic.*/

var world;
var floor;
var lwall;
var rwall;
var platform1;
var platform2;
var platform3;

var blobs;
var player;
var animManager;
var playerName;

var timeToBlobSpawn;

/** Called when page is loaded*/
function start() {
	console.log("game.start");
	playerName = prompt("Enter your name:");
	world = new World();
	loadLevel1();
	animManager = new EffectManager();
	player = new Player(canvas.width / 2, 200, 40, world, animManager);
	blobs = [];
	timeToBlobSpawn = performance.now();
}

/** Called every new frame
 * @param {number} deltatime The time since the last frame was rendered, in milliseconds.
 */
function update(deltatime) {
	world.update();
	player.update(deltatime);
	for (var i = 0; i < blobs.length; i++){
		blobs[i].update(deltatime);
	}
	world.draw();
	drawCircle(player.x + player.width/2, player.y + player.width/2, player.width/2, '#00d');
	drawText(player.x, player.y - 35, playerName, "#00d");
	animManager.drawEffects();

	for (var i = 0; i < blobs.length; i++){
		blob = blobs[i]
		drawCircle(blob.x + blob.width/2, blob.y + blob.width/2, blob.width/2);
	}
	if (performance.now() > timeToBlobSpawn) {
		timeToBlobSpawn = performance.now() + 2500;
		blobs.push(new Blob(Math.floor(Math.random()*canvas.width), Math.floor(Math.random()*canvas.height), 20, world));
	}
}
