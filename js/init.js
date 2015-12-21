var canvasElement;
var canvas;
var motionBlur = true;

$(document).ready(function(){
	console.log("init.js loaded");
	canvasElement = document.getElementById("canvas");
	canvas = canvasElement.getContext("2d");

	// Update canvas size upon resize
	$(window).resize(function(){
		canvasElement.width = window.innerWidth;
		canvasElement.height = window.innerHeight;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		//console.log("Canvas width: " + canvas.width);
		//console.log("Canvas height: " + canvas.height);
	});

	_onLoad();
});

var _timeSinceLastRender;
function _renderFrame(timestamp) {
	//console.log("init._renderFrame")
	var deltatime = timestamp - _timeSinceLastRender;
	_timeSinceLastRender = timestamp;

	if (motionBlur) {
		canvas.fillStyle = '#fff';
		canvas.globalAlpha = 0.2;
		canvas.fillRect(0, 0, canvas.width, canvas.height);
		canvas.globalAlpha = 1;
	} else {
		canvas.clearRect(0, 0, canvas.width, canvas.height);
	}
	update(deltatime);

	window.requestAnimationFrame(_renderFrame);
}

function _onLoad(){
	//console.log("init._onLoad")
	$(window).resize();
	start();
	_timeSinceLastRender = performance.now();
	window.requestAnimationFrame(_renderFrame);
}