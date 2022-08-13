//imports built in

//inports 3rd party

//imports custom
const Room = require("./room-model");
const GameStatus = require("./game-status-model");
const Player = require("./player-model");
const GameMove = require("./game-move-model");
const GameBoardCellData = require("./game-board-cell-data-model");
const gameUtil = require("../utils/game-util");

class ViewData {
  constructor(room, playerNumber) {
    //if a room is passed with no player number, then return an error because
    //the output room data are built here relative to the player who is requesting such room data,
    //and which is currently playing inside this room
    if (room && !playerNumber) {
      throw new Error("Player number parameter is missing");
    }

    //room game status and players
    let gameStatus;
    let players;
    if (room) {
      gameStatus = room.gameStatus;
      players = room.players;
    } else {
      //dummy values
      playerNumber = 1;
      gameStatus = new GameStatus(
        gameUtil.getEmptyBoard(),
        new GameMove(0, [null, null], "null")
      );
      players = [
        new Player("", "", 0, false, false),
        new Player("", "", 0, false, false),
      ];
    }

    //check what player has the turn in this room
    const gameTurn = gameStatus.getCurrentTurn();
    const isYourTurn =
      (gameTurn && gameTurn === playerNumber) ||
      (!gameTurn && players[playerNumber - 1].hasTurn);

    //game board data
    const board = gameStatus.board;
    const boardRowsNumber = board.length;
    const boardColumnsNumber = board[0].length;
    const boardCellsNumber = boardRowsNumber * boardColumnsNumber;
    this.boardCellsList = new Array(boardCellsNumber);

    //create view data based on an existing room data
    //NOTE: playerNumber: player number of the client requesting this view
    if (room) {
      const gameOverStatus = gameStatus.getGameOverStatus();
      //show the game UI and hide the config section
      this.gameConfigDisplay = "none";
      this.activeGameDisplay = "block";

      //set player names, symbols and number
      this.player1Name = players[0].name;
      this.player2Name = players[1].name;
      this.player1Symbol = players[0].symbol;
      this.player2Symbol = players[1].symbol;
      this.player1Number = players[0].number;
      this.player2Number = players[1].number;

      //other player number with which client is playing
      const otherPlayerNumber = gameUtil.getOtherPlayerNumber(playerNumber);
      this.isOtherPlayerConnected =
        !room.isPlayerSlotAvailable(otherPlayerNumber);

      //game turn
      this.isYourTurn = isYourTurn;

      //name of the player requesting this room data
      this.yourPlayerName = players[playerNumber - 1].name;

      //player is asking for continuing the game in this room
      this.continueGame = true;

      //room url for private (owned) room
      if (!this.isOtherPlayerConnected) {
        this.invitationUrl = `http://localhost:3000/game/new/friend/${room.roomId}`;
      } else {
        this.invitationUrl = "";
      }

      if (!gameOverStatus.isOver) {
        //game is not over yet...
        this.isGameOver = false;
        this.gameOverStatusDisplay = "none";
        this.gameTurnInfoDisplay = "flex";
        this.gameOverStatusText = "Game over status text";
        this.activeGameButtonsDisplay = "flex";
        //set the active player name based on current player turn
        if (isYourTurn) {
          this.activePlayerName = "YOUR";
          this.activePlayerNameNextSibling = "";
        } else {
          if (room.isPlayerSlotAvailable(otherPlayerNumber)) {
            this.activePlayerName = "Other Player";
          } else {
            this.activePlayerName = players[otherPlayerNumber - 1].name;
          }
          this.activePlayerNameNextSibling = "'s";
        }
      } else {
        //game is over...
        this.isGameOver = true;
        this.gameOverStatusDisplay = "block";
        this.gameTurnInfoDisplay = "none";
        this.activePlayerName = "Active Player Name";
        this.activePlayerNameNextSibling = "'s";
        this.activeGameButtonsDisplay = "none";
        //check is game is over because of a winner or a draw
        if (gameOverStatus.isWinner) {
          if (gameOverStatus.winnerPlayerNumber === playerNumber) {
            this.gameOverStatusText = "You WON!";
          } else {
            this.gameOverStatusText = "You LOST!";
          }
        } else {
          this.gameOverStatusText = "It's a DRAW!";
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
            isYourTurn && !gameOverStatus.isOver
          );
        }
      }

      return;
    }

    //if no room data then create default dummy view data
    this.gameConfigDisplay = "block";
    this.activeGameDisplay = "none";
    this.gameOverStatusDisplay = "none";
    this.gameOverStatusText = "Game over status text";
    this.gameTurnInfoDisplay = "flex";
    this.player1Name = "Player 1 Name";
    this.player2Name = "Player 2 Name";
    this.player1Symbol = "";
    this.player2Symbol = "";
    this.player1Number = 0;
    this.player2Number = 0;
    this.isOtherPlayerConnected = false;
    this.activePlayerName = "Active Player Name";
    this.activePlayerNameNextSibling = "'s";
    this.activeGameButtonsDisplay = "flex";
    this.isYourTurn = false;
    this.yourPlayerName = "";
    this.continueGame = false;
    this.isGameOver = true;
    this.invitationUrl = "";
    //create a list of empty cells
    for (let i = 0; i < boardRowsNumber; i++) {
      for (let j = 0; j < boardColumnsNumber; j++) {
        const arrayCoord = gameUtil.fromMatrixCoordToArrayCoord(board, i, j);
        this.boardCellsList[arrayCoord] = new GameBoardCellData(
          i + 1,
          j + 1,
          "",
          true
        );
      }
    }
  }
}

//export
module.exports = ViewData;
