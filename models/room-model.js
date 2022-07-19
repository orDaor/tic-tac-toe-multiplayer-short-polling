//imports built in

//inports 3rd party

//imports custom

class Room {
  constructor(players, gameStatus, avaiable, creationDate, roomId) {
    this.players = players; //Array[1,2] of class Player
    this.gameStatus = gameStatus; //Object of class GameStatus
    this.avaiable = avaiable;
    this.creationDate = creationDate;
    this.roomId = roomId;
  }
  //
}

//export
module.exports = Room;
