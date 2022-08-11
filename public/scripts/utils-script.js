function getEmptyBoard() {
  return [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
}

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
      errorMessage = "An error occured in the server";
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

//SVG share icon
const shareIconHtmlGlobal = `
<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M18 22q-1.25 0-2.125-.875T15 19q0-.175.025-.363.025-.187.075-.337l-7.05-4.1q-.425.375-.95.587Q6.575 15 6 15q-1.25 0-2.125-.875T3 12q0-1.25.875-2.125T6 9q.575 0 1.1.212.525.213.95.588l7.05-4.1q-.05-.15-.075-.337Q15 5.175 15 5q0-1.25.875-2.125T18 2q1.25 0 2.125.875T21 5q0 1.25-.875 2.125T18 8q-.575 0-1.1-.213-.525-.212-.95-.587L8.9 11.3q.05.15.075.337Q9 11.825 9 12t-.025.362q-.025.188-.075.338l7.05 4.1q.425-.375.95-.588Q17.425 16 18 16q1.25 0 2.125.875T21 19q0 1.25-.875 2.125T18 22Zm0-16q.425 0 .712-.287Q19 5.425 19 5t-.288-.713Q18.425 4 18 4t-.712.287Q17 4.575 17 5t.288.713Q17.575 6 18 6ZM6 13q.425 0 .713-.288Q7 12.425 7 12t-.287-.713Q6.425 11 6 11t-.713.287Q5 11.575 5 12t.287.712Q5.575 13 6 13Zm12 7q.425 0 .712-.288Q19 19.425 19 19t-.288-.712Q18.425 18 18 18t-.712.288Q17 18.575 17 19t.288.712Q17.575 20 18 20Zm0-15ZM6 12Zm12 7Z"/></svg>
`;
