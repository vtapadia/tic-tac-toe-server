export class Board {
  playerX: Player;
  playerO: Player;
  board: Mark[][];
  inProgress: boolean = true;
  
  constructor(readonly id:number){
    this.board = [[,,],[,,],[,,]];
  }

  play(m:Mark, c:Column):Mark[][] {
    if (this.board[c.x][c.y] == undefined) {
      this.board[c.x][c.y] = m;
      return this.board;
    } else {
      throw new Error("Invalid task")
    }
  }

  isFinished():boolean {
    let b = this.board;
    for (let i=0; this.inProgress && i<3; i++) {
      if (b[i][0] != undefined && b[i][0]==b[i][1] && b[i][1] == b[i][2]) {
        this.inProgress = false;
      }
      if (b[0][i] != undefined && b[0][i]==b[1][i] && b[1][i] == b[2][i]) {
        this.inProgress = false;
      }
    }
    if (b[0][0] != undefined && b[0][0]==b[1][1] && b[1][1] == b[2][2]) {
      this.inProgress = false;
    }
    if (b[0][2] != undefined && b[0][2]==b[1][1] && b[1][1] == b[2][0]) {
      this.inProgress = false;
    }
    return this.inProgress;
  }

  //Resets the board
  reset() {
    //Swap plavers
    let swapPlayer = this.playerO;
    this.playerO = this.playerX;
    this.playerX = swapPlayer;

    //Reset the board
    this.board = [[,,],[,,],[,,]];
    // for (let i = 0; i < 3; i++) {
    //   for (let j = 0; j < 3; j++) {
    //     this.board[i][j] = undefined;
    //   }
    // }
  }
  print() {
    console.log(this.board);
  }
  addPlayer(player: Player) {
    if (this.playerX == undefined) {
      this.playerX = player;
    } else if (this.playerO == undefined) {
      this.playerO = player;
    } else {
      throw new Error("Maximum players reached for this game");
    }
  }
}

interface iColumun {
  x: number;
  y: number;
}

class Column implements iColumun {
  constructor(readonly x:number, readonly y:number){}
}

enum Mark {
  X,O
};

class Player {
  constructor(readonly name:String){}
}