//imports built-in
//...

//imports 3rd party
const express = require("express");

//imports custom
//...

//create router
const router = express.Router();

//home page
router.get("/game", function (req, res) {
  res.render("game");
});

//export
module.exports = router;
