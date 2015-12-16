var keyPressed = {
	W: false,
	A: false,
	S: false,
	D: false
};

$(document).ready(function(){
	//console.log("input.js loaded");
	$(document).keydown(function(event){
		var keycode = event.which;
		if (keycode == 122 || keycode == 123 || keycode === 116) {
			console.log("F11, F12, or F5 pressed");
			return;
		} else if (keycode === 87) keyPressed["W"] = true;
		else if (keycode === 65) keyPressed["A"] = true;
		else if (keycode === 83) keyPressed["S"] = true;
		else if (keycode === 68) keyPressed["D"] = true;
		else {
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
		else {
			console.log("Keycode " + keycode + " pressed");
		}
	})
})