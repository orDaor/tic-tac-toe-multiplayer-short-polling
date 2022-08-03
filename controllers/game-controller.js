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
async function createGameSession(req, res, next) {
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
    player = new Player(req.body.name, symbol, playerNumber, true);
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
  let arrivedFirst;
  if (areBothPlayerStolsAvailable) {
    arrivedFirst = true;
  } else {
    arrivedFirst = false;
  }

  //connect the client to the room room with an available player stol (player number) 1 or 2
  playerNumber = availableRoom.getAvailablePlayerSlot();
  symbol = availableRoom.getAvailableGameSymbol();

  //create a player with the user input data and save it inside the room
  player = new Player(req.body.name, symbol, playerNumber, arrivedFirst);
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

  if (areBothPlayerStolsAvailable) {
    responseData.isYourTurn = true;
  } else {
    //only one player slot was free in the available room found
    if (availableRoom.gameStatus.getCurrentTurn()) {
      //the player waiting in the room did already his move
      responseData.isYourTurn = true;
    } else {
      //the player waiting in the room did not dio his move yet
      responseData.isYourTurn = false;
    }
  }

  res.json(responseData);
  return;
}

//get actual game status data
async function getRoomData(req, res, next) {
  //init response data
  let responseData = {};

  //fetch game session fata
  const roomId = req.session.gameData.roomId;
  const playerNumber = req.session.gameData.playerNumber;

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

  //fetch game session fata
  const roomId = req.session.gameData.roomId;
  const playerNumber = req.session.gameData.playerNumber;

  //fetch room from the DB where client is playing
  let room;
  try {
    room = await Room.findById(roomId);
    //make move: might fail if coordinates are not ok, or it's not this player turn
    const player = room.getPlayer(playerNumber);
    room.gameStatus.makeMove(player, coord);
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
  //responseData.gameOverStatus = ??
  res.json(responseData);
}

//export
module.exports = {
  getGame: getGame,
  createGameSession: createGameSession,
  getRoomData: getRoomData,
  makeMove: makeMove,
};
