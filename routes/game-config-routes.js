//imports built-in
//...

//imports 3rd party
const express = require("express");

//imports custom
const gameConfigController = require("../controllers/game-config-controller");

//create router
const router = express.Router();

//main game page from which to request to join a random room
router.get("/", gameConfigController.getGame);

//get the page from the invitation link by a friend
router.get("/new/friend/:roomId", gameConfigController.getGameInvitation);

//export
module.exports = router;
