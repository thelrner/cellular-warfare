(function() {
  //PH** - have the board run all the cells every time so it can detect if
  window.MySnake = window.MySnake || {};

  var Cell = window.MySnake.Cell = function(board, pos) {
    this.pos = pos;
    this.board = board;
    // this.alive = false;
    // this.aliveNext = false;
    // this.friendly = false;
    // this.friendlyNext = false;

    // status can be either dead, friend, or foe;
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

  Cell.prototype.prepareNextState = function() {
    if (this.board.coolGrid[this.pos].apple) {
      this.statusNext = 'dead';
      return;
    }

    //PH**** - if you're an enemy and there's three friendlies, you're gonna convert and die.
    // if you're dead and there's three friendlies, you're gonna be a friendly.
    // OR: if you're dead and there's three enemies, you're gonna be an enemy

    this.setNeighborLiveCounts();

    // if (this.foeCount === 3) {
    //   this.statusNext = 'foe';
    // } else if (this.foeCount === 2) {
    //   if (this.status === 'foe') {
    //     this.statusNext = 'foe';
    //   }
    // } else {
    //   this.statusNext = 'dead';
    // }

    if (this.friendCount === 3) {
      this.statusNext = 'friend';
    } else if (this.foeCount === 3) {
      this.statusNext = 'foe';

    } else if (this.friendCount === 2) {
      if (this.status === 'friend') {
        this.statusNext = 'friend';
      }
      //if you're an enemy, you ignore friendCounts...
    } else if (this.foeCount === 2) {
      //by now, you'll already have checked for friendCount, so if you get here you must be an enemy
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
    var boardDiv = this.board.coolGrid[this.pos]

    //PH -- cases here!!!
    boardDiv[this.status] = true;

    // this.aliveNext = false;       //just a reset
  };

  Cell.prototype.neighbors = function() {
    //won't I need to check friendly here?...I mean, if I'm already an enemy, and I'm surrounded by 3 friends, I want to turn into a FRIEND.
    //if I'm an enemy and surrounded by 3 friendlies, I should turn into a friendly? Or should I die?
    //Let's try: cell dies if it's surrounded by 3 friendlies ()
    //AKA: IF YOU'RE AN ENEMY, CASE FOR SURROUNDING FRIENDLIES HERE
    var neighbors = [];
    Cell.DELTAS.forEach( function(delta) {
      var deltaPos = [ this.pos[0] + delta[0], this.pos[1] + delta[1] ];
      if ( MySnake.Board.onBoard(deltaPos) ) {
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
    if (this.status === 'friend') {     //PH** - added precaution
      return
    } else {
      this.status = 'foe';
    }
  };

  Cell.prototype.seedFriend = function() {
    this.status = 'friend';
  };

})();
