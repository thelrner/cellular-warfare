(function() {
//need IIFE to create scope, private variables/functions, but still have the server run

  window.MySnake = window.MySnake || {};

  var View = MySnake.View = function(el) {
    // this HTML el-ement will hold the display. this is our interface to the web. grabs an element on the page.
    // altho, this already is a jQuery object -- what is the prevObject propty?

    this.$el = $(el);
    this.setupPage();
    this.board = new MySnake.Board();
    this.bindEvents();
    this.start();
    this.paused = false;
  };

  View.SPEED = 75;
  View.KEYMAPS = {
    38: "N",
    39: "E",
    40: "S",
    37: "W",
  };

  View.prototype.start = function() {
    this.intervalId = setInterval(this.step.bind(this), View.SPEED);
    this.paused = false;
  };

  View.prototype.halt = function() {
    clearInterval(this.intervalId);
    this.paused = true;
  };

  View.prototype.setupPage = function() {
    for (var i = 0; i < MySnake.Board.SIZE; i++) {
      for (var j = 0; j < MySnake.Board.SIZE; j++) {
        var $newCell = $("<div></div>");
        //we don't assign class here because we intend to wipe it clean
        $newCell.data("position", [i, j]);
        $newCell.attr('data-crazy', [i, j]);
        //if we set an attribute "position", it would translate array to string
        this.$el.append($newCell);
      };
    };
  };

  View.prototype.bindEvents = function() {
    this.$el.focus();       //focuses on the figure element
    this.$el.on("keydown", this.handleKeyDown.bind(this));
    // can only install "keydown" on elements with FOCUS! give a *tabindex* in html if not a form or something ordinarily focusable
  };

  View.prototype.handleKeyDown = function(e) {
    e.preventDefault();
    // console.log(e.keyCode);
    if (e.keyCode === 32) {
      this.togglePause();
    }
    this.board.turnSnake( View.KEYMAPS[e.keyCode] );
  };

  View.prototype.togglePause = function() {
    if (this.paused) {
      this.start();
    } else {
      this.halt();
    }
  };

  View.prototype.step = function() {
    this.board.growApples();
    this.board.handleCells();
    try {
      this.board.moveSnake();
    } catch(e) {
      alert(e);
      clearInterval(this.intervalId);       //turns off interval;
    };
    this.board.render();
  };

})();
