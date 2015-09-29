(function() {
  window.MySnake = window.MySnake || {};

  var Utils = window.MySnake.Utils;

  var Board = window.MySnake.Board = function() {
    this.grid = [];
    this.setupGrid();
    this.snake = new MySnake.Snake(this);
    this.apples = [];
    this.score = 0;
    this.render();      //should render at initialize?
  };

  Board.SIZE = 60;
  Board.MAXAPPLES = 1;
  Board.APPLEVALUE = 10;

  Board.onBoard = function(pos) {
    if pos[0]
  };

  Board.prototype.gridSize = function() {
    return this.grid.length;
  };

  Board.prototype.setupGrid = function() {
    for (var i = 0; i < Board.SIZE; i++) {
      this.grid.push([]);
      for (var j = 0; j < Board.SIZE; j++) {
        this.grid[i].push(null);
      };
    };
  };

  Board.prototype.render = function() {
    var $cells = $(".snake-game div");

    for (var i = 0; i < $cells.length; i++) {
      var $currentCell = $($cells[i])
      var currentPos = $currentCell.data("position");
      // you can't see this data from the html, but you CAN see it here;
      $currentCell.removeClass("snake");
      $currentCell.removeClass("apple");

      if (this.snake.onPosition(currentPos)) {
        $currentCell.addClass("snake");
      } else if (this.isApple(currentPos)) {
        $currentCell.addClass("apple");
      };
    };

    $(".snake-game .score").text(this.score);
  };
  //QUESTION: ok to add score from board here?

  Board.prototype.growApples = function() {
    if (this.apples.length === Board.MAXAPPLES) {
      return;
    };

    var randX = this.snake.segments[0][0];
    var randY = this.snake.segments[0][1];

    while ( this.snake.onPosition([randX, randY]) ) {
      randX = Math.floor( Math.random() * Board.SIZE );
      randY = Math.floor( Math.random() * Board.SIZE );
    };

    this.apples.push([randX, randY]);
  };

  Board.prototype.isApple = function(pos) {
    return Utils.includes(this.apples, pos);
  };

  Board.prototype.mapSnake = function() {
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
    this.apples.pop();
    this.score += Board.APPLEVALUE;
  };

})();
