/** This file is the main container of game logic.*/

var world;
var level;

var blobs;
var player;
var effectsManager;
var playerName;

var timeToBlobSpawn;
var maxBlobs = 25;

/** Called when page is loaded*/
function start() {
	console.log("game.start");
	playerName = prompt("Enter your name:");
	world = new World();
	level = new Level1();
	effectsManager = new EffectManager();
	player = new Player(canvas.width / 2, 200, 40, effectsManager, playerName);
	blobs = [];
	timeToBlobSpawn = performance.now();
}

/** Called every new frame
 * @param {number} deltatime The time since the last frame was rendered, in milliseconds.
 */
function update(deltatime) {
	level.update(deltatime);
	player.update(deltatime);
	updateBlobs(deltatime);
	level.draw();
	player.draw();
	drawBlobs();
	effectsManager.drawEffects();

	if (performance.now() > timeToBlobSpawn && blobs.length < maxBlobs) {
		timeToBlobSpawn = performance.now() + 2500;
		blobs.push(new Blob(Math.floor(Math.random()*canvas.width), Math.floor(Math.random()*canvas.height), 20));
	}
}

function updateBlobs(deltatime) {
	// clean out dead blobs
	for (var i = 0; i < blobs.length; i++) {
		if (blobs[i].dead) {
			blobs.splice(i, 1);
			i--;
		}
	};
	// update the blobs
	for (var i = 0; i < blobs.length; i++) {
		blobs[i].update(deltatime);
	};
}
function drawBlobs() {
	for (var i = 0; i < blobs.length; i++) {
		blobs[i].draw();
	};
}