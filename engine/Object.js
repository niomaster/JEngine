function Object() {
    this.x = 0;
    this.y = 0;
    this.w = 32;
    this.h = 32;
    this.level = null;
    this.isStatic = false;
    
    this.initFunc = function(){};
    this.tickFunc = function(){};
    this.renderFunc = function(){};
    
    this.init = function(initFunc) {
        initFunc();
        return this;
    }
    
    this.tick = function(tickFunc) {
        this.tickFunc = tickFunc;
        return this;
    }
    
    this.render = function(renderFunc) {
        this.renderFunc = renderFunc;
        return this;
    }
    
    this.doInit = function() {
        this.initFunc();
    }
    
    this.doTick = function(len) {
        this.tickFunc(len);
    }
    
    this.doRender = function(g) {
        this.renderFunc(g);
    }
    
    //Movement functions, toepassen of niet?
    this.moveLeft(speed) {
    	this.x -= speed;
    }
    
    this.moveRight(speed) {
    	this.x += speed;
    }
    
    this.moveUp(speed) {
    	this.y -= speed;
    }
    
    this.moveDown(speed) {
    	this.y += speed;
    }
}
