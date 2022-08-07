//imports built in

//inports 3rd party

//imports custom
const Room = require("../models/room-model");
const GameStatus = require("../models/game-status-model");
const GameMove = require("../models/game-move-model");
const gameUtil = require("../utils/game-util");

//get actual game status data
async function getRoomData(req, res, next) {
  //init response data
  let responseData = {};

  //fetch game session data
  const sessionGameData = req.session.gameData;
  if (!sessionGameData) {
    next(error);
    return;
  }
  const roomId = sessionGameData.roomId;
  const playerNumber = sessionGameData.playerNumber;

  //fetch room from the DB where client is playing
  let room;
  try {
    room = await Room.findById(roomId);
  } catch (error) {
    next(error);
    return;
  }
  //check whether the turn is of the player who sent the request
  const isYourTurn = room.gameStatus.getCurrentTurn() === playerNumber;

  //set and send response data
  if (isYourTurn) {
    responseData.room = {};
    responseData.room.players = room.players;
    responseData.room.gameStatus = room.gameStatus;
    responseData.room.gameOverStatus = room.gameStatus.getGameOverStatus();
  } else {
    responseData.room = null;
  }
  res.json(responseData);
}

//make a game move
async function makeMove(req, res, next) {
  //init response data
  let responseData = {};

  //body data
  const coord = req.body.coord; //[row,col]

  //fetch game session data
  const sessionGameData = req.session.gameData;
  if (!sessionGameData) {
    next(error);
    return;
  }
  const roomId = sessionGameData.roomId;
  const playerNumber = sessionGameData.playerNumber;

  //fetch room from the DB where client is playing
  let room;
  try {
    room = await Room.findById(roomId);
    //handle game restarting requests
    room.handleGameRestart(playerNumber);
    //make move: might fail if coordinates are not ok, or it's not this player turn
    const player = room.getPlayer(playerNumber);
    room.gameStatus.makeMove(player, coord);
    //update hasTurn property of players
    room.setPlayersTurn(playerNumber);
    //save updated room in the document
    await room.save();
  } catch (error) {
    next(error);
    return;
  }

  //set and send response
  responseData.players = room.players;
  responseData.gameStatus = room.gameStatus;
  responseData.playerNumber = playerNumber;
  responseData.gameOverStatus = room.gameStatus.getGameOverStatus();
  res.json(responseData);
}

//start a new game with the other player
async function playAgain(req, res, next) {
  //init response data
  let responseData = {};

  //fetch game session data
  const sessionGameData = req.session.gameData;
  if (!sessionGameData) {
    next(error);
    return;
  }
  const roomId = sessionGameData.roomId;
  const playerNumber = sessionGameData.playerNumber;

  //fetch room from the DB where client is playing
  let room;
  try {
    room = await Room.findById(roomId);
  } catch (error) {
    next(error);
    return;
  }

  const gameOverStatus = room.gameStatus.getGameOverStatus();
  const otherPlayerNumber = gameUtil.getOtherPlayerNumber(playerNumber);

  if (gameOverStatus.isOver) {
    //either it is a winner or a draw
    //init player turn
    responseData.isYourTurn = false;
    //check if player is the one who lost the game
    const isLooserPlayer =
      gameOverStatus.isWinner &&
      gameOverStatus.winnerPlayerNumber !== playerNumber;

    //check if the player had a draw but did not make last move
    const isDrawAndHasTurn =
      gameOverStatus.isDraw && room.players[playerNumber - 1].hasTurn;

    if (isLooserPlayer || isDrawAndHasTurn) {
      //first turn will be of the looser gamer
      responseData.isYourTurn = true;
      //turn on restarting player flags in the room
      room.initGameRestart();
      try {
        await room.save();
      } catch (error) {
        next(error);
        return;
      }
    }
    //game status data for updating the frontend
    responseData.gameStatus = new GameStatus( //empty game status
      gameUtil.getEmptyBoard(),
      new GameMove(0, [null, null], "null")
    );
  } else if (
    room.players[playerNumber - 1].restartingRequest &&
    !room.players[otherPlayerNumber - 1].restartingRequest
  ) {
    //game status containing first move made by the other client
    responseData.gameStatus = room.gameStatus;
    responseData.isYourTurn = true;
  } else {
    const error = new Error(
      "An error occured when player tried to re-start the game"
    );
    next(error);
    return;
  }

  //set and send response data
  responseData.players = room.players;
  responseData.playerNumber = playerNumber;
  res.json(responseData);
  return;
}

//export
module.exports = {
  getRoomData: getRoomData,
  makeMove: makeMove,
  playAgain: playAgain,
};
