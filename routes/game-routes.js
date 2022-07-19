//imports built-in
//...

//imports 3rd party
const express = require("express");

//imports custom
const gameController = require("../controllers/game-controller");

//create router
const router = express.Router();

//main game page
router.get("/", function (req, res) {
  //fetch game data from the client session
  const gameSession = req.session.gameData;

  //init game data to be injected in the view
  const gameData = {};

  if (gameSession) {
    //fetch game data to be injected in the view
  } else {
  }

  //response
  res.render("game", { gameData: gameData });
});

//create a game session for the client
router.post("/new", gameController.createGameSession);

//export
module.exports = router;
