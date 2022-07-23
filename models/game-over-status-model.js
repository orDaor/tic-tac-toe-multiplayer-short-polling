//imports built in

//inports 3rd party

//imports custom

class GameOverStatus {
    constructor(isOver, isWinner, winnerCase, winnerPlayerNumber) {
      this.isOver = isOver;
      this.isWinner = !!isWinner && this.isOver;
      this.isDraw = !this.isWinner && this.isOver;
      if (this.isOver && this.isWinner) {
        this.winnerCase = winnerCase;
        this.winnerPlayerNumber = winnerPlayerNumber;
      } else {
        this.winnerCase = 0;
        this.winnerPlayerNumber = 0;
      }
    }
  }
  
  //export
  module.exports = GameOverStatus;