//imports built-in
//...

//imports 3rd party
const express = require("express");

//imports custom
const gameRoomController = require("../controllers/game-room-controller");

//create router
const router = express.Router();

//create a game session for the client
router.post("/new", gameRoomController.joinRandomRoom);

//create and join a new private room where to invite a friend
router.post("/new/friend", gameRoomController.createAndJoinPrivateRoom);

//join a private room from a friend invitation
router.post("/:roomId", gameRoomController.joinPrivateRoom);

//export
module.exports = router;
