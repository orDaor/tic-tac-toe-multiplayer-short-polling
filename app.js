//imports built-in
const path = require("path");

//imports 3rd party
const express = require("express");
const expressSession = require("express-session");
const csrf = require("csurf");

//imports custom
const db = require("./data/database");
const createSessionConfig = require("./config/session-config");
const addCsrfTokenMiddleware = require("./middlewares/csrf-token-middleware");
const notFoundMidlleware = require("./middlewares/not-found-middleware");
const errorHandlingMiddleware = require("./middlewares/error-handling-middleware");
const baseRoutes = require("./routes/base-routes");
const gameConfigRoutes = require("./routes/game-config-routes");
const gameRoomRoutes = require("./routes/game-room-routes");
const gamePlayRoutes = require("./routes/game-play-routes");
const playerRoutes = require("./routes/player-routes");
const Room = require("./models/room-model");

//create express app
const app = express();

//configure EJS template engine for this app
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//static files midldeware
app.use(express.static("public"));

//urlencoded body parser
app.use(express.urlencoded({ extended: false }));

//JSON body parser
app.use(express.json());

//express-session middleware
const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

//csrf protection
app.use(csrf());

//generate CSRF token
app.use(addCsrfTokenMiddleware);

//routes registration
app.use(baseRoutes);
app.use("/game", gameConfigRoutes);
app.use("/game", gameRoomRoutes);
app.use("/game", gamePlayRoutes);
app.use("/player", playerRoutes);

//not found middleware
app.use(notFoundMidlleware);

//error handling middleware
app.use(errorHandlingMiddleware);

//init the correct port number using an environment variable ! !
let portNumber = 3000;
if (process.env.PORT) {
  portNumber = process.env.PORT;
}

//start server only after connection to database has established without errors
db.connectToDatabase()
  .then(function () {
    //start web server
    app.listen(portNumber);
    //start cyclical process for cleaning inactive rooms in the DB
    //NOTE: every 3 hour it deletes the rooms which have been inactive for more than 3 hours
    const oneHour_ms = 1000 * 60 * 60;
    Room.deleteInactiveRoomsCiclically(1 * oneHour_ms, 1 * oneHour_ms);
  })
  .catch(function (error) {
    //catch error if connection to database fails
    console.log("Failed to connect to the database");
    console.log(error);
  });
