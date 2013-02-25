var obj_ctrl = new Object().init(function() {
  this.x = 0;
  this.y = 0;
}).tick(function(time) {
  this.x += time / 10;
}).render(function(g) {
  g.fillStyle = 'black';
  g.clearRect(this.x, this.y, 32, 32);
});