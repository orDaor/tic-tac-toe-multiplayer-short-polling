//imports built in

//inports 3rd party

//imports custom
const db = require("../data/database");

class Player {
  constructor(name, symbol, roomId, number) {
    this.name = name;
    this.symbol = symbol;
    this.roomId = roomId;
    this.number = number;
  }
  //
}

//export
module.exports = Player;