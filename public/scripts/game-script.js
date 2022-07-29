//initialize game
function initGame(responseData) {
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

//check if a specific player is connected to the room
function isPlayerConnected(players, playerNumber) {
  //extract player data
  const name = players[playerNumber - 1].name;
  const symbol = players[playerNumber - 1].symbol;
  const number = players[playerNumber - 1].number;
  //player is connected if he has ALL non-empty data values
  return name && symbol && number;
}

//player 1 data is displayed on the left, player 2 name on right
function setPlayersData(players) {
  const defaultPlayerName = "Waiting...";
  const isPlayer1Connected = isPlayerConnected(players, 1);
  const isPlayer2Connected = isPlayerConnected(players, 2);
  if (isPlayer1Connected) {
    playerNameElement1.textContent = players[0].name;
  } else {
    playerNameElement1.textContent = defaultPlayerName;
  }
  if (isPlayer2Connected) {
    playerNameElement2.textContent = players[1].name;
  } else {
    playerNameElement2.textContent = defaultPlayerName;
  }
}

//releaze empty (not selected yet) game board elements so that they can be selected again
function makeCellsSelectable() {
  for (const listItem of gameBoardLiElements) {
    if (!listItem.textContent) {
      listItem.classList.remove("not-selectable");
    }
  }
}

//freeze empty (not selected yet) game board elements so that they can NOT be selected again
function makeCellsNotSelectable() {
  for (const listItem of gameBoardLiElements) {
    if (!listItem.textContent) {
      listItem.classList.add("not-selectable");
    }
  }
}

//allign the game board status with the one in the server
function setGameBoardData(players, gameStatus) {
  const board = gameStatus.board;
  const rowsNumber = board.length;
  const columnsNumber = board[0].length;
  for (let i = 0; i < rowsNumber; i++) {
    for (j = 0; j < columnsNumber; j++) {
      const playerNumber = board[i][j];
      const arrayCoord = fromMatrixCoordToArrayCoord(board, i, j);
      if (playerNumber) {
        const symbol = players[playerNumber - 1].symbol;
        gameBoardLiElements[arrayCoord].textContent = symbol;
        gameBoardLiElements[arrayCoord].classList.add("selected");
      } else {
        gameBoardLiElements[arrayCoord].textContent = "";
      }
    }
  }
}

//find the number of the player this client is playing with
function getOtherPlayerNumber(thisPlayerNumber) {
  if (thisPlayerNumber === 1) {
    return 2;
  } else if (thisPlayerNumber === 2) {
    return 1;
  }
}

//set the name of the player who has its turn
function setActivePlayerName(yourTurn, players, activePlayerNumber) {
  if (yourTurn) {
    activePlayerName.textContent = "YOUR";
    activePlayerName.nextElementSibling.textContent = "";
  } else {
    const playerName = players[activePlayerNumber - 1].name;
    if (playerName) {
      activePlayerName.textContent = playerName;
    }
  }
}

//show error message in the active game area
function displayGameErrorMessage(errorMessage) {
  gameErrorMessageElement.style.display = "block";
  gameErrorMessageElement.querySelector("p").textContent = errorMessage;
  return;
}

//hide error message in the active game area
function hideGameErrorMessage() {
  gameErrorMessageElement.style.display = "none";
  return;
}
