//imports built in

//inports 3rd party

//imports custom
const db = require("../data/database");

class Room {
  constructor(players, gameStatus, avaiable, creationDate, blocked, roomId) {
    this.players = players; //Array[1,2] of class Player
    this.gameStatus = gameStatus; //Object of class GameStatus
    this.avaiable = avaiable;
    this.creationDate = creationDate;
    this.blocked = blocked;
    this.roomId = roomId;
  }
  //find the first available game room
  static async findAvailableAndBlock() {
    //define query filter (target firsl available game room)
    const query = {
      available: true,
    };

    //value to update in the room document
    const update = {
      $set: { blocked: true },
    };

    //option to return the updated document
    const options = {
      returnUpdatedDocument: true,
    };

    //run query
    const document = await db
      .getDb()
      .collection("rooms")
      .findOneAndUpdate(query, update, options);

    return document;
  }

  //create a new game room
  async create() {}
}

//export
module.exports = Room;
