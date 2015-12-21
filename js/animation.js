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
		this.anims[i].update(currTime);
		if (this.anims[i].finished) {
			this.anims.splice(i, 1);
		}
	}
};

function HitAnimation(animManager, player, dir, startTime) {
	this.animManager = animManager;
	this.player = player;
	this.dir = dir;
	this.startTime = startTime;
	this.endTime = startTime + 500;
	this.animTimeLen = this.endTime - startTime;
	this.finished = false;
}

HitAnimation.prototype.update = function(currTime) {
	var progressedTime = currTime - this.startTime;
	if (currTime >= this.endTime) {
		this.finished = true;
	} else {
		drawHit(player, this.dir, progressedTime/this.animTimeLen);
	}
};
