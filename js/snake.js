(function() {
  //we wrap everything in an IIFE to create sense of closure and scope
  window.MySnake = window.MySnake || {};

  var Utils = window.MySnake.Utils;

  var Snake = window.MySnake.Snake = function (board) {
    this.board = board;
    this.dir = "N";
    this.prevDir = "N";
    this.segments = [[18, 6], [17, 6], [16, 6]];
    this.appleJuice = 0;
  };

  Snake.APPLEPOWER = 2
  Snake.DIRS = ["N", "S", "E", "W"];
  MySnake.DELTAS = {
    "N": [-1, 0],
    "S": [1, 0],
    "W": [0, -1],
    "E": [0, 1]
  };

  Snake.prototype.eatApple = function() {
    this.appleJuice += Snake.APPLEPOWER;
  };

  Snake.prototype.move = function() {
    var newPos = Utils.plus(this.segments.slice(-1)[0], MySnake.DELTAS[this.dir]);
    this.checkCollision(newPos);
    this.checkOnBoard(newPos);
    this.handleApple(newPos);

    this.segments.push(newPos);
    this.prevDir = this.dir;

    if (this.appleJuice) {      //evals false if === 0
      this.appleJuice -= 1;
    } else {
      this.segments.shift();
    };
  };

  Snake.prototype.isOpposite = function(dir) {
    return Utils.isOppositeDeltas(MySnake.DELTAS[this.prevDir], MySnake.DELTAS[dir]);
    //need to bind? think i'm invoking method-style a few lines below
  };

  Snake.prototype.turn = function(dir) {
    if(this.isOpposite(dir)) {
      throw "can't move in opposite direction!";      //prolly should return
    };
    this.dir = dir;       //QUESTION: still updates this.dir after throw?
  };

  Snake.prototype.checkCollision = function(pos) {
    for (var i = 0; i < this.segments.length; i++) {
      if ( Utils.equals(this.segments[i], pos) ) {
        throw "You collide!"
      };
    };
  };

  Snake.prototype.checkOnBoard = function(pos) {
    console.log(pos)
    if (pos[0] < 0 || pos[0] >= ( this.board.gridSize() ) ||
        pos[1] < 0 || pos[1] >= ( this.board.gridSize() )) {
      throw "off board!";
    };
  };

  Snake.prototype.handleApple = function(pos) {
    if (this.board.isApple(pos)) {
      this.appleJuice += Snake.APPLEPOWER;
      this.board.handleAppleEaten();
    };
  };

  Snake.prototype.onPosition = function(pos) {
    return Utils.includes(this.segments, pos);
  };

})();
