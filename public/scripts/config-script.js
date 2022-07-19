//show error message in the form
function displayFormErrorMessage(errorMessage) {
  formErrorMessageElement.style.display = "block";
  formErrorMessageElement.querySelector("p").textContent = errorMessage;
  return;
}
