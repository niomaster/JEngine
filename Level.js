function Level() {
	this.objects = [];

	this.init = function(initFunc) {
		initFunc();

		for()
	}

	this.render = function(g) {
		for(var i = 0; i < this.objects.length; i += 1) {
			this.objects[i].render(g);
		}
	}

	this.tick = function(time) {
		for(var i = 0; i < this.objects.length; i += 1) {
			this.objects[i].tick(time);
		}
	}

	this.addObject = function(object) {
		this.objects.push(object);
	}

	this.deleteObject = function(object) {
		for(var i = 0; i < this.objects.length; i += 1) {
			if(this.objects[i] == object) {
				this.objects.splice(i, 1);
				return true;
			}
		}

		return false;
	}
}