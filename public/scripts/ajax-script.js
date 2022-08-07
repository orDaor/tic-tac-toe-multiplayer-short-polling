//send request to create a new game session
async function joinNewRoom(event) {
  //init ajax request data
  let url;
  let body;
  let response;

  //check whether event is form submission or button click
  const eventTargetElement = event.target;
  if (eventTargetElement.tagName === "FORM") {
    //prevent form from being submitted
    event.preventDefault();

    //check which button generated form submission event
    const submitterButtonElement = event.submitter;
    if (submitterButtonElement.classList.contains("join-random-room-btn")) {
      url = `/game/new`;
    } else if (submitterButtonElement.classList.contains("invite-friend-btn")) {
      url = `/game/new/friend`;
    }

    //extract form input value for the body message
    const formData = new FormData(eventTargetElement);
    body = {
      name: formData.get("playername"),
    };
  } else if (eventTargetElement.tagName === "BUTTON") {
    //check which button generated the click event
    if (eventTargetElement.classList.contains("join-random-room-btn")) {
      url = `/game/new`;
    } else if (
      eventTargetElement.submitterButtonElement.classList.contains(
        "invite-friend-btn"
      )
    ) {
      url = `/game/new/friend`;
    }

    //the player name is the current one
    body = {
      name: playerNameGlobal,
    };
  }

  //config ajax POST request to create a game session in the server for this client

  const requestConfig = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "CSRF-Token": csrfTokenElement.content,
    },
    body: JSON.stringify(body),
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

//send request to ask the server if the another player connected to the room fetch his player data.
//NOTE: responseData.otherPlayer = null if no other player connected
async function fetchOnePlayerData() {
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

//send request to ask the server if the other player made his move and fetch actual room status
//NOTE: responseData.room = null if if it is not your turn yet
async function fetchRoomData() {
  const url = "/game/room";
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
  return responseData.room;
}

//send request to make a game move in the board of the game status in the server
async function makeGameMove(event) {
  //if we do not click a board cell or it is not this client turn, nothing happens
  const clickedElement = event.target;
  if (
    clickedElement.tagName !== "LI" ||
    !isMyTurnGlobal ||
    clickedElement.textContent ||
    clickedElement.classList.contains("selected")
  ) {
    return;
  }

  //access coordinates of the clicked cell
  const row = +clickedElement.dataset.row;
  const col = +clickedElement.dataset.col;

  //config ajax POST request to create a game session in the server for this client
  let response = {};
  const gameMoveData = {
    coord: [row, col],
  };
  const url = `/game/status`;
  const requestConfig = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "CSRF-Token": csrfTokenElement.content,
    },
    body: JSON.stringify(gameMoveData),
  };

  //send ajax request
  try {
    response = await fetch(url, requestConfig);
  } catch (error) {
    const errorMessage = "Can not reach the server now, maybe try later?";
    displayGameErrorMessage(errorMessage);
    return;
  }

  //parse response data
  const responseData = await response.json();

  //response with error code
  if (!response.ok) {
    displayGameErrorMessage(responseData.message);
    return;
  }

  //response ok, update board on screen with updated received game status
  //and switch to other player turn
  finishYourTurn(responseData);
}

//send request to start a new game with the other player
async function playAgain(event) {
  //config ajax POST request to create a game session in the server for this client
  let response = {};
  const url = `/game/restart`;
  const requestConfig = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "CSRF-Token": csrfTokenElement.content,
    },
    body: JSON.stringify({}), //empty body
  };

  //send ajax request
  try {
    response = await fetch(url, requestConfig);
  } catch (error) {
    const errorMessage = "Can not reach the server now, maybe try later?";
    displayGameErrorMessage(errorMessage);
    return;
  }

  //parse response data
  const responseData = await response.json();

  //response with error code
  if (!response.ok) {
    displayGameErrorMessage(responseData.message);
    return;
  }

  //initialize the new game
  initGame(responseData);
}
