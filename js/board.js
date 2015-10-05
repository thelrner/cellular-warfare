(function() {
  window.War = window.War || {};

  var Utils = window.War.Utils;

  var Board = window.War.Board = function(options) {
    this.gridClasses = {};
    this.cells = {};
    this.setupGridClassesAndCells();
    this.snake = new War.Snake(this);
    this.head = this.snake.segments.slice(-1)[0];
    this.apples = [];
    this.score = 0;
    this.render();
  };

  Board.SIZE = 50;
  Board.MAX_APPLES = 1;
  Board.APPLE_VALUE = 50;
  Board.CAPTURE_VALUE = 1;

  Board.onBoard = function(pos) {
    if (pos[0] >= 0 && pos[0] < ( Board.SIZE ) &&
        pos[1] >= 0 && pos[1] < ( Board.SIZE )) {
      return true;
    } else {
      return false;
    }
  };

  Board.prototype.setupGridClassesAndCells = function() {
    for (var i = 0; i < Board.SIZE; i++) {
      for (var j = 0; j < Board.SIZE; j++) {
        this.gridClasses[[i, j]] = {
          snake: false,
          head: false,
          apple: false,
          dead: false,
          foe: false,
          friend: false
        };
        this.cells[[i, j]] = new War.Cell(this, [i, j]);
      };
    };
  };

  Board.prototype.render = function() {
    var $divs = $(".war-game div");
    $divs.removeClass();

    for (var i = 0; i < $divs.length; i++) {
      var $currentDiv = $($divs[i]);
      var currentPos = $currentDiv.data("position");
      var divClasses = this.gridClasses[currentPos];

      Object.keys(divClasses).forEach( function(className) {
        if (divClasses[className]) {
          $currentDiv.addClass(className);
        }
      });
    };

    $("p.scorecard strong.score").text(this.score);
  };

  Board.prototype.updateHead = function(pos) {
    this.gridClasses[this.head].head = false;
    this.head = pos;
    this.gridClasses[this.head].head = true;
  };

  Board.prototype.seedFoes = function() {
    var pos = this.generateRandPos(2);
    this.seedHelper(false, pos);
  };

  Board.prototype.seedFriends = function(pos) {
    this.seedHelper(true, pos);
  };

  Board.prototype.seedHelper = function(friend, pos) {
    var deltas = (friend ? War.Cell.DELTAS : War.Cell.FPENT_DELTAS);

    var coordinates = [];
    deltas.forEach( function(delta) {
      var newPos = [ pos[0] + delta[0], pos[1] + delta[1] ];
      if (Board.onBoard(newPos)) {
        coordinates.push(newPos);
      }
    });

    coordinates.forEach( function(coord) {
      friend ? this.cells[coord].seedFriend() : this.cells[coord].seedFoe();
    }.bind(this));
  };

  Board.prototype.handleCells = function() {
    this.refreshCells();

    if (Math.random() < 0.1) {
      this.seedFoes();
    }
  };

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
    if (this.apples.length === Board.MAX_APPLES) {
      return;
    };

    var randomPos = [this.snake.segments[0][0], this.snake.segments[0][1]]
    while ( this.snake.onPosition(randomPos) ) {
      randomPos = this.generateRandPos(0);
    };

    this.apples.push(randomPos);
    this.gridClasses[randomPos].apple = true;
  };

  Board.prototype.generateRandPos = function(padding) {
    return [
      Math.floor( Math.random() * (Board.SIZE - padding * 2) ) + padding,
      Math.floor( Math.random() * (Board.SIZE - padding * 2) ) + padding
    ];
  };

  Board.prototype.isApple = function(pos) {
    return this.gridClasses[pos].apple;
  };

  Board.prototype.turnSnake = function(dir) {
    this.snake.addToCommands(dir);
  };

  Board.prototype.moveSnake = function() {
    this.snake.move();
  };

  Board.prototype.handleAppleEaten = function() {
    this.incrementScore(Board.APPLE_VALUE);
    var applePos = this.apples.pop();
    this.gridClasses[applePos].apple = false;
    this.seedFriends(applePos);
  };

  Board.prototype.incrementScore = function(num) {
    this.score += num;
  };

  Board.prototype.clearCellClasses = function(pos) {
    var div = this.gridClasses[pos];
    div.dead = false;
    div.friend = false;
    div.foe = false;
  };

  Board.prototype.scoreCellConversion = function() {
    this.incrementScore(Board.CAPTURE_VALUE);
  };

  Board.prototype.alertLoss = function() {
    console.log('handling loss');
    $(".war-game div").trigger("loss");
  };

  Board.prototype.clearBoard = function() {
    $(".war-game div").removeClass();
  };

})();
