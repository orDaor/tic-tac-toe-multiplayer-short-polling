//imports built in
//...

//imports 3rd party
const mongoDbStore = require("connect-mongodb-session");
const expressSession = require("express-session");

//imports custom
//...

//create a session store for the session package passed as parameter
function createSessionStore() {
  const MongoDBStore = mongoDbStore(expressSession);
  const store = new MongoDBStore({
    uri: "mongodb://127.0.0.1:27017",
    databaseName: "tic-tac-toe",
    collection: "sessions",
  });
  return store;
}

//create configuration data for the session package
function createSessionConfig() {
  return {
    secret: "super-secret",
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 2 * 1000 * 60 * 60 * 24, //2 days in milliseconds
    },
  };
}

//export
module.exports = createSessionConfig;
