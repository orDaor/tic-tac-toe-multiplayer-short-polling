//imports built in

//inports 3rd party

//imports custom
const Room = require("../models/room-model");
const GameStatus = require("../models/game-status-model");
const GameMove = require("../models/game-move-model");
const Player = require("../models/player-model");
const validation = require("../utils/validation");

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
function createGameSession(req, res) {
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

  //
}

//export
module.exports = {
  getGame: getGame,
  createGameSession: createGameSession,
};
