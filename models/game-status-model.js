//imports built in

//inports 3rd party

//imports custom
const gameUtil = require("../utils/game-util");

class GameStatus {
  constructor(board, lastMove) {
    this.board = board; //[ row ][ col ] matrix of values 1 and 2 (each value represents the player number who did the move)
    this.lastMove = lastMove; //object of class GameMove
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

  //which player's turn is it?
  getCurrentTurnPlayerNumber() {
    const lastMovePlayerNumber = this.lastMove.playernumber;
    if (lastMovePlayerNumber === 1) {
      return 2;
    } else if (lastMovePlayerNumber === 2) {
      return 1;
    } else {
      return undefined;
    }
  }

  //check if the game is over and whether there is a winner or a draw
  getGameOverStatus() {
    //init game over status
    const gameOverStatus = {
      isOver: false,
      isWinner: false,
    }

    //

    //return computed game over status
    return gameOverStatus;
  }
}

//export
module.exports = GameStatus;
