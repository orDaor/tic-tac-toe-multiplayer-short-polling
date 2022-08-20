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
  const userName = userInput.name.trim();
  const lengthOk = userName.length >= 3 && userName.length <= 15;
  return lengthOk;
}

//exports
module.exports = {
  isUserInputValid: isUserInputValid,
};
