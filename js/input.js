var keyPressed = {
	W: false,
	A: false,
	S: false,
	D: false
};

var _keyFuncMap = {};
var _keyArgMap = {};
var _keyHoldEnabledMap = {};
function addKeyPressFunction(keycode, holdEnabled, args, func) {
	if (typeof func === 'function') {
		console.log("function mapped to " + keycode);
		_keyFuncMap[keycode] = func;
		_keyArgMap[keycode] = args;
		_keyHoldEnabledMap[keycode] = holdEnabled;
		keyPressed[keycode] = false;
	} else {
		console.log("Argument func isn't a function");
	};
}

$(document).ready(function(){
	//console.log("input.js loaded");
	$(document).keydown(function(event){
		var keycode = event.which;
		if (keycode == 122 || keycode == 123 || keycode === 116) {
			console.log("F11, F12, or F5 pressed");
			return;
		}
		else if (keycode === 87) keyPressed["W"] = true;
		else if (keycode === 65) keyPressed["A"] = true;
		else if (keycode === 83) keyPressed["S"] = true;
		else if (keycode === 68) keyPressed["D"] = true;
		else if (_keyFuncMap.hasOwnProperty(keycode)) {
			if (!_keyHoldEnabledMap[keycode] && keyPressed[keycode]) {

			} else {
				var args = _keyArgMap[keycode];
				_keyFuncMap[keycode](args);
				keyPressed[keycode] = true;
			}
		} else {
			console.log("Keycode " + keycode + " pressed");
		}

		event.preventDefault();
	});

	$(document).keyup(function(event){
		var keycode = event.which;
		if (keycode === 87) keyPressed["W"] = false;
		else if (keycode === 65) keyPressed["A"] = false;
		else if (keycode === 83) keyPressed["S"] = false;
		else if (keycode === 68) keyPressed["D"] = false;
		else if (_keyFuncMap.hasOwnProperty(keycode)) {
			keyPressed[keycode] = false;
		} else {
			//console.log("Keycode " + keycode + " lifted");
		}
	})
})