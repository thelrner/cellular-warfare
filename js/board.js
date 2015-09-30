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
    this.seeds = 0;
    this.render();      //should render at initialize?
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
          cell: false,
        };
        this.cells[[i, j]] = new MySnake.Cell(this, [i, j]);
      };
    };
  };

  Board.prototype.render = function() {
    var $divs = $(".snake-game div");
    $divs.removeClass();
    this.seedEnemies();
    this.refreshCells();

    for (var i = 0; i < $divs.length; i++) {
      var $currentDiv = $($divs[i]);
      var currentPos = $currentDiv.data("position");
      var divClasses = this.coolGrid[currentPos];

      Object.keys(divClasses).forEach( function(divClass) {
        if (divClasses[divClass]) {
          $currentDiv.addClass(divClass);
        }
      });
    };

    $(".snake-game .score").text(this.score);
  };

  Board.prototype.seedEnemies = function() {
    //PH** - RULES: should be greater than 6 away from player head. Should be ON THE BOARD (so choose random restraints accordingly). Should use fpent or methuselah deltas.
    if (this.seeds > 0) {
      return;
    }

    var fpent = [[19, 20], [20, 20], [19, 21], [20, 19], [21, 20]];
    // var fpent = [[9, 10], [10, 10]];
    fpent.forEach( function(pos) {
      this.cells[pos].seedEnemy();    //PH** - should I seed with nextAlive too?
    }.bind(this));
    this.seeds += 1;
  };

  Board.prototype.seedFriendlies = function(pos) {
    var coordinates = []
    MySnake.Cell.DELTAS.forEach( function(delta) {
      coordinates.push([ pos[0] + delta[0], pos[1] + delta[1] ]);
    })
    coordinates.forEach( function(coord) {
      // this.cells[coord].convertToFriendly();
    }.bind(this));
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
    if (this.apples.length === Board.MAXAPPLES) {
      return;
    };

    var randX = this.snake.segments[0][0];
    var randY = this.snake.segments[0][1];
    //so the function below works

    while ( this.snake.onPosition([randX, randY]) ) {
      randX = Math.floor( Math.random() * (Board.SIZE-1) );
      randY = Math.floor( Math.random() * (Board.SIZE-1) );
      //PH** - we seed with Board.SIZE - 1 because need a 3x3 effect!
    };

    this.apples.push([randX, randY]);
    this.coolGrid[ [randX, randY] ].apple = true;
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
    this.seedFriendlies(applePos);
  };

})();
