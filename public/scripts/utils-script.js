function fromMatrixCoordToArrayCoord(matrix, rowCoord, colCoord) {
  //calculate rows and columns number
  const rowsNumber = matrix.length;
  const columnsNumber = matrix[0].length;

  //check if target matrix coord exceed actual ones
  const inputsOk =
    rowCoord <= rowsNumber - 1 &&
    colCoord <= columnsNumber - 1 &&
    rowCoord >= 0 &&
    colCoord >= 0;

  if (!inputsOk) {
    return undefined;
  }

  //transform [row,col] coordinates into array coordinates [arrayCoord]
  let arrayCoord = 0;
  for (let i = 0; i < rowsNumber; i++) {
    for (let j = 0; j < columnsNumber; j++) {
      if (i === rowCoord && j === colCoord) {
        return arrayCoord;
      }
      arrayCoord++;
    }
  }
}

//class defining period request configuration object
class PeriodicRequestConfig {
  constructor(send, delay, stop, resolve, handleError) {
    this.send = send; //function sending the request
    this.delay = delay; //frequency with which ajax request is sent in [mms]
    this.stop = stop; //flag stopping sending the request
    this.resolve = resolve; //function executed at stopping
    this.handleError = handleError; //function for displaying an error message
  }
}

//send periodic request with fixed time
//NOTE: config --> object of class PeriodicRequestConfig
async function sendPeriodicRequest(config) {
  //stop periodic request condition
  if (config.stop) {
    config.stop = false;
    //debugging
    console.log("Periodic request stopped!");
    //stop function execution
    return;
  }

  //debugging
  console.log(`Periodic request sent`);
  //send request
  let responseData;
  try {
    responseData = await config.send();
  } catch (error) {
    //request generates error whether server responses with error code or because of a technical problem (connection issues).
    //An error will be displayed ons creen with the message received by the server in case or error code received.
    //Instead a custom error message is displayed because of a technical problem.
    let errorMessage;
    if (error.code) {
      errorMessage = "There was an error in the server";
    } else {
      errorMessage = "We are expiriencing some connection problems";
    }
    config.handleError(errorMessage);
    //keep sending the periodic request even if there was an error...
  }

  //perdiodic request stops only is response is not falsy
  if (responseData) {
    config.stop = true;
    //function to execute at stopping
    config.resolve(responseData);
  }

  //start timer: when it expires another request is sent after delay
  //because this function is called again
  const callBack = function () {
    sendPeriodicRequest(config);
  };
  setTimeout(callBack, config.delay);

  return;
}
