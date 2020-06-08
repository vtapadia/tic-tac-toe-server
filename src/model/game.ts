import {Player} from "../player";
import {Mark, Point, Status} from "../types/appTypes";

export class Board {
  players: { [key in Mark]: Player | undefined};
  board: Mark[][];
  turn: Mark = Mark.X;
  status: Status = Status.INITIAL;
  winner: Mark | undefined = undefined;

  constructor(readonly id:string){
    this.board = [...Array(3)].map(x=>Array(3).fill(undefined));
    this.players = {
      [Mark.X]: undefined,
      [Mark.O]: undefined
    };
  }

  play(m:Mark, point:Point):Mark[][] {
    if (this.board[point.row][point.col] == undefined) {
      this.board[point.row][point.col] = m;
      return this.board;
    } else {
      throw new Error("Invalid task")
    }
  }

  haveSaveValue(a:Mark | undefined, b:Mark | undefined, c:Mark | undefined) {
    return (a!= undefined && a == b && b == c);
  }

  //Resets the board
  // reset() {
  //   //Swap plavers
  //   let swapPlayer = this.playerO;
  //   this.playerO = this.playerX;
  //   this.playerX = swapPlayer;

  //   //Reset the board
  //   this.board = [[,,],[,,],[,,]];
  //   // for (let i = 0; i < 3; i++) {
  //   //   for (let j = 0; j < 3; j++) {
  //   //     this.board[i][j] = undefined;
  //   //   }
  //   // }
  // }
  print() {
    console.log(this.board);
  }


hasEnded(board: Mark[][]):[boolean, Mark | undefined] {
  for (let i=0; i < 3; i++) {
    if (board[i][0] == board[i][1] && 
      board[i][1] == board[i][2] &&
      board[i][0]) {
        return [true, board[i][0]];
      }
      if (board[0][i] == board[1][i] && 
        board[1][i] == board[2][i] &&
        board[0][i]) {
          return [true, board[0][i]];
      }
  }
  if (board[0][0] == board[1][1] && 
    board[1][1] == board[2][2] &&
    board[0][0]) {
      return [true,board[0][0]];
  }
  if (board[2][0] == board[1][1] && 
    board[1][1] == board[0][2] &&
    board[2][0]) {
      return [true, board[2][0]];
  }
  if (this.getEmptyPlaces(board).length == 0) {
    return [true, undefined];
  }
  return [false, undefined];
}

getEmptyPlaces(board: Mark[][]):Point[] {
  let empty:Point[] = Array.of();
  for (let i=0; i < 3; i++) {
    for (let j=0; j<3; j++) {
      if (board[i][j] == undefined) {
        empty.push({row: i, col: j});
      }
    }
  }
  return empty;
}

  addPlayer(player: Player) {
    if (this.players.X && this.players.O) {
      throw new Error("Maximum players already joined");
    }
    let mark = (this.players.X) ? Mark.O : Mark.X;
    this.players[mark] = player;
  }
}


