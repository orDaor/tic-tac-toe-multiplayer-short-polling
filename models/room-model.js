//imports built in

//inports 3rd party

//imports custom
const db = require("../data/database");
const gameUtil = require("../utils/game-util");
const ObjectId = require("mongodb").ObjectId;
const Player = require("../models/player-model");
const GameMove = require("../models/game-move-model");
const GameStatus = require("../models/game-status-model");

class Room {
  constructor(players, gameStatus, creationDate, blocked, roomId) {
    this.players = players; //Array[1,2] of class Player
    this.gameStatus = gameStatus; //Object of class GameStatus
    this.available = this.isAvailable();

    if (creationDate) {
      this.creationDate = creationDate;
    } else {
      this.creationDate = new Date(); //now
    }

    this.blocked = blocked;

    if (roomId) {
      this.roomId = roomId.toString();
    }
  }

  //create a new Room object, initialized for a player requesting a new game session
  //(this is used in case no available room in the DB was found
  static createEmpty() {
    //init the values of the new room
    const emptyBoard = gameUtil.getEmptyBoard();
    const emptyGameMove = new GameMove(0, [null, null], "null");
    const gameStatus = new GameStatus(emptyBoard, emptyGameMove);
    const player1 = new Player("", "", 0);
    const player2 = new Player("", "", 0);
    //create and return the new room
    return new Room(
      [player1, player2],
      gameStatus,
      null, //date = now
      false //not blocked
      //no room id
    );
  }

  //generate Room class obj from mongodb document
  static fromMongoDBDocumentToRoom(document) {
    //if no document return undefined
    if (!document) {
      return undefined;
    }

    //transform players of the document as Player class objects
    const player1 = Player.fromMongoDBDocumentToPlayer(document.players[0]);
    const player2 = Player.fromMongoDBDocumentToPlayer(document.players[1]);

    //transform game status of the document as GameStatus class object
    const gameStatus = GameStatus.fromMongoDBDocumentToGameStatus(
      document.gameStatus
    );

    //create and return Room class object
    return new Room(
      [player1, player2],
      gameStatus,
      document.creationDate,
      document.blocked,
      document._id
    );
  }

  //find the first available game room
  static async findAvailableAndBlock() {
    //define query filter
    const query = {
      available: true,
      blocked: false,
    };

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
    return Room.fromMongoDBDocumentToRoom(document.value); //still returns undefined if no document is found
  }

  //find a room by its id
  static async findById(roomId) {
    //define query filter
    const query = { _id: new ObjectId(roomId) };

    //run query
    const document = await db.getDb().collection("rooms").findOne(query);

    //no room found
    if (!document) {
      throw new Error("No room found");
    }
    //return Room class obj
    return Room.fromMongoDBDocumentToRoom(document); //still returns undefined if no document is found
  }

  //check if room is available (at leas 1 player slot is available)
  isAvailable() {
    //update room availability status
    if (!this.getAvailablePlayerSlot()) {
      return false;
    } else {
      return true;
    }
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
  addPlayer(player) {
    //add a player in the room
    this.players[player.number - 1] = player;
    //update room availability status
    this.available = this.isAvailable();
  }

  //delete player data in a specific player slot
  removePlayer(playerNumber) {
    //delete player data
    this.players[playerNumber - 1].name = "";
    this.players[playerNumber - 1].symbol = "";
    this.players[playerNumber - 1].number = 0;
    //now room is available for another player to connect
    this.available = true;
  }

  //check if one player 1 or 2 is connected to the room
  isPlayerSlotAvailable(playerNumber) {
    //extract player data
    const name = this.players[playerNumber - 1].name;
    const symbol = this.players[playerNumber - 1].symbol;
    const number = this.players[playerNumber - 1].number;
    //player is connected if he has ALL non-empty data values
    return !name && !symbol && !number;
  }

  //check if in this room a player 1 or 2 slot is available, and return it.
  //If both slots are available, return player 1 as default
  getAvailablePlayerSlot() {
    //check player slots availability
    const isPlayer1SlotAvailable = this.isPlayerSlotAvailable(1);
    const isPlayer2SlotAvailable = this.isPlayerSlotAvailable(2);
    //
    if (isPlayer1SlotAvailable && isPlayer2SlotAvailable) {
      return 1;
    } else if (isPlayer1SlotAvailable && !isPlayer2SlotAvailable) {
      return 1;
    } else if (!isPlayer1SlotAvailable && isPlayer2SlotAvailable) {
      return 2;
    } else {
      return undefined;
    }
  }

  //returnes the symbol not used by players in the room yet.
  //If both symbols are available, return X as default
  getAvailableGameSymbol() {
    //extract player symbols
    const player1Symbol = this.players[0].symbol;
    const player2Symbol = this.players[1].symbol;
    //find symbol not used yet (availabele)
    if (!player1Symbol && !player2Symbol) {
      return "X";
    } else if (player1Symbol && !player2Symbol) {
      if (player1Symbol === "X") {
        return "O";
      } else if (player1Symbol === "O") {
        return "X";
      }
    } else if (!player1Symbol && player2Symbol) {
      if (player2Symbol === "X") {
        return "O";
      } else if (player2Symbol === "O") {
        return "X";
      }
    } else {
      return undefined;
    }
  }

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


