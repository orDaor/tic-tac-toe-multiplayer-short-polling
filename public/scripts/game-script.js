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
  const otherPlayerNumber = getOtherPlayerNumber(responseData.playerNumber);
  if (responseData.isYourTurn) {
    isMyTurnGlobal = true;
    setActivePlayerName(isMyTurnGlobal);
    makeEmptyCellsSelectable();
    //start periodic fetch of other player data
    const isOtherPlayerConnected = isPlayerConnected(
      responseData.players,
      otherPlayerNumber
    );
    if (!isOtherPlayerConnected) {
      sendPeriodicRequest(getOnePlayerDataConfig);
    }
  } else {
    isMyTurnGlobal = false;
    setActivePlayerName(
      isMyTurnGlobal,
      responseData.players,
      otherPlayerNumber
    );
    makeEmptyCellsNotSelectable();
    //start  periodic fetch of the game status
    //(server checks if it is clients turn, in that case returns updated game status)
    sendPeriodicRequest(fetchRoomDataConfig);
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

//set othe player data
function setOnePlayerData(player) {
  if (player.number === 1) {
    playerNameElement1.textContent = player.name;
  } else if (player.number === 2) {
    playerNameElement2.textContent = player.name;
  }
}

//releaze empty (not selected yet) game board elements so that they can be selected again
function makeEmptyCellsSelectable() {
  for (const listItem of gameBoardLiElements) {
    if (!listItem.textContent) {
      listItem.classList.remove("not-selectable");
      listItem.classList.remove("selected");
    }
  }
}

//freeze empty (not selected yet) game board elements so that they can NOT be selected again
function makeEmptyCellsNotSelectable() {
  for (const listItem of gameBoardLiElements) {
    if (!listItem.textContent) {
      listItem.classList.add("not-selectable");
      listItem.classList.remove("selected");
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
      } else {
        gameBoardLiElements[arrayCoord].textContent = "";
      }
    }
  }
}

function startYourTurn(updatedRoom) {
  isMyTurnGlobal = true;
  setActivePlayerName(isMyTurnGlobal);
  setGameBoardData(updatedRoom.players, updatedRoom.gameStatus);
  makeEmptyCellsSelectable();
}

function finishYourTurn(updatedRoom) {
  isMyTurnGlobal = false;
  setGameBoardData(updatedRoom.players, updatedRoom.gameStatus);
  const otherPlayerNumber = getOtherPlayerNumber(updatedRoom.playerNumber);
  setActivePlayerName(isMyTurnGlobal, updatedRoom.players, otherPlayerNumber);
  makeEmptyCellsNotSelectable();
  //start  periodic fetch of the game status
  //(server checks if it is clients turn, in that case returns updated game status)
  sendPeriodicRequest(fetchRoomDataConfig);
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
function setActivePlayerName(isMyTurn, players, activePlayerNumber) {
  if (isMyTurn) {
    activePlayerNameElement.textContent = "YOUR";
    activePlayerNameElement.nextElementSibling.textContent = "";
  } else {
    const playerName = players[activePlayerNumber - 1].name;
    if (playerName) {
      activePlayerNameElement.textContent = playerName;
    }
  }
}

//make game move
function setGameMove(playerNumber, players, coord) {
  const row = coord[0];
  const col = coord[1];
  const symbol = players[playerNumber - 1].symbol;
  const arrayCoord = fromMatrixCoordToArrayCoord(getEmptyBoard(), row, col);
  gameBoardLiElements[arrayCoord].textContent = symbol;
  gameBoardLiElements[arrayCoord].classList.add("selected");
  gameBoardLiElements[arrayCoord].classList.remove("not-selectable");
}

//remove game move
function removeGameMove(coord) {
  const row = coord[0];
  const col = coord[1];
  const arrayCoord = fromMatrixCoordToArrayCoord(getEmptyBoard(), row, col);
  gameBoardLiElements[arrayCoord].textContent = "";
  gameBoardLiElements[arrayCoord].classList.remove("selected");
  gameBoardLiElements[arrayCoord].classList.remove("not-selectable");
}

//show error message in the active game area
function displayGameErrorMessage(errorMessage) {
  gameErrorMessageElement.style.display = "block";
  gameErrorMessageElement.querySelector("p span").textContent = errorMessage;
  return;
}

//hide error message in the active game area
function hideGameErrorMessage() {
  gameErrorMessageElement.style.display = "none";
  return;
}
