(function() {
  window.MySnake = window.MySnake || {};

  var Utils = window.MySnake.Utils;

  var Board = window.MySnake.Board = function() {
    this.coolGrid = {};
    this.cells = {};
    this.setupCoolGridAndCells();
    this.snake = new MySnake.Snake(this);
    this.apples = [];
    this.score = 0;
    this.render();
  };

  Board.SIZE = 50;
  Board.MAXAPPLES = 1;
  Board.APPLEVALUE = 10;

  Board.onBoard = function(pos) {
    if (pos[0] >= 0 && pos[0] < ( Board.SIZE ) &&
        pos[1] >= 0 && pos[1] < ( Board.SIZE )) {
      return true;
    } else {
      return false;
    }
  };

  Board.prototype.setupCoolGridAndCells = function() {
    for (var i = 0; i < Board.SIZE; i++) {
      for (var j = 0; j < Board.SIZE; j++) {
        this.coolGrid[[i, j]] = {
          snake: false,
          apple: false,
          dead: false,
          foe: false,
          friend: false
        };
        this.cells[[i, j]] = new MySnake.Cell(this, [i, j]);
      };
    };
  };

  Board.prototype.render = function() {
    var $divs = $(".snake-game div");
    $divs.removeClass();

    for (var i = 0; i < $divs.length; i++) {
      var $currentDiv = $($divs[i]);
      var currentPos = $currentDiv.data("position");
      var divClasses = this.coolGrid[currentPos];

      Object.keys(divClasses).forEach( function(className) {
        if (divClasses[className]) {
          $currentDiv.addClass(className);
        }
      });
    };

    $(".snake-game .score").text(this.score);
  };

  Board.prototype.seedFoes = function() {
    var pos = this.generateRandPos(2);

    var fpentDeltas = MySnake.Cell.FPENT_DELTAS;
    var coordinates = [];
    fpentDeltas.forEach( function(delta) {
      var newPos = [ pos[0] + delta[0], pos[1] + delta[1] ];
      if (Board.onBoard(newPos)) {
        coordinates.push(newPos);
      }
    });

    coordinates.forEach( function(pos) {
      this.cells[pos].seedFoe();
    }.bind(this));
  };

  Board.prototype.seedFriends = function(pos) {
    var coordinates = [];
    MySnake.Cell.DELTAS.forEach( function(delta) {
      var newPos = [ pos[0] + delta[0], pos[1] + delta[1] ];
      if (Board.onBoard(newPos)) {
        coordinates.push(newPos);
      }
    });
    coordinates.forEach( function(coord) {
      this.cells[coord].seedFriend();
    }.bind(this));
  };

  Board.prototype.seedHelper = function(friend) {
    var deltas = (friend ? MySnake.Cell.DELTAS : MySnake.Cell.FPENT_DELTAS);
  };

  Board.prototype.handleCells = function() {
    this.refreshCells();

    if (Math.random() < 0.1) {
      this.seedFoes();
    }
  }

  Board.prototype.refreshCells = function() {
    var board = this;
    Object.keys(this.cells).forEach( function(pos) {
      board.cells[pos].prepareNextState();
    });

    Object.keys(this.cells).forEach( function(pos) {
      board.cells[pos].advanceNextState();
    });
  };

  Board.prototype.growApples = function() {
    if (this.apples.length === Board.MAXAPPLES) {
      return;
    };

    var randomPos = [this.snake.segments[0][0], this.snake.segments[0][1]]
    while ( this.snake.onPosition(randomPos) ) {
      randomPos = this.generateRandPos(0);
    };

    this.apples.push(randomPos);
    this.coolGrid[randomPos].apple = true;
  };

  Board.prototype.generateRandPos = function(padding) {
    return [
      Math.floor( Math.random() * (Board.SIZE - padding * 2) ) + padding,
      Math.floor( Math.random() * (Board.SIZE - padding * 2) ) + padding
    ];
  };

  Board.prototype.isApple = function(pos) {
    return this.coolGrid[pos].apple;
  };

  Board.prototype.turnSnake = function(dir) {
    this.snake.turn(dir);
  };

  Board.prototype.moveSnake = function() {
    this.snake.move();
  };

  Board.prototype.handleAppleEaten = function() {
    this.score += Board.APPLEVALUE;
    var applePos = this.apples.pop();
    this.coolGrid[applePos].apple = false;
    this.seedFriends(applePos);
  };

  Board.prototype.clearCellClasses = function(pos) {
    var div = this.coolGrid[pos];
    div.dead = false;
    div.friend = false;
    div.foe = false;
  };

  Board.prototype.scoreCellConversion = function() {
    this.score += 1;
  };

})();
