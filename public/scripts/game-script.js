//player 1 name is displayed on the left, player 2 name on right
function setPlayersData(players) {
  const player1Name = players[0].name;
  const player2Name = players[1].name;
  if (player1Name) {
    playerNameElement1.textContent = player1Name;
  }
  if (player2Name) {
    playerNameElement2.textContent = player2Name;
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
      if (playerNumber) {
        const symbol = players[playerNumber - 1].symbol;
        const arrayCoord = fromMatrixCoordToArrayCoord(board, i, j);
        gameBoardLiElements[arrayCoord].textContent = symbol;
        gameBoardLiElements[arrayCoord].classList.add("selected");
      }
    }
  }
}

//find the number of the player this client is playing with
function getOtherPlayerNumber(playerNumber) {
  if (playerNumber === 1) {
    return 2;
  } else if (playerNumber === 2) {
    return 1;
  }
}

//set the name of the player who has its turn
function setActivePlayerName(yourTurn, players, playerNumber) {
  if (yourTurn) {
    activePlayerName.textContent = "YOUR";
    activePlayerName.nextElementSibling.textContent = "";
  } else {
    const playerName = players[playerNumber - 1].name;
    if (playerName) {
      activePlayerName.textContent = playerName;
    }
  }
}
