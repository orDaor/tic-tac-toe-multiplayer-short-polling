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
router.post("/new", gameController.createGameSession);

//export
module.exports = router;
