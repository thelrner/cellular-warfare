(function() {
  //we wrap everything in an IIFE to create sense of closure and scope
  window.MySnake = window.MySnake || {};

  var OhBoy = window.MySnake.OhBoy = function(board, pos) {
    this.pos = pos
    this.board = board;
  };

  OhBoy.DELTAS = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1]
  ];

  OhBoy.neighborsIdx = function() {
    var neighborsIdx = []
    OhBoy.DELTAS.forEach( function(delta) {
      var newPos = [ this.pos[0] + delta[0], this.pos[1] + delta[1] ];
      if MySnake.Board.onBoard(newPos) {
        neighborsIdx.push(newPos);
      }
    }.bind(this));

    return neighborsIdx;
  };

  OhBoy.prototype.neighborCount = function() {
    this.pos.count();
  };

  OhBoy.prototype.seed = function(pos) {

  };

})();

//instantiate a conway here -- every single one is going to be its own cell.
//every single round, it counts the # of neighbors.
