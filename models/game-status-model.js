//imports built in

//inports 3rd party

//imports custom

class GameStatus {
  constructor(board, lastMove, roomId) {
    this.board = board;
    this.lastMove = lastMove;
    this.roomId = roomId;
  }
}

//export
module.exports = GameStatus;
