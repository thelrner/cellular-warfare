(function() {
  //PH** - have the board run all the cells every time so it can detect if
  window.MySnake = window.MySnake || {};

  var Cell = window.MySnake.Cell = function(board, pos, friendly) {
    this.pos = pos;
    this.board = board;
    this.alive = false;
    this.aliveNext = false;
    this.friendly = friendly ? true : false;
    this.kills = 0;
  };

  Cell.MAXKILLS = 1;
  Cell.BIRTHREQ = 2;
  Cell.LIVEREQ = 3;

  Cell.DELTAS = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1]
  ];

  Cell.prototype.prepareNextState = function() {
    if (this.board.coolGrid[this.pos].apple && !this.friendly) {
      this.aliveNext = false;
      return;
    }

    var liveNeighbors = this.neighborLiveCount();
    if (liveNeighbors === Cell.LIVEREQ) {
      this.aliveNext = true;
    } else if (liveNeighbors === Cell.BIRTHREQ) {
      if (this.alive) {
        this.aliveNext = true;
      } else {
        this.aliveNext = false;
      }
    } else {
      this.aliveNext = false;
    }
  };

  Cell.prototype.advanceNextState = function() {
    this.alive = this.aliveNext;
    this.board.coolGrid[this.pos].cell = this.alive ? true : false;
    //PH -- alternative is to make the board coolGrid an object of objects, which store... {alive: false, apple: false, snake: false}

    this.aliveNext = false;
  };

  Cell.prototype.neighbors = function() {
    //won't I need to check friendly here?...I mean, if I'm already an enemy, and I'm surrounded by 3 friends, I want to turn into a FRIEND.
    //if I'm an enemy and surrounded by 3 friendlies, I should turn into a friendly? Or should I die?
    var neighbors = [];
    Cell.DELTAS.forEach( function(delta) {
      var deltaPos = [ this.pos[0] + delta[0], this.pos[1] + delta[1] ];

      if ( MySnake.Board.onBoard(deltaPos) ) {
        var neighbor = this.board.cells[deltaPos]

        if (neighbor.friendly === this.friendly) {
          neighbors.push(neighbor);
        }
      }
    }.bind(this));

    return neighbors;
  };

  Cell.prototype.neighborLiveCount = function() {
    var liveCount = 0
    this.neighbors().forEach( function(neighbor) {
      neighbor.alive ? liveCount += 1 : null;
    });

    return liveCount;
  };

  Cell.prototype.seedEnemy = function() {
    if (this.friendly) {
      return
    } else {
      this.alive = true;
    }
  };

})();
