//imports built-in
//...

//imports 3rd party
const express = require("express");

//imports custom
const gamePlayController = require("../controllers/game-play-controller");

//create router
const router = express.Router();

//fetch actual game status data
router.get("/room", gamePlayController.getRoomData);

//make game move
router.post("/status", gamePlayController.makeMove);

//restart the game with the other player
router.post("/restart", gamePlayController.playAgain);

//export
module.exports = router;
