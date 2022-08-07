//imports built-in
//...

//imports 3rd party
const express = require("express");

//imports custom
const gameController = require("../controllers/game-controller");

//create router
const router = express.Router();

//main game page
router.get("/", gameController.getGame);

//create a game session for the client
router.post("/new", gameController.joinRandomRoom);

//fetch actual game status data
router.get("/room", gameController.getRoomData);

//make game move
router.post("/status", gameController.makeMove);

//restart the game with the other player
router.post("/restart", gameController.playAgain);

//create and join a new private room where to invite a friend
router.post("/new/friend", gameController.createAndJoinPrivateRoom);

//join a private room from a friend invitation
router.get("/new/friend", gameController.joinPrivateRoom);

//export
module.exports = router;
