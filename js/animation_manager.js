function AnimationManager() {
	this.anims = [];
};

AnimationManager.prototype.startAnimation = function(player, animtype, dir) {
	if (animtype === 'hit') {
		this.anims[this.anims.length] = new HitAnimation(this, player, dir, performance.now());
	}
};

AnimationManager.prototype.drawAnimations = function() {
	var currTime = performance.now();
	for (var i = 0; i < this.anims.length; i++) {
		this.anims[i].update();
	}
};

function HitAnimation(animManager, player, dir, startTime) {
	this.animManager = animManager;
	this.player = player;
	this.dir = dir;
	this.startTime = startTime;
	this.endTime = startTime + 1000;
	this.animTimeLen = endTime - startTime;
}

HitAnimation.prototype.update = function(currTime) {
	var progressedTime = currTime - this.startTime;
	if (progressedTime >= this.endTime) {
		this.animManager.remove(this);
	} else {
		drawHit(player, this.dir, progressedTime/this.animTimeLen);
	}
};
