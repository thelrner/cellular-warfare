(function() {
  window.MySnake = window.MySnake || {};

  var Utils = window.MySnake.Utils;

  var Board = window.MySnake.Board = function() {
    this.coolGrid = {};
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
    };
    //PH**** - remake this so that the snake and apples will mark themselves into the coolGrid object with value "apple", "snake", "block", etc.
    //onPosition, isApple

    $(".snake-game .score").text(this.score);
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
    return this.coolGrid[pos] === 'apple';
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
