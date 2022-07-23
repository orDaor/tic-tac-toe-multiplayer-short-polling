//imports built in

//inports 3rd party

//imports custom

class GameMove {
  constructor(playerNumber, coord, date) {
    this.playerNumber = playerNumber;
    this.coord = coord; //[row, col] array
    this.date = date;
  }

  //generate GameMove class object from mongodb document
  static fromMongoDBDocumentToGameMove(document) {
    //if no document return undefined
    if (!document) {
      return undefined;
    }

    //create and return GameMove class object
    return new GameMove(document.playerNumber, document.coord, document.date);
  }
}

//export
module.exports = GameMove;
