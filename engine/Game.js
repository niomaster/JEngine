function Game() {
    this.levels = [];
    this.currentLevel = null;
    this.lastTick = null;
    
    this.addLevel = function(level) {
        this.levels.push(level);
        level.game = this;
        return this;
    };
    
    this.removeLevel = function(level) {
        for(var i = 0; i < this.levels.length; i += 1) {
            if(this.levels[i] == level) {
                this.levels.splice(i, 1);
                return true;
            }
        }
        
        return false;
    }
    
    this.getFirstLevel = function() {
        return this.levels[0];
    }
    
    this.getLevel = function(i) {
        return this.levels[i];
    }
    
    this.switchLevel = function(level) {
        this.currentLevel = level;
    }
    
    this.prevLevel = function() {
        this.currentLevel = this.levels[this.getLevelIndex(this.currentLevel) - 1];
    }
    
    this.nextLevel = function() {
        this.currentLevel = this.levels[this.getLevelIndex(this.currentLevel) + 1];
    }
    
    this.getLevelIndex = function(level) {
        for(var i = 0; i < this.levels.length; i += 1) {
            if(this.levels[i] == level) {
                return i;
            }
        }
        
        return -1;
    }
    
    this.getSelectedLevel = function() {
        return this.currentLevel;
    }
    
    this.init = function() {
        for(var i = 0; i < this.levels.length; i += 1) {
            this.levels[i].doInit();
        }
    
        this.lastTick = new Date().getTime();
    }
    
    this.tick = function() {
        var newTick = new Date().getTime();
        this.currentLevel.tick(newTick - this.lastTick);
        this.lastTick = newTick;
    }
    
    this.render = function() {
        this.currentLevel.render(this.g);
    }
}
