//imports built in

//inports 3rd party

//imports custom

class GameBoardCellData {
  constructor(row, col, symbol, isYourTurn) {
    this.row = row;
    this.col = col;
    this.symbol = symbol;
    if (this.symbol) {
      this.cssClass = "selected";
    } else {
      if (isYourTurn) {
        this.cssClass = "";
      } else {
        this.cssClass = "not-selectable";
      }
    }
  }
}

//exports
module.exports = GameBoardCellData;
