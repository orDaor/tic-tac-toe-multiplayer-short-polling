//imports built in

//inports 3rd party

//imports custom
const Room = require("./room-model");
const GameBoardCellData = require("./game-board-cell-data-model");
const gameUtil = require("../utils/game-util");

class ViewData {
  constructor(room, playerNumber) {
    const gameStatus = room.gameStatus;
    const gameTurn = gameStatus.getCurrentTurn();
    const board = gameStatus.board;
    const boardRowsNumber = board.length;
    const boardColumnsNumber = board[0].length;
    const boardCellsNumber = boardRowsNumber * boardColumnsNumber;
    this.boardCellsList = new Array(boardCellsNumber);

    //create view data based on an existing room data
    //NOTE: playerNumber: player number of the client requesting this view
    if (room) {
      const players = room.players;
      const gameOverStatus = gameStatus.getGameOverStatus();
      //show the game UI and hide the config section
      this.gameConfigDisplay = "none";
      this.activeGameDisplay = "block";

      //set player names and symbols
      this.player1Name = players[0].name;
      this.player2Name = players[1].name;
      this.player1Symbol = players[0].symbol;
      this.player2Symbol = players[1].symbol;

      if (!gameOverStatus.isOver) {
        //game is not over yet...
        this.gameOverStatusDisplay = "none";
        this.gameTurnInfoDisplay = "block";
        this.gameOverStatusText = "Game over status text";
        //set the active player name based on current player turn
        if (gameTurn === playerNumber) {
          this.activePlayerName = "YOUR";
          this.activePlayerNameNextSibling = "";
        } else {
          //other player number with which client is playing
          const otherPlayerNumber = gameUtil.getOtherPlayerNumber(playerNumber);
          if (room.isPlayerSlotAvailable(otherPlayerNumber)) {
            this.activePlayerName = "Other Player";
          } else {
            this.activePlayerName = players[otherPlayerNumber - 1].name;
          }
          this.activePlayerNameNextSibling = "'s";
        }
      } else {
        //game is over...
        this.gameOverStatusDisplay = "block";
        this.gameTurnInfoDisplay = "none";
        this.activePlayerName = "Active Player Name";
        this.activePlayerNameNextSibling = "'s";
        //check is game is over because of a winner or a draw
        if (gameOverStatus.isWinner) {
          if (gameOverStatus.winnerPlayerNumber === playerNumber) {
            this.gameOverStatusText = "You WON!";
          } else {
            this.gameOverStatusText = "You LOST";
          }
        } else {
          this.gameOverStatusText = "It's a DRAW";
        }
      }

      //set the current game board values inside a list of items, where
      //each item is an object with a text content, row/col coordinates and class
      for (let i = 0; i < boardRowsNumber; i++) {
        for (let j = 0; j < boardColumnsNumber; j++) {
          let symbol;
          let gameMoveNumber = board[i][j];
          if (!gameMoveNumber) {
            symbol = "";
          } else {
            symbol = players[gameMoveNumber - 1].symbol;
          }
          const arrayCoord = gameUtil.fromMatrixCoordToArrayCoord(board, i, j);
          this.boardCellsList[arrayCoord] = new GameBoardCellData(
            i + 1,
            j + 1,
            symbol,
            gameTurn === playerNumber && !gameOverStatus.isOver
          );
        }
      }
      return;
    }

    //if no room data then create default view data
    this.gameConfigDisplay = "block";
    this.activeGameDisplay = "none";
    this.gameOverStatusDisplay = "none";
    this.gameOverStatusText = "Game over status text";
    this.gameTurnInfoDisplay = "block";
    this.player1Name = "Player 1 Name";
    this.player2Name = "Player 2 Name";
    this.player1Symbol = "";
    this.player2Symbol = "";
    this.activePlayerName = "Active Player Name";
    this.activePlayerNameNextSibling = "'s";
    //create a list of empty cells
    for (let i = 0; i < boardRowsNumber; i++) {
      for (let j = 0; j < boardColumnsNumber; j++) {
        const arrayCoord = gameUtil.fromMatrixCoordToArrayCoord(board, i, j);
        this.boardCellsList[arrayCoord] = new GameBoardCellData(i, j, "", true);
      }
    }
  }
}

//export
module.exports = ViewData;

//test
const testRoom = {
  // _id: ObjectId("62e95464a6ba388593a659ab"),
  players: [
    { name: "Orgher", symbol: "X", number: 1 },
    { name: "Manu", symbol: "O", number: 2 },
  ],
  gameStatus: {
    board: [
      [1, 2, 1],
      [1, 2, 2],
      [2, 1, 1],
    ],
    lastMove: {
      playerNumber: 1,
      coord: [3, 3],
      // date: ISODate("2022-08-02T16:44:41.754Z")
    },
  },
  available: false,
  // creationDate: ISODate("2022-08-02T16:44:20.085Z"),
  blocked: false,
};

const testRoomFromClass = Room.fromMongoDBDocumentToRoom(testRoom);

const testViewData = new ViewData(testRoomFromClass, 2);
// testViewData = new ViewData(null);
console.log(testViewData);
