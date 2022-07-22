//imports built in

//inports 3rd party

//imports custom

class GameStatus {
  constructor(board, lastMove) {
    this.board = board; //[ row ][ col ] matrix of values 1 and 2 (each value represents the player number who did the move)
    this.lastMove = lastMove;
  }
  //generate GameStatus Class object from mongodb document
  static fromMongoDBDocumentToGameStatus(document) {
    //if no document return undefined
    if (!document) {
      return undefined;
    }
    //create and return GameStatus class object
    return new GameStatus(document.board, document.lastMove);
  }
}

//export
module.exports = GameStatus;
