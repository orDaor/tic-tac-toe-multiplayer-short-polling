//imports built-in
//...

//imports 3rd party
const express = require("express");

//imports custom
const gameConfigController = require("../controllers/game-config-controller");

//create router
const router = express.Router();

//main game page
router.get("/", gameConfigController.getGame);

//export
module.exports = router;
