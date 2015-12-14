$(document).ready(function(){
	$(document).keydown(function(event){
		var keycode = event.which;
		if (keycode === keycode == 122 || keycode == 123) {
			console.log("F11 or F12 pressed")
			return;
		}
		event.preventDefault();
	}
})