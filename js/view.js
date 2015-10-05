(function() {
  window.War = window.War || {};

  var View = War.View = function(el) {
    this.$el = $(el);
    this.setupPage();
    this.board = new War.Board();
    this.demoMode = true;
    this.start();
    this.bindEvents();
    this.paused = false;
    this.gameOver = false;
  };

  View.SPEED = 75;
  View.KEYMAPS = {
    38: "N",
    39: "E",
    40: "S",
    37: "W",
  };

  View.prototype.bindEvents = function() {
    this.$el.focus();
    this.$el.on("keydown", this.handleKeyDown.bind(this));
    this.$el.on("click", "strong.new-game", this.startNewGame.bind(this));
    this.$el.on("loss", this.handleGameOver.bind(this));
  };

  View.prototype.startNewGame = function() {
    if (this.demoMode) {
      this.halt();
      this.demoMode = false;
    };
    this.demoMode = false;
    $("strong.game-over").addClass("hidden");
    $("strong.new-game").addClass("hidden");
    this.board.clearBoard();
    this.board = new War.Board();
    this.gameOver = false;
    this.start();
  };

  View.prototype.handleGameOver = function() {
    this.halt();
    this.gameOver = true;
    $("strong.game-over").removeClass("hidden");
    $("strong.new-game").removeClass("hidden");
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
    for (var i = 0; i < War.Board.SIZE; i++) {
      for (var j = 0; j < War.Board.SIZE; j++) {
        var $newCell = $("<div></div>");
        $newCell.data("position", [i, j]);
        this.$el.append($newCell);
      };
    };
  };

  View.prototype.handleKeyDown = function(e) {
    e.preventDefault();
    if (e.keyCode === 32) {
      this.togglePause();
      return;
    }
    if (!View.KEYMAPS[e.keyCode]) {
      return;
    }
    this.board.turnSnake( View.KEYMAPS[e.keyCode] );
  };

  View.prototype.togglePause = function() {
    if (this.gameOver) {
      return;
    }

    if (this.paused) {
      this.start();
    } else {
      this.halt();
    }
  };

  View.prototype.step = function() {
    this.board.growApples();
    this.board.handleCells();
    if (!this.demoMode) {
      this.board.moveSnake();
    }
    this.board.render();
  };

})();
