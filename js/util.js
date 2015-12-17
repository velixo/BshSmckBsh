/** Returns def if arg is undefined, NaN, or Null. Else, returns arg.*/
function evalArg(arg, def) {
	var argType = typeof arg;
	if(argType === 'undefined' || argType === 'NaN' || argType === 'Null') {
		return def;
	} else {
		return arg;
	}
}