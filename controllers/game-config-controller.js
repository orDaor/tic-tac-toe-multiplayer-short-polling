//imports built in

//inports 3rd party

//imports custom

//main game page
async function getGame(req, res, next) {
  //response
  res.render("game");
}

//export
module.exports = {
  getGame: getGame,
};
