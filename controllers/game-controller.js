//imports built in

//inports 3rd party

//imports custom
const Room = require("../models/room-model");
const GameStatus = require("../models/game-status-model");
const GameMove = require("../models/game-move-model");
const Player = require("../models/player-model");
const validation = require("../utils/validation-util");
const sessionUtil = require("../utils/sessions-util");

//main game page
function getGame(req, res) {
  //fetch game data from the client session
  const gameSession = req.session.gameData;

  //init game data to be injected in the view
  const gameData = {};

  if (gameSession) {
    //fetch game data to be injected in the view
  } else {
    //...
  }

  //response
  res.render("game", { gameData: gameData });
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
    const playerNumber = newRoom.getAvailablePlayerSlot(); //default = 1 in an empty room
    const symbol = newRoom.getAvailableGameSymbol(); //default = X in an empty room

    //create a player with the user input data and save it inside the room
    const player = new Player(req.body.name, symbol, playerNumber);
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

    //map the client to the save room with the chosen playern number by its session
    const gameSessionData = {
      roomId: newRoomId.toString(),
      playerNumber: playerNumber,
    };
    sessionUtil.saveGameSession(req, gameSessionData);

    //set and send response data
    responseData.players = newRoom.players;
    responseData.gameStatus = newRoom.gameStatus;
    responseData.playerNumber = playerNumber;
    res.json(responseData);
    return;
  }

  //if an available room was found, connect the client to that room
  //with a player number 1 or 2
}

//export
module.exports = {
  getGame: getGame,
  createGameSession: createGameSession,
};
