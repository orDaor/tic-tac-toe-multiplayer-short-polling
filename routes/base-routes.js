//imports built-in
//...

//imports 3rd party
const express = require("express");

//imports custom
//...

//create router
const router = express.Router();

//home page
router.get("/", function (req, res) {
  res.redirect("/game");
});

//not found error
router.get("/404", function (req, res) {
  res.status(404).render("404");
});

//server error
router.get("/500", function (req, res) {
  res.status(500).render("500");
});

//export
module.exports = router;
