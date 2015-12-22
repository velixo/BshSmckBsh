/** Returns def if arg is undefined, NaN, or Null. Else, returns arg.*/
function evalArg(arg, def) {
	var argType = typeof arg;
	if(argType === 'undefined' || argType === 'NaN' || argType === 'Null') {
		return def;
	} else {
		return arg;
	}
}

function colorFloatToHex(r, g, b) {
	r = Math.floor(255 * r);
	g = Math.floor(255 * g);
	b = Math.floor(255 * b);
	return "#" + _componentToHex(r) + _componentToHex(g) + _componentToHex(b);
}

function _componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}