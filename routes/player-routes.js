//imports built-in
//...

//imports 3rd party
const express = require("express");

//imports custom
const playerController = require("../controllers/player-controller");

//create router
const router = express.Router();

//fetch other player data of a given room
router.get("/other", playerController.getOtherPlayerData);

//export
module.exports = router;
