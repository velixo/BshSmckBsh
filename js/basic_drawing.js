function drawRect(x, y, width, height, color) {
	canvas.fillStyle = _evalArg(color, "#000");
	canvas.fillRect(x, y, x + width, y + height);
}

function drawCircle(x, y, radius, color) {
	canvas.fillStyle = _evalArg(color, "#0f0");
	canvas.beginPath();
	canvas.arc(x, y, radius, 0, 2*Math.PI);
	canvas.fill();
}

function _evalArg(arg, def) {
	if (arg === 'undefined') {
		return def;
	} else {
		return arg;
	}
}