//initialize game
function initGame(responseData) {
  //operation was successful, display gameboard and correct game info
  hideGameConfigSection();
  displayActiveGameSection();
  hideGameOverStatus();
  displayActiveGameButtons();
  displayGameTurnInfo();

  //this player name
  playerNameGlobal = responseData.players[responseData.playerNumber - 1].name;

  //set the player names using server response data
  setPlayersData(responseData.players);

  //update the game status using server response data
  setGameBoardData(responseData.players, responseData.gameStatus);

  //decide whether the client can start playing depending on whether it is its turn or not
  const otherPlayerNumber = getOtherPlayerNumber(responseData.playerNumber);

  //check whether is my turn or not
  if (responseData.isYourTurn) {
    isMyTurnGlobal = true;
    setActivePlayerName(isMyTurnGlobal);
    makeEmptyCellsSelectable();
    makeSignedCellsSelected();
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
    playerNameElement1.textContent = `${players[0].name} (${players[0].symbol})`;
  } else {
    playerNameElement1.textContent = defaultPlayerName;
  }
  if (isPlayer2Connected) {
    playerNameElement2.textContent = `${players[1].name} (${players[1].symbol})`;
  } else {
    playerNameElement2.textContent = defaultPlayerName;
  }
}

//set othe player data
function setOtherPlayerData(player) {
  if (player.number === 1) {
    playerNameElement1.textContent = `${player.name} (${player.symbol})`;
  } else if (player.number === 2) {
    playerNameElement2.textContent = `${player.name} (${player.symbol})`;
  }
  //update active player name with other player data if it is not my turn
  if (!isMyTurnGlobal) {
    activePlayerNameElement.textContent = player.name;
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

//apply selected class to NON empty cells (containing a symbol)
function makeSignedCellsSelected() {
  for (const listItem of gameBoardLiElements) {
    if (listItem.textContent) {
      listItem.classList.add("selected");
      listItem.classList.remove("not-selectable");
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
  setGameBoardData(updatedRoom.players, updatedRoom.gameStatus);
  makeEmptyCellsNotSelectable();
  makeSignedCellsSelected();
  //check if the other player won or generated a draw after successfully making his game move
  const gameOverStatus = updatedRoom.gameOverStatus;
  if (gameOverStatus.isOver) {
    isMyTurnGlobal = false;
    displayGameOverStatus();
    setGameOverStatus(!gameOverStatus.isWinner, gameOverStatus.isDraw);
    hideActiveGameButtons();
    hideGameTurnInfo();
    return;
  }

  //after the other player made his move, the game is not over yet...
  makeEmptyCellsSelectable();
  isMyTurnGlobal = true;
  setActivePlayerName(isMyTurnGlobal);
}

function finishYourTurn(updatedRoom) {
  isMyTurnGlobal = false;
  setGameBoardData(updatedRoom.players, updatedRoom.gameStatus);
  makeEmptyCellsNotSelectable();
  makeSignedCellsSelected();
  //check if you won or generated a draw after successfully making your game move
  const gameOverStatus = updatedRoom.gameOverStatus;
  if (gameOverStatus.isOver) {
    displayGameOverStatus();
    setGameOverStatus(gameOverStatus.isWinner, gameOverStatus.isDraw);
    hideActiveGameButtons();
    hideGameTurnInfo();
    return;
  }

  //after making your move, game is not over yet...
  const otherPlayerNumber = getOtherPlayerNumber(updatedRoom.playerNumber);
  setActivePlayerName(isMyTurnGlobal, updatedRoom.players, otherPlayerNumber);
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
    } else {
      activePlayerNameElement.textContent = "Other Player";
    }
    activePlayerNameElement.nextSibling.textContent = "'s";
  }
}

//show game turn info
function displayGameTurnInfo() {
  gameTurnInfo.style.display = "block";
}

//hide game turn info
function hideGameTurnInfo() {
  gameTurnInfo.style.display = "none";
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

//set winner player name
function setGameOverStatus(didIWin, isDraw) {
  const gameOverStatusH2Element = gameOverStatusElement.querySelector("h2");
  if (didIWin && !isDraw) {
    gameOverStatusH2Element.textContent = "You WON!";
  } else if (isDraw) {
    gameOverStatusH2Element.textContent = "It's a DRAW!";
  } else {
    gameOverStatusH2Element.textContent = "You LOST!";
  }
}

//show game over status
function displayGameOverStatus() {
  gameOverStatusElement.style.display = "block";
}

//hide game over status
function hideGameOverStatus() {
  gameOverStatusElement.style.display = "none";
}

//display active game buttons
function displayActiveGameButtons() {
  activeGameButtonsElement.style.display = "block";
}

//hide active game buttons
function hideActiveGameButtons() {
  activeGameButtonsElement.style.display = "none";
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
