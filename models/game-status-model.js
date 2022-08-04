//imports built in

//inports 3rd party

//imports custom
const GameMove = require("../models/game-move-model");
const GameOverStatus = require("../models/game-over-status-model");
const gameUtil = require("../utils/game-util");

class GameStatus {
  constructor(board, lastMove) {
    this.board = board; //[ row ][ col ] matrix of values of 1 and 2 (each value represents the player number who did the move, 0 = no move)
    this.lastMove = lastMove; //object of class GameMove
  }
  //generate GameStatus Class object from mongodb document
  static fromMongoDBDocumentToGameStatus(document) {
    //if no document return undefined
    if (!document) {
      return undefined;
    }

    //transform last move of the document in GameMove class object
    const lastMove = GameMove.fromMongoDBDocumentToGameMove(document.lastMove);

    //create and return GameStatus class object
    return new GameStatus(document.board, lastMove);
  }

  //make a game move
  makeMove(player, coord) {
    //requested matrix coordinates where the player want to make his move
    const row = +coord[0];
    const col = +coord[1];

    //check matrix coord validity
    const rowsNumber = this.board.length;
    const columnsNumber = this.board[0].length;
    const inputsOk =
      row >= 0 && col >= 0 && row <= rowsNumber && col <= columnsNumber;
    if (!inputsOk) {
      throw new Error("Matrix coordinates out of range");
    }

    //check if user is allowed to make the move: is it his turn?
    const currentTurn = this.getCurrentTurn();
    if (
      (currentTurn && currentTurn !== player.number) ||
      (!currentTurn && !player.hasTurn)
    ) {
      throw new Error("Player wants to make a move, but it is not his turn");
    }

    //check if user is allowed to make the move: was game over?
    const gameOverStatus = this.getGameOverStatus();
    if (gameOverStatus.isOver) {
      throw new Error("Player wants to make a move, but game is over");
    }

    //check if in the requested cell coordinates a move was already performed
    if (this.board[row - 1][col - 1]) {
      throw new Error("A game move to this coordinates was already made");
    }

    //update matrix board
    this.board[row - 1][col - 1] = player.number;
    //update lastMove (by using GameMove constructor?)
    this.lastMove = new GameMove(player.number, coord);
  }

  //which player's turn is it?
  getCurrentTurn() {
    const lastMovePlayerNumber = this.lastMove.playerNumber;
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
    //check for a winner
    const winnerCases = gameUtil.getWinnerCases();
    for (let i = 0; i < winnerCases.length; i++) {
      if (gameUtil.isWinnerCaseOccured(this.board, winnerCases[i])) {
        return new GameOverStatus(true, true, i, this.lastMove.playerNumber);
      }
    }

    //check for a draw
    //compute rows and columns number
    const rowsNumber = this.board.length;
    const columnsNumber = this.board[0].length;

    //check if there is at least 1 empty cell to exclude draw case as well
    for (let i = 0; i < rowsNumber; i++) {
      for (let j = 0; j < columnsNumber; j++) {
        if (!this.board[i][j]) {
          //NO draw occured
          return new GameOverStatus(false);
        }
      }
    }

    //a draw occured
    return new GameOverStatus(true);
  }

  //reset
  reset() {
    this.board = gameUtil.getEmptyBoard();
    this.lastMove = new GameMove(0, [null, null], "null");
  }
}

//export
module.exports = GameStatus;
