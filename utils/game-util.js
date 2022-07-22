//imports built in

//inports 3rd party

//imports custom

function getWinnerCases() {
  return [
    [0, 1, 2], // case 1
    [2, 5, 8], // case 2
    [8, 7, 6], // case 3
    [6, 3, 0], // case 4
    [1, 4, 7], // case 5
    [3, 4, 5], // case 6
    [2, 4, 6], // case 7
    [0, 4, 8], // case 8
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

function fromArrayCoordToMatrixCoord(matrix, arrayCoord) {
  //calculate rows and columns number
  const rowsNumber = matrix.length;
  const columnsNumber = matrix[0].length;

  //check if target matrix coord exceed actual ones
  const totalMatrixCells = rowsNumber * columnsNumber;
  const inputsOk = arrayCoord < totalMatrixCells && arrayCoord >= 0;

  if (!inputsOk) {
    return undefined;
  }

  //transform [array] coordinates into matrix coordinates [row,col]
  let counter = 0;
  for (let i = 0; i < rowsNumber; i++) {
    for (let j = 0; j < columnsNumber; j++) {
      if (counter === arrayCoord) {
        return [i, j];
      }
      counter++;
    }
  }
}

function isWinnerCaseOccured(matrix, winnerCase) {
  //1st matrix cell coordinates for this winner
  const matrixCellCoord1 = fromArrayCoordToMatrixCoord(matrix, winnerCase[0]);
  const matrixCellRow1 = matrixCellCoord1[0];
  const matrixCellCol1 = matrixCellCoord1[1];

  //2nd matrix cell coordinates for this winner
  const matrixCellCoord2 = fromArrayCoordToMatrixCoord(matrix, winnerCase[1]);
  const matrixCellRow2 = matrixCellCoord2[0];
  const matrixCellCol2 = matrixCellCoord2[1];

  //3rd matrix cell coordinates for this winner
  const matrixCellCoord3 = fromArrayCoordToMatrixCoord(matrix, winnerCase[2]);
  const matrixCellRow3 = matrixCellCoord3[0];
  const matrixCellCol3 = matrixCellCoord3[1];

  //get matrix cells actual content
  const matrixCell1 = matrix[matrixCellRow1][matrixCellCol1];
  const matrixCell2 = matrix[matrixCellRow2][matrixCellCol2];
  const matrixCell3 = matrix[matrixCellRow3][matrixCellCol3];

  //check if winner case occured
  return (
    matrixCell1 === matrixCell2 &&
    matrixCell2 === matrixCell3 &&
    (matrixCell1 === 1 || matrixCell1 === 2)
  );
}

//export
module.exports = {
  getWinnerCases: getWinnerCases,
  fromMatrixCoordToArrayCoord: fromMatrixCoordToArrayCoord,
  fromArrayCoordToMatrixCoord: fromArrayCoordToMatrixCoord,
  isWinnerCaseOccured: isWinnerCaseOccured,
};
