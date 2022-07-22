//imports built in

//inports 3rd party

//imports custom
const db = require("../data/database");

class Player {
  constructor(name, symbol, number) {
    this.name = name;
    this.symbol = symbol;
    this.number = number;
  }
  //generate Player class object from mongodb player document
  static fromMongoDBDocumentToPlayer(document) {
    //if no document return undefined
    if (!document) {
      return undefined;
    }

    //create and return a Player object
    return new Player(document.name, document.symbol, document.number);
  }
}

//export
module.exports = Player;
