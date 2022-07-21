//imports built in

//inports 3rd party

//imports custom

class GameStatus {
  constructor(board, lastMove) {
    this.board = board; //[ row ][ col ] matrix of values 1 and 2 (each value represents the player number who did the move)
    this.lastMove = lastMove;
  }
}

//export
module.exports = GameStatus;
