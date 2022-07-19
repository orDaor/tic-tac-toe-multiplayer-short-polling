//ACCESS DOM ELEMENT ---------------------------------------------------------

//access form element
const formElement = document.querySelector("#game-config form");
const formErrorMessageElement = document.querySelector("#game-config .form-error-message");





//EVENT LISTENERS ---------------------------------------------------------

//submit event listener
formElement.addEventListener("submit", startNewGame);