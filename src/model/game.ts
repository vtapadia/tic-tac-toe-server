import {Player} from "../player";
import {Mark, Point, Status} from "../types/appTypes";

export class Board {
  status: Status = Status.INITIAL;
  players: { [key in Mark]: Player | undefined};
  board: Mark[][];
  turn: Mark = Mark.X;
  startedBy: Mark = Mark.X;
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
      let [finished, winner] = this.hasEnded(this.board);
      if (finished) {
        this.status = Status.FINISHED;
        this.winner = winner;
      }
      this.turn = this.toggle(this.turn);
      return this.board;
    } else {
      throw new Error("Invalid task")
    }
  }

  replay() {
    this.board = [...Array(3)].map(x=>Array(3).fill(undefined));
    this.status = Status.READY;
    this.startedBy = this.toggle(this.startedBy);
    this.turn = this.startedBy;
    this.winner = undefined;
  }

  isPlayer(player:Player) {
    return this.isPlayersMark(player, Mark.X) || this.isPlayersMark(player, Mark.O);
  }

  isPlayersMark(player:Player, mark:Mark) {
    return this.players[mark].name == player.name;
  }

  haveSaveValue(a:Mark | undefined, b:Mark | undefined, c:Mark | undefined) {
    return (a!= undefined && a == b && b == c);
  }

  toggle(mark: Mark):Mark {
    return (mark == Mark.X) ? Mark.O : Mark.X;
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

  addPlayer(player: Player):Mark {
    if (this.players.X) {
      if (this.players.X.name == player.name) {
        return Mark.X;
      }
    }
    if (this.players.O) {
      if (this.players.O.name == player.name) {
        return Mark.O;
      }
    }
    if (this.status == Status.READY) {
      throw new Error("Maximum players already joined");
    }
    let mark = (this.players.X) ? Mark.O : Mark.X;
    this.players[mark] = player;
    if (this.players.X && this.players.O && this.status == Status.INITIAL) {
      this.status = Status.READY;
    }
    return mark;
  }
}


