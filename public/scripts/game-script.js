//player 1 name is displayed on the left, player 2 name on right
function setPlayerName(playerNumber, playerName) {
  if (playerNumber === 1 && playerName) {
    playerNameElement1.textContent = playerName;
  } else if (playerNumber === 2 && playerName) {
    playerNameElement2.textContent = playerName;
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
