(function() {
  //we wrap everything in an IIFE to create sense of closure and scope
  window.MySnake = window.MySnake || {};

  var Utils = window.MySnake.Utils;

  var Snake = window.MySnake.Snake = function (board) {
    this.board = board;
    this.dir = "N";
    this.prevDir = "N";
    this.segments = [[18, 6], [17, 6], [16, 6]];    //tail is FIRST
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
    this.checkPrevDir();

    var newPos = Utils.plus(this.segments.slice(-1)[0], MySnake.DELTAS[this.dir]);
    this.checkCollision(newPos);
    this.checkOnBoard(newPos);
    this.handleApple(newPos);

    this.segments.push(newPos);
    this.board.coolGrid[newPos].snake = true;
    this.prevDir = this.dir;

    if (this.appleJuice) {      //evals false if === 0
      this.appleJuice -= 1;     //PH - extends snake here by not cutting tail
    } else {
      var lastPos = this.segments.shift();
      this.board.coolGrid[lastPos].snake = false;      //PH**** refactor
    };
  };

  Snake.prototype.checkPrevDir = function() {
    if (!this.dir) {
      this.dir = this.prevDir;
    }
  };

  Snake.prototype.isOpposite = function(dir) {
    return Utils.isOppositeDeltas(MySnake.DELTAS[this.prevDir], MySnake.DELTAS[dir]);
  };

  Snake.prototype.turn = function(dir) {
    if(this.isOpposite(dir)) {
      return;
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
    if (!MySnake.Board.onBoard(pos)) {
      throw "off board!";
    }
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
