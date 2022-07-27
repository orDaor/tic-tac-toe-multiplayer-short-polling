//send request to create a new game session
async function startNewGame(event) {
  //prevent form from being submitted
  event.preventDefault();

  //extract form input value
  const formData = new FormData(event.target);
  const playerData = {
    name: formData.get("playername"),
  };

  //config ajax POST request to create a game session in the server for this client
  let response = {};
  const url = `/game/new`;
  const requestConfig = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "CSRF-Token": csrfTokenElement.content,
    },
    body: JSON.stringify(playerData),
  };

  //send ajax request
  try {
    response = await fetch(url, requestConfig);
  } catch (error) {
    const errorMessage = "Can not reach the server now, maybe try later?";
    displayFormErrorMessage(errorMessage);
    return;
  }

  //parse response data
  const responseData = await response.json();
  console.log(responseData);

  //response with error code
  if (!response.ok || responseData.inputNotValid) {
    displayFormErrorMessage(responseData.message);
    return;
  }

  //TODO: encapsulate the code below in a new function "initGame(responseData)"

  //operation was successful, display gameboard and correct game info
  hideGameConfigSection();
  displayActiveGameSection();

  //set the player names using server response data
  setPlayersData(responseData.players);

  //update the game status using server response data
  setGameBoardData(responseData.players, responseData.gameStatus);

  //decide whether the client can start playing depending on whether it is its turn or not
  if (responseData.isYourTurn) {
    setActivePlayerName(true);
    makeCellsSelectable();
    //start periodic fetch of other player data...
  } else {
    const otherPlayerNumber = getOtherPlayerNumber(responseData.playerNumber);
    setActivePlayerName(false, responseData.players, otherPlayerNumber);
    makeCellsNotSelectable();
    //start  periodic fetch of the game status...
  }
}
