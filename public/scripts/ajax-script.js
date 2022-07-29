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

  //response with error code
  if (!response.ok || responseData.inputNotValid) {
    displayFormErrorMessage(responseData.message);
    return;
  }

  //initialize game with connected game room data
  initGame(responseData);
}

//send request to fetch other player data
async function getOnePlayerData() {
  const url = "/player/other";
  const requestConfig = {
    headers: {
      Accept: "application/json",
    },
  };
  const response = await fetch(url, requestConfig);
  //response with error code
  if (!response.ok) {
    const error = new Error("An error occured");
    error.code = response.status;
    throw error;
  }
  //response ok, check data
  const responseData = await response.json();
  return responseData.otherPlayer;
}
