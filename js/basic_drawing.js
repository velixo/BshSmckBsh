function drawRect(x, y, width, height, color) {
	canvas.fillStyle = evalArg(color, "#000");
	canvas.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
	canvas.fillStyle = evalArg(color, "#0d0");
	canvas.beginPath();
	canvas.arc(x, y, radius, 0, 2*Math.PI);
	canvas.fill();
}

function drawText(x, y, text) {
	canvas.font="40px Georgia";
	canvas.fillText(text, x, y);
}