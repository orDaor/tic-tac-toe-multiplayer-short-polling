//imports: built in
//...

//imports: 3rd party
//...

//imports: custom
//...

function isUserInputValid(userInput) {
  if (!userInput) {
    return false;
  }
  const isEmpty = !userInput.name || userInput.name.trim() === "";
  const lengthOk = userInput.name.length >= 3;
  return lengthOk && !isEmpty;
}

//exports
module.exports = {
  isUserInputValid: isUserInputValid,
};
