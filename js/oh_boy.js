(function() {
  //we wrap everything in an IIFE to create sense of closure and scope
  window.MySnake = window.MySnake || {};

  var OhBoy = window.MySnake.OhBoy = function(board) {
    this.board = board;
  };

  OhBoy.neighborCount = function() {
    this.position.count();
  };

  OhBoy.seed = function(pos) {

  };

})();

//instantiate a conway here -- every single one is going to be its own cell.
//every single round, it counts the # of neighbors.
