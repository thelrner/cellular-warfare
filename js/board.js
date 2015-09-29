(function() {
  window.MySnake = window.MySnake || {};

  var Utils = window.MySnake.Utils;

  var Board = window.MySnake.Board = function() {
    this.grid = [];
    this.coolGrid = {};
    this.setupGrid();
    this.setupCoolGrid();
    this.snake = new MySnake.Snake(this);
    this.apples = [];
    this.score = 0;
    this.render();      //should render at initialize?
  };

  Board.SIZE = 30;
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

  Board.prototype.setupGrid = function() {
    for (var i = 0; i < Board.SIZE; i++) {
      this.grid.push([]);
      for (var j = 0; j < Board.SIZE; j++) {
        this.grid[i].push(null);
      };
    };
  };

  Board.prototype.setupCoolGrid = function() {
    for (var i = 0; i < Board.SIZE; i++) {
      for (var j = 0; j < Board.SIZE; j++) {
        this.coolGrid[i, j] = '';             //PH** - remember this evals false
      };
    };
  };

  Board.prototype.render = function() {
    var $cells = $(".snake-game div");
    $cells.removeClass();

    for (var i = 0; i < $cells.length; i++) {
      var $currentCell = $($cells[i])
      var currentPos = $currentCell.data("position");
      $currentCell.addClass(this.coolGrid[currentPos]);
      // you can't see this data from the html, but you CAN see it here;

      // if (this.snake.onPosition(currentPos)) {
      //   $currentCell.addClass("snake");
      // } else if (this.isApple(currentPos)) {
      //   $currentCell.addClass("apple");
      // };
    };
    //PH**** - remake this so that the snake and apples will mark themselves into the coolGrid object with value "apple", "snake", "block", etc.

    $(".snake-game .score").text(this.score);
    //QUESTION: ok to add score from board here?
  };

  Board.prototype.growApples = function() {
    if (this.apples.length === Board.MAXAPPLES) {
      return;
    };

    var randX = this.snake.segments[0][0];
    var randY = this.snake.segments[0][1];
    //so the function below works

    while ( this.snake.onPosition([randX, randY]) ) {
      randX = Math.floor( Math.random() * Board.SIZE );
      randY = Math.floor( Math.random() * Board.SIZE );
    };

    this.apples.push([randX, randY]);
    this.coolGrid[ [randX, randY] ] = 'apple';
  };

  Board.prototype.isApple = function(pos) {
    return Utils.includes(this.apples, pos);
  };

  Board.prototype.mapSnake = function() {       //won't need this with new hash
    this.snake.segments.forEach( function(segPos) {
      this.grid[segPos[0]][segPos[1]] = "S";
    }.bind(this));
    // if didn't bind, context would be window!
  };

  Board.prototype.turnSnake = function(dir) {
    this.snake.turn(dir);
  };

  Board.prototype.moveSnake = function() {
    this.snake.move();
  };

  Board.prototype.handleAppleEaten = function() {
    var applePos = this.apples.pop();
    this.coolGrid[applePos] = 'snake';
    this.score += Board.APPLEVALUE;
  };

})();
