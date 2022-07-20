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

  //operation was successful,
  //TODO: update the DOM with the received data and let the client actually start the game
}
