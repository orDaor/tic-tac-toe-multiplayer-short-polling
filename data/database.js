//imports built-in
//...

//imports 3rd party
const MongoClient = require("mongodb").MongoClient;

//imports custom
//...

//this variable will give access to the mongodb database
let database;

async function connect() {
  //connect to DB server and get access to it
  const client = await MongoClient.connect("mongodb://127.0.0.1:27017");
  //get access to specific database hosted in the DB server, even if it does not exist yet (it
  //will be created with first queries)
  database = client.db("tic-tac-toe");
}

function getDb() {
  if (!database) {
    throw { message: "Database connection not established!" };
  }
  return database;
}

module.exports = {
  connectToDatabase: connect,
  getDb: getDb,
};
