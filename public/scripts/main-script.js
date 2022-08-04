//ACCESS DOM ELEMENT ---------------------------------------------------------

//CSRF token
const csrfTokenElement = document.querySelector('meta[name="csrf-token"]');

//form
const formElement = document.querySelector("#game-config form");

//form error message
const formErrorMessageElement = document.querySelector(
  "#game-config .form-error-message"
);

//game config for choosing the name
const gameConfigSectionElement = document.getElementById("game-config");

//game over status
const gameOverStatusElement = document.getElementById("game-over");

//game over buttons
const playAgainButtonElement = document.querySelector("#play-again-btn");
const joinNewRoomButtonElement = document.querySelector("#join-new-room-btn");

//active game board
const activeGameSectionElement = document.getElementById("active-game");

//players name
const playerNameElement1 = document.getElementById("player1");
const playerNameElement2 = document.getElementById("player2");

//game board
const gameBoardElement = document.getElementById("game-board");

//game board cells
const gameBoardLiElements = document.querySelectorAll("#game-board li");

//game error message
const gameErrorMessageElement = document.querySelector(
  "#active-game .game-error-message"
);

//game turn info
const gameTurnInfo = document.getElementById("game-turn");

//name of the player who has his turn
const activePlayerNameElement = document.getElementById("active-player-name");

//GLOBAL FLAGS---------------------------------------------------------
let isMyTurnGlobal = false;

//PERIODIC REQUEST CONFIG OBJECTS ---------------------------------------------------------
//ask the server if another player connected to the room and fetch the data of that player in that case
const getOnePlayerDataConfig = new PeriodicRequestConfig(
  fetchOnePlayerData, //send
  2000, // delay [ms]
  false, //stop
  setOtherPlayerData, //resolve
  displayGameErrorMessage //handeError
);

//ask the server if the other player made his move and fetch actual room status in that case
const fetchRoomDataConfig = new PeriodicRequestConfig(
  fetchRoomData, //send
  2000, // delay [ms]
  false, //stop
  startYourTurn, //resolve
  displayGameErrorMessage //handeError
);

//EVENT LISTENERS ---------------------------------------------------------

//for submission for joining a new room
formElement.addEventListener("submit", joinNewRoom);

//join a new room after game over
playAgainButtonElement.addEventListener("click", playAgain);

//play again with the other player after game over
joinNewRoomButtonElement.addEventListener("click", joinNewRoom);

//hide game error message by clicking on the "X" button
gameErrorMessageElement
  .querySelector("button")
  .addEventListener("click", hideGameErrorMessage);

//make a game move
gameBoardElement.addEventListener("click", makeGameMove);

//DEBUGGING  ---------------------------------------------------------
//...
