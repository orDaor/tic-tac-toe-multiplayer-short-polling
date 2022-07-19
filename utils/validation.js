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
    const isEmpty = !userInput.playerName || userInput.playerName.trim() === "";
    return !isEmpty;
}

//exports
module.exports = {
    isUserInputValid: isUserInputValid,
};
