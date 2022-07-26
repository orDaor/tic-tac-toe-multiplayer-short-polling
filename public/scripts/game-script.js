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
