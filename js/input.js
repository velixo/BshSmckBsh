$(document).ready(function(){
	console.log("input.js loaded");
	$(document).keydown(function(event){
		var keycode = event.which;
		if (keycode == 122 || keycode == 123 || keycode === 116) {
			console.log("F11, F12, or F5 pressed");
			return;
		} else if (keycode === 87) { //W key
			console.log("W was pressed");
			onLoadd();
		} else if (keycode === 65) { //A key
			console.log("A was pressed");
		}  else if (keycode === 83) { //S key
			console.log("S was pressed");
		}  else if (keycode === 68) { //D key
			console.log("D was pressed");
		} else {
			console.log("Keycode " + keycode + " pressed");
		}

		event.preventDefault();
	});
})