//ACCESS DOM ELEMENT ---------------------------------------------------------

//CSRF token
const csrfTokenElement = document.querySelector('meta[name="csrf-token"]'); 

//form
const formElement = document.querySelector("#game-config form");

//form error message
const formErrorMessageElement = document.querySelector("#game-config .form-error-message");





//EVENT LISTENERS ---------------------------------------------------------

//for submission
formElement.addEventListener("submit", startNewGame);