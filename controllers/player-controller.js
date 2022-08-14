//imports built in

//inports 3rd party

//imports custom
const Room = require("../models/room-model");
const Player = require("../models/player-model");
const gameUtil = require("../utils/game-util");

//get other player data
async function getOtherPlayerData(req, res, next) {
  //init response data
  let responseData = {};

  //fetch game session data
  const sessionGameData = req.session.gameData;
  if (!sessionGameData) {
    const error = new Error("No session game data found");
    next(error);
    return;
  }
  const roomId = sessionGameData.roomId;
  const playerNumber = sessionGameData.playerNumber;
  //find the number of the other player with which the player who sent the request is playing
  const otherPlayerNumber = gameUtil.getOtherPlayerNumber(playerNumber);

  //fetch room from the DB where client is playing
  let room;
  try {
    room = await Room.findById(roomId);
  } catch (error) {
    next(error);
    return;
  }

  //set and send response
  if (room.isPlayerSlotAvailable(otherPlayerNumber)) {
    responseData.otherPlayer = null;
  } else {
    //get the requested player data in the room
    const otherPlayer = room.getPlayer(otherPlayerNumber);
    responseData.otherPlayer = otherPlayer;
  }
  res.json(responseData);
}

//export
module.exports = {
  getOtherPlayerData: getOtherPlayerData,
};
