//imports built in

//inports 3rd party

//imports custom
const db = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

class Room {
  constructor(players, gameStatus, avaiable, creationDate, blocked, roomId) {
    this.players = players; //Array[1,2] of class Player
    this.gameStatus = gameStatus; //Object of class GameStatus
    this.avaiable = avaiable;
    this.creationDate = creationDate;
    this.blocked = blocked;
    if (roomId) {
      this.roomId = roomId.toString();
    }
  }
  //generate Room class obj from mongodb document
  static fromMongoDBDocumentToRoom(document) {
    //if no document return undefined
    if (!document) {
      return undefined;
    }

    return new Room(
      document.players,
      document.gameStatus,
      document.avaiable,
      document.creationDate,
      document.blocked,
      document._id
    );
  }

  //find the first available game room
  static async findAvailableAndBlock() {
    //define query filter
    const query = { available: true };

    //value to update in the room document
    const update = { $set: { blocked: true } };

    //option to return the updated document
    const options = { returnUpdatedDocument: true };

    //run query
    const document = await db
      .getDb()
      .collection("rooms")
      .findOneAndUpdate(query, update, options);

    //return Room class obj
    return Room.fromMongoDBDocumentToRoom(document); //still returns undefined if no document is found
  }

  //find a room by its id
  static async findById(roomId) {
    //define query filter
    const query = { _id: new ObjectId(roomId) };

    //run query
    const document = await db.getDb().collection("rooms").findOne(query);

    //return Room class obj
    return Room.fromMongoDBDocumentToRoom(document); //still returns undefined if no document is found
  }

  //save/update a game room in the DB: save a new one if not pointing to an existing room
  async save() {
    let result;
    if (!this.roomId) {
      const document = this.fromRoomToMongoDBDocument();
      result = await db.getDb().collection("rooms").insertOne(document);
      return result.insertedId;
    } else {
      //query filter
      const query = { _id: new ObjectId(this.roomId) };

      //update filter
      const updatedDocument = this.fromRoomToMongoDBDocument();
      const update = { $set: updatedDocument };

      //run query
      result = await db.getDb().collection("rooms").updateOne(query, update);
      return result.matchedCount;
    }
  }

  //return one specific player data
  getPlayer(playerNumber) {
    return this.players[playerNumber - 1];
  }

  //set one player data in players array: gets Player class parameter
  setPlayer(player) {
    this.players[player.number - 1] = player;
  }

  //set game status property
  setGameStatus(gameStatus) {
    this.gameStatus = gameStatus;
  }

  //check if in this room a player 1 slot is available
  isPlayer1SlotAvailable() {}

  //check if in this room a player 2 slot is available
  isPlayer2SlotAvailable() {}

  //check if in this room any a player is already using the X symbol
  isXSymbolAvailable() {}

  //check if in this room any a player is already using the O symbol
  isOSymbolAvailable() {}

  //generate mongodb document from Room class obj
  fromRoomToMongoDBDocument() {
    return {
      players: this.players,
      gameStatus: this.gameStatus,
      available: this.available,
      creationDate: this.creationDate,
      blocked: this.blocked,
    };
  }
}

//export
module.exports = Room;
