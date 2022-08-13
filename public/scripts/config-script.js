//show error message in the form
function displayFormErrorMessage(errorMessage) {
  formErrorMessageElement.style.display = "block";
  formErrorMessageElement.querySelector("p").textContent = errorMessage;
  return;
}

function hideGameConfigSection() {
  gameConfigSectionElement.style.display = "none";
}

function displayActiveGameSection() {
  activeGameSectionElement.style.display = "block";
}

function hideActiveGameSection() {
  activeGameSectionElement.style.display = "none";
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
  activeGameButtonsElement.style.display = "flex";
}

//hide active game buttons
function hideActiveGameButtons() {
  activeGameButtonsElement.style.display = "none";
}

//this function executes when clicking share button
async function shareRoomUrl(event) {
  const clickedElement = event.target; //icon

  //data to be shared
  const shareData = {
    url: clickedElement.parentElement.dataset.url,
  };

  //invoke native sharing mechanism of the device
  try {
    await navigator.share(shareData);
  } catch (error) {
    displayGameErrorMessage("Please copy the link manually");
  }
}

//generate a div element containing link to be shared with a friend
function displayLinkElement(url) {
  //div at the end of active game sectionl
  const divLinkElement = document.createElement("div");
  divLinkElement.id = "game-link";
  divLinkElement.classList.add("form-control");
  activeGameSectionElement.prepend(divLinkElement);
  //container inside the div link for containing the label and the share button
  const labelAndBtnContainerElement = document.createElement("div");
  labelAndBtnContainerElement.classList.add("game-link-control");
  divLinkElement.append(labelAndBtnContainerElement);
  //label inside div
  const labelLinkElement = document.createElement("label");
  labelLinkElement.htmlFor = "gameurl";
  labelLinkElement.textContent = "Share this link with your friend!";
  labelAndBtnContainerElement.append(labelLinkElement);
  //share button
  const shareButtonElement = document.createElement("div");
  shareButtonElement.innerHTML = shareIconHtmlGlobal;
  shareButtonElement.classList.add("game-link-button");
  shareButtonElement.dataset.url = url;
  const shareIcon = shareButtonElement.querySelector("svg");
  shareIcon.addEventListener("click", shareRoomUrl);
  labelAndBtnContainerElement.append(shareButtonElement);
  //input inside the div
  const inputLinkElement = document.createElement("input");
  inputLinkElement.id = "gameurl";
  inputLinkElement.type = "text";
  inputLinkElement.readOnly = true;
  if (!url) {
    inputLinkElement.value = "https://linkforyourfriend";
  } else {
    inputLinkElement.value = url;
  }
  divLinkElement.append(inputLinkElement);
}

function removeLinkElement() {
  const divLinkElement = document.getElementById("game-link");
  if (divLinkElement) {
    divLinkElement.parentElement.removeChild(divLinkElement);
  }
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

//show game turn info
function displayGameTurnInfo() {
  gameTurnInfo.style.display = "flex";
}

//hide game turn info
function hideGameTurnInfo() {
  gameTurnInfo.style.display = "none";
}

//show game turn paragraph
function displayGameTurnParagraph() {
  gameTurnInfo.querySelector("p").style.display = "block";
}

//hide game turn paragraph
function hideGameTurnParagraph() {
  gameTurnInfo.querySelector("p").style.display = "none";
}

//apply selected class to NON empty cells (containing a symbol)
function updateCellsSelectabilityStyle(makeEmptyCellsSelectable) {
  for (const listItem of gameBoardLiElements) {
    if (listItem.textContent) {
      listItem.classList.add("selected");
      listItem.classList.remove("not-selectable");
    } else {
      if (makeEmptyCellsSelectable) {
        listItem.classList.remove("not-selectable");
        listItem.classList.remove("selected");
      } else {
        listItem.classList.add("not-selectable");
        listItem.classList.remove("selected");
      }
    }
  }
}

//enables or disables all buttons
function setAllButtonsEnableStatus(enable) {
  const allButtons = document.querySelectorAll("button");
  for (const button of allButtons) {
    if (enable) {
      button.disabled = false;
    } else {
      //when a button is disabled: form submission is prevented and also,
      //if an event listener is added for that button, the event will never fire
      button.disabled = true;
    }
  }
}

//disable user actions
function disableUserActions() {
  updateCellsSelectabilityStyle(false);
  setAllButtonsEnableStatus(false);
}

//create and display the main page loader
function displayMainLoader() {
  const loaderElement = document.createElement("div");
  loaderElement.classList.add("loader");
  loaderElement.id = "main-loader";
  document.querySelector("main").append(loaderElement);
}

//remove the main page loader
function removeMainLoader() {
  const loaderElement = document.getElementById("main-loader");
  if (loaderElement) {
    loaderElement.parentElement.removeChild(loaderElement);
  }
}

//create and display the game turn info loader
function displayGameTurnLoader() {
  const loaderElement = document.createElement("div");
  loaderElement.classList.add("loader");
  loaderElement.id = "game-turn-loader";
  gameTurnInfo.append(loaderElement);
}

//remove the game turn info loader
function removeGameTurnLoader() {
  const loaderElement = document.getElementById("game-turn-loader");
  if (loaderElement) {
    gameTurnInfo.removeChild(loaderElement);
  }
}
