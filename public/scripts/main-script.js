//ACCESS DOM ELEMENT ---------------------------------------------------------

//CSRF token
const csrfTokenElement = document.querySelector('meta[name="csrf-token"]'); 

//form
const formElement = document.querySelector("#game-config form");

//form error message
const formErrorMessageElement = document.querySelector("#game-config .form-error-message");

//game config for choosing the name
const gameConfigSectionElement = document.getElementById("game-config");

//active game board
const activeGameSectionElement = document.getElementById("active-game");


//EVENT LISTENERS ---------------------------------------------------------

//for submission
formElement.addEventListener("submit", startNewGame);