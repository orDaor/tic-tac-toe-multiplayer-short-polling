//imports built in

//inports 3rd party

//imports custom
const Room = require("../models/room-model");
const GameStatus = require("../models/game-status-model");
const GameMove = require("../models/game-move-model");
const Player = require("../models/player-model");
const ViewData = require("../models/view-data-model");
const validation = require("../utils/validation-util");
const sessionUtil = require("../utils/sessions-util");
const gameUtil = require("../utils/game-util");

//main game page
async function getGame(req, res, next) {
  //fetch game data from the client session
  const gameSession = req.session.gameData;

  let viewData;
  if (gameSession) {
    //fetch game data to be injected in the view
    try {
      req.locals.room = await Room.findById(roomId);
      viewData = {
        // ...viewUtil.getInitViewData(),
        ...req.locals.room,
      };
    } catch (error) {
      //send page
    }
    //
  } else {
    //...
  }

  //response
  res.render("game");
}

//associate the client as a player number to a new game room
async function joinNewRoom(req, res, next) {
  //init response data
  let responseData = {};
  //validate user input
  if (!validation.isUserInputValid(req.body)) {
    responseData.message =
      "Please choose a valid name with at least 3 characters";
    responseData.inputNotValid = true;
    res.json(responseData);
    return;
  }

  //look for an existing available game room
  let availableRoom;
  let playerNumber;
  let symbol;
  let player;
  try {
    availableRoom = await Room.findAvailableAndBlock();
  } catch (error) {
    next(error);
    return;
  }

  //if no available room was found, create a new one
  if (!availableRoom) {
    const newRoom = Room.createEmpty();

    //find a player number and symbol for the client
    playerNumber = newRoom.getAvailablePlayerSlot(); //default = 1 in an empty room
    symbol = newRoom.getAvailableGameSymbol(); //default = X in an empty room

    //create a player with the user input data and save it inside the room
    player = new Player(req.body.name, symbol, playerNumber, true, false);
    newRoom.addPlayer(player);

    //save the new created room in the DB
    let newRoomId;
    try {
      newRoomId = await newRoom.save();
    } catch (error) {
      next(error);
      return;
    }

    //update room object
    newRoom.roomId = newRoomId.toString();

    //map the client to the saved room by its session
    sessionUtil.saveGameSession(req, {
      roomId: newRoom.roomId,
      playerNumber: playerNumber,
    });

    //set and send response data
    responseData.players = newRoom.players;
    responseData.gameStatus = newRoom.gameStatus;
    responseData.playerNumber = playerNumber;
    responseData.isYourTurn = true;
    res.json(responseData);
    return;
  }

  //check if both player slots are availabe in the room found
  const areBothPlayerStolsAvailable =
    availableRoom.isPlayerSlotAvailable(1) &&
    availableRoom.isPlayerSlotAvailable(2);

  //check if client is first player to join the found room
  let hasPlayerTurn;
  if (areBothPlayerStolsAvailable) {
    //no other player was found in this available room
    hasPlayerTurn = true;
  } else {
    if (availableRoom.gameStatus.getCurrentTurn()) {
      //another player was found which already did his move
      hasPlayerTurn = true;
    } else {
      //another player was found which did not do his move yet
      hasPlayerTurn = false;
    }
  }

  //connect the client to the room room with an available player stol (player number) 1 or 2
  playerNumber = availableRoom.getAvailablePlayerSlot();
  symbol = availableRoom.getAvailableGameSymbol();

  //create a player with the user input data and save it inside the room
  player = new Player(
    req.body.name,
    symbol,
    playerNumber,
    hasPlayerTurn,
    false
  );
  availableRoom.addPlayer(player);

  //un-block the room
  availableRoom.blocked = false;

  //update the room in the DB with the new values
  try {
    await availableRoom.save();
  } catch (error) {
    next(error);
    return;
  }

  //the room was update successfully in the DB...
  //map the client to the saved room by its session
  sessionUtil.saveGameSession(req, {
    roomId: availableRoom.roomId,
    playerNumber: playerNumber,
  });

  //set and send response data
  responseData.players = availableRoom.players;
  responseData.gameStatus = availableRoom.gameStatus;
  responseData.playerNumber = playerNumber;
  responseData.isYourTurn = hasPlayerTurn;
  res.json(responseData);
  return;
}

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
  getGame: getGame,
  joinNewRoom: joinNewRoom,
  getRoomData: getRoomData,
  makeMove: makeMove,
  playAgain: playAgain,
};
