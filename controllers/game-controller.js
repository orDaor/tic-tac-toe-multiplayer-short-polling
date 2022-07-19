//imports built in

//inports 3rd party

//imports custom
const Room = require("../models/room-model");
const GameStatus = require("../models/game-status-model");
const GameMove = require("../models/game-move-model");
const Player = require("../models/player-model");

//associate the client as a player number to a new game room 
function createGameSession(req, res) {
  //create player from data received from user
  const player = new Player(req.body.name);
  console.log(player);
}

//export
module.exports = {
  createGameSession: createGameSession,
};
