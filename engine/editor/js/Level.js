function Level() {
    this.objects = [];
    this.game = null;
    this.initFunc = function (){};

    this.init = function(initFunc) {
        this.initFunc = initFunc;
    }

    this.doInit = function() {
        this.initFunc();
        
        for(var i = 0; i < this.objects.length; i += 1) {
            this.objects[i].doInit();
        }
    }

    this.render = function(g) {
        for(var i = 0; i < this.objects.length; i += 1) {
            this.objects[i].doRender(g);
        }
    }

    this.tick = function(time) {
        for(var i = 0; i < this.objects.length; i += 1) {
            this.objects[i].doTick(time);
        }
    }

    this.addObject = function(object) {
        object.level = this;
        this.objects.push(object);
        return this;
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
