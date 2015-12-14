var canvasElement;
var canvas;

$(document).ready(function(){
	canvasElement = document.getElementById("canvas");
	canvas = canvasElement.getContext("2d");
	canvas.height = canvasElement.height;
	canvas.width = canvasElement.width;
})