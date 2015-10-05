(function() {
  window.War = window.War || {};

  var Utils = window.War.Utils;

  var Snake = window.War.Snake = function (board) {
    this.board = board;
    this.dir = "N";
    this.prevDir = "N";
    this.segments = [[39, 15], [38, 15], [37, 15]];
    this.appleJuice = 0;
    this.commands = [];
  };

  Snake.APPLEPOWER = 2
  Snake.DIRS = ["N", "S", "E", "W"];
  War.DELTAS = {
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
    this.turnToCommands();

    var newPos = Utils.plus(this.segments.slice(-1)[0], War.DELTAS[this.dir]);
    this.checkCollisions(newPos);

    this.segments.push(newPos);
    this.board.gridClasses[newPos].snake = true;
    this.board.updateHead(newPos);
    this.prevDir = this.dir;

    this.cutTailOrDrinkJuice();
  };

  Snake.prototype.checkCollisions = function(pos) {
    try {
      this.board.render();
      this.checkSelfCollision(pos);
      this.checkEdgeCollision(pos);
      this.checkAndHandleApple(pos);
    } catch(e) {
      this.board.alertLoss();
    };
  }

  Snake.prototype.cutTailOrDrinkJuice = function() {
    if (this.appleJuice) {
      this.appleJuice -= 1;
    } else {
      var lastPos = this.segments.shift();
      this.board.gridClasses[lastPos].snake = false;
    };
  };

  Snake.prototype.checkPrevDir = function() {
    if (!this.dir) {
      this.dir = this.prevDir;
    }
  };

  Snake.prototype.turnToCommands = function() {
    this.scrubCommands();
    if (this.commands.length > 0) {
      this.dir = this.commands.shift();
    }
  };

  Snake.prototype.scrubCommands = function() {
    if (this.commands.length > 0) {
      while (this.isOpposite(this.commands[0])) {
        this.commands.shift();
      };
    }
  };

  Snake.prototype.isOpposite = function(dir) {
    return Utils.isOppositeDeltas(War.DELTAS[this.prevDir], War.DELTAS[dir]);
  };

  Snake.prototype.addToCommands = function(dir) {
    this.commands.push(dir);
  };

  Snake.prototype.checkSelfCollision = function(pos) {
    for (var i = 0; i < this.segments.length; i++) {
      if ( Utils.equals(this.segments[i], pos) ) {
        throw "lose"
      }
    };
  };

  Snake.prototype.checkEdgeCollision = function(pos) {
    if (!War.Board.onBoard(pos)) {
      throw "lose";
    }
  };

  Snake.prototype.checkAndHandleApple = function(pos) {
    if (this.board.isApple(pos)) {
      this.appleJuice += Snake.APPLEPOWER;
      this.board.handleAppleEaten();
    };
  };

  Snake.prototype.onPosition = function(pos) {
    return Utils.includes(this.segments, pos);
  };

})();
