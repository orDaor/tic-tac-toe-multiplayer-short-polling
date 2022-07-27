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