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

//export
module.exports = router;
