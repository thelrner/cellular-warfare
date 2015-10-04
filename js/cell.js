(function() {
  window.War = window.War || {};

  var Cell = window.War.Cell = function(board, pos) {
    this.pos = pos;
    this.board = board;
    this.status = 'dead';
    this.statusNext = 'dead';
    this.friendCount = 0;
    this.foeCount = 0;
  };

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

  Cell.FPENT_DELTAS = [[-1, 0], [0, 0], [-1, 1], [0, -1], [1, 0]];

  Cell.prototype.prepareNextState = function() {
    if (this.board.gridClasses[this.pos].apple) {
      this.statusNext = 'dead';
      return;
    }

    this.setNeighborLiveCounts();

    //opt for if-else rather than casing, due to testing multiple values
    if (this.friendCount === 3) {
      this.statusNext = 'friend';
      if (this.status === 'foe') {
        this.board.scoreCellConversion();
      }
    } else if (this.foeCount === 3) {
      this.statusNext = 'foe';

    } else if (this.friendCount === 2) {
      if (this.status === 'friend') {
        this.statusNext = 'friend';
      }
    } else if (this.foeCount === 2) {
      if (this.status === 'foe') {
        this.statusNext = 'foe';
      }
    } else {
      this.statusNext = 'dead';
    }
  };

  Cell.prototype.advanceNextState = function() {
    this.status = this.statusNext;

    this.board.clearCellClasses(this.pos);
    var boardDiv = this.board.gridClasses[this.pos];

    boardDiv[this.status] = true;
  };

  Cell.prototype.neighbors = function() {
    var neighbors = [];
    Cell.DELTAS.forEach( function(delta) {
      var deltaPos = [ this.pos[0] + delta[0], this.pos[1] + delta[1] ];
      if ( War.Board.onBoard(deltaPos) ) {
        neighbors.push(this.board.cells[deltaPos]);
      }
    }.bind(this));

    return neighbors;
  };

  Cell.prototype.setNeighborLiveCounts = function() {
    this.friendCount = 0;
    this.foeCount = 0;
    this.neighbors().forEach( function(neighbor) {
      if (neighbor.status === 'friend') {
        this.friendCount += 1;
      } else if (neighbor.status === 'foe') {
        this.foeCount += 1;
      }
    }.bind(this) );
  };

  Cell.prototype.seedFoe = function() {
    if (this.status === 'friend') {
      return
    } else {
      this.status = 'foe';
    }
  };

  Cell.prototype.seedFriend = function() {
    this.status = 'friend';
  };

})();
