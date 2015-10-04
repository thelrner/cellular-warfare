(function() {
  //PH** - have the board run all the cells every time so it can detect if
  window.MySnake = window.MySnake || {};

  var Cell = window.MySnake.Cell = function(board, pos) {
    this.pos = pos;
    this.board = board;
    this.alive = false;
    this.aliveNext = false;
    this.friendly = false;
    this.friendlyNext = false;
    this.friendLiveCount = 0;
    this.enemyLiveCount = 0;
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
    if (this.board.coolGrid[this.pos].apple && !this.friendly) {
      this.aliveNext = false;
      return;
    }

    //PH**** - if you're an enemy and there's three friendlies, you're gonna convert and die.
    // if you're dead and there's three friendlies, you're gonna be a friendly.
    // OR: if you're dead and there's three enemies, you're gonna be an enemy

    this.setNeighborLiveCounts();

    if (this.friendly) {
      if (this.friendLiveCount === 2 || this.friendyCount === 3) {
        this.aliveNext = true;
      } else {
        this.aliveNext = false;
        this.convertToEnemy();      //do i need this? Or should I always stand ready to convert to whichever?
        //PH**** - problems is, you convert to an enemy before actually painting to the board... your aliveNext has already changed to false, but you're read as a live enemy cell THIS ROUND!
      }
    } else {
      if (this.friendLiveCount === 3) {
        this.convertToFriendly();
        this.aliveNext = true;
      } else if (this.enemyLiveCount === 3) {
        this.aliveNext = true;
      } else if (this.enemyLiveCount === 2) {
        this.aliveNext = this.alive;
      } else {
        this.aliveNext = false;
      }
    }
    //PH** -- factor out magic numbers into constants
    //PH** -- make a status instvar -- either friendly, dead, or enemy...


    // if (this.enemyLiveCount === Cell.LIVEREQ) {
    //   this.aliveNext = true;
    // } else if (this.enemyLiveCount === Cell.BIRTHREQ) {
    //   if (this.alive) {
    //     this.aliveNext = true;
    //   } else {
    //     this.aliveNext = false;
    //   }
    // } else {
    //   this.aliveNext = false;
    // }
  };

  Cell.prototype.advanceNextState = function() {
    this.alive = this.aliveNext;
    this.friendly = this.friendlyNext;

    this.board.clearCellClasses(this.pos);
    var boardDiv = this.board.coolGrid[this.pos]

    if (this.friendly) {
      boardDiv.cellFriendly = this.alive;
    } else {
      boardDiv.cell = this.alive;
    }

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
    this.friendLiveCount = 0;
    this.enemyLiveCount = 0;
    this.neighbors().forEach( function(neighbor) {
      if (neighbor.alive) {
        neighbor.friendly ? this.friendLiveCount += 1 : this.enemyLiveCount += 1;
      }
    }.bind(this) );
  };

  Cell.prototype.seedEnemy = function() {
    if (this.friendly) {
      return
    } else {
      this.convertToEnemy();
      this.alive = true;
    }
  };

  Cell.prototype.seedFriend = function() {
    this.convertToFriendly();
    this.alive = true;
  }

  Cell.prototype.convertToFriendly = function() {
    this.friendlyNext = true;
  };

  Cell.prototype.convertToEnemy = function() {
    this.friendlyNext = false;
  };

})();
