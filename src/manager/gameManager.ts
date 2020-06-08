import { Board } from "../model/game";

//The length of the Game ID
let idLength = 6;
export function setIdLength(l: number) {
  //Enabled for testing.
  idLength = l;
}

export const allGames = new Map();

export function newGame():string {
  let id:string = newId();
  allGames.set(id, new Board(id));
  return id; 
}

export const hasGame = (id:string) => allGames.has(id);
export const getGame = (id:string) => allGames.get(id);

//Iterative method to find the next game ID
export function newId() {
  let id = (Math.floor(Math.random()*Math.pow(10, idLength))).toString().padStart(idLength, "0");
  return (allGames.has(id)) ? newId() : id; 
}