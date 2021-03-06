
export declare interface Point {
  row: number;
  col: number;
}

export enum Mark {
  X="X",
  O="O"
};

export enum Status {
  INITIAL="INITIAL",
  READY="READY",
  FINISHED="FINISHED"
}