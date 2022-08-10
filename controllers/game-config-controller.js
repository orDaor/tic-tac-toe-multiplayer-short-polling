//imports built in

//inports 3rd party

//imports custom
const Room = require("../models/room-model");
const viewData = require("../models/view-data-model");
const gameUtil = require("../utils/game-util");

//main game page
async function getGame(req, res, next) {
  //render template where user can enter his name for joinin a random room
  res.render("game", {
    viewData: new viewData(), //default meaningless room data
    isInvited: false,
    roomId: null,
    hostPlayerName: "",
  });
}

//invitation page
async function getGameInvitation(req, res, next) {
  //requested private room id
  const roomId = req.params.roomId;

  //game session data
  const sessionGameData = req.session.gameData;

  let room;
  try {
    room = await Room.findByIdAndCheckAccessRights(roomId, sessionGameData);
  } catch (error) {
    next(error);
    return;
  }

  //player is alredy assigned the requested room
  if (sessionGameData) {
    if (sessionGameData.roomId === roomId) {
      //render template where user can continues the game in the room which he is already assigned to
      res.render("game", {
        viewData: new viewData(room, sessionGameData.playerNumber), //actual room data
        isInvited: false,
        roomId: null,
        hostPlayerName: "",
      });
      return;
    }
  }

  //render template where user can enter his name for joinin the new room which he is NOT already assigned to
  const availablePlayerSlot = room.getAvailablePlayerSlot();
  const hostPlayerNumber = gameUtil.getOtherPlayerNumber(availablePlayerSlot);
  res.render("game", {
    viewData: new viewData(), //default meaningless room data
    isInvited: true,
    roomId: roomId,
    hostPlayerName: room.players[hostPlayerNumber - 1].name,
  });
}

//export
module.exports = {
  getGame: getGame,
  getGameInvitation: getGameInvitation,
};
