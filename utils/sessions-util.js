//imports built in

//inports 3rd party

//imports custom

function saveGameSession(req, gameData) {
  req.session.gameData = gameData;
}

//exports
module.exports = {
  saveGameSession: saveGameSession,
};
