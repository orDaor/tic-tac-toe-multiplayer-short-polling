//initialize game
function initGame(responseData) {
  //display a loader for a given time and then load the received game room status on the page
  hideGameConfigSection();
  hideActiveGameSection();
  displayMainLoader();
  setTimeout(function () {
    removeMainLoader();
    initGamePlay(responseData);
  }, 500);
}

function initGamePlay(responseData) {
  //operation was successful, display gameboard and correct game info
  displayActiveGameSection();
  hideGameOverStatus();
  displayActiveGameButtons();
  displayGameTurnInfo();
  hideGameErrorMessage();

  //this player name
  playerNameGlobal = responseData.players[responseData.playerNumber - 1].name;

  //this player symbol
  playerSymbolGlobal =
    responseData.players[responseData.playerNumber - 1].symbol;

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
    //start  periodic fetch of the game status
    //(server checks if it is clients turn, in that case returns updated game status)
    sendPeriodicRequest(fetchRoomDataConfig);
  }

  //check if a private room was created for displaying the invitation link
  if (responseData.invitationUrl) {
    removeLinkElement();
    displayLinkElement(responseData.invitationUrl);
  }

  //update user action status
  if (responseData.isYourTurn) {
    //re-enable user actions on cells
    updateCellsSelectabilityStyle(true);
  } else {
    updateCellsSelectabilityStyle(false);
  }
  //re-enable user actions on buttons
  setAllButtonsEnableStatus(true);
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

  //remove div element containing the link
  removeLinkElement();
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

function startTurn(updatedRoom) {
  setGameBoardData(updatedRoom.players, updatedRoom.gameStatus);
  //check if the other player won or generated a draw after successfully making his game move
  const gameOverStatus = updatedRoom.gameOverStatus;
  if (gameOverStatus.isOver) {
    isMyTurnGlobal = false;
    displayGameOverStatus();
    setGameOverStatus(!gameOverStatus.isWinner, gameOverStatus.isDraw);
    hideActiveGameButtons();
    hideGameTurnInfo();
    updateCellsSelectabilityStyle(false);
    return;
  }

  //after the other player made his move, the game is not over yet...
  isMyTurnGlobal = true;
  setActivePlayerName(isMyTurnGlobal);
  //enable user actions on cells
  updateCellsSelectabilityStyle(true);
}

function finishTurn(updatedRoom) {
  displayGameTurnParagraph();
  removeGameTurnLoader();

  isMyTurnGlobal = false;
  setGameBoardData(updatedRoom.players, updatedRoom.gameStatus);
  //check if you won or generated a draw after successfully making your game move
  const gameOverStatus = updatedRoom.gameOverStatus;
  if (gameOverStatus.isOver) {
    displayGameOverStatus();
    setGameOverStatus(gameOverStatus.isWinner, gameOverStatus.isDraw);
    hideActiveGameButtons();
    hideGameTurnInfo();
    //disable user actions on cells
    updateCellsSelectabilityStyle(false);
    //re-enable user actions on buttons
    setAllButtonsEnableStatus(true);
    return;
  }

  //after making your move, game is not over yet...
  const otherPlayerNumber = getOtherPlayerNumber(updatedRoom.playerNumber);
  setActivePlayerName(isMyTurnGlobal, updatedRoom.players, otherPlayerNumber);
  //start  periodic fetch of the game status
  //(server checks if it is clients turn, in that case returns updated game status)
  sendPeriodicRequest(fetchRoomDataConfig);
  //update signed cells style and keep dosabled user actions on cells
  updateCellsSelectabilityStyle(false);
  //re-enable user actions on buttons
  setAllButtonsEnableStatus(true);
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

//make frontend game move
function setGameMove(symbol, coord) {
  const row = coord[0];
  const col = coord[1];
  const arrayCoord = fromMatrixCoordToArrayCoord(
    getEmptyBoard(),
    row - 1,
    col - 1
  );
  gameBoardLiElements[arrayCoord].textContent = symbol;
}

//remove frontend game move
function removeGameMove(coord) {
  const row = coord[0];
  const col = coord[1];
  const arrayCoord = fromMatrixCoordToArrayCoord(
    getEmptyBoard(),
    row - 1,
    col - 1
  );
  gameBoardLiElements[arrayCoord].textContent = "";
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
