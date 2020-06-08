import * as Lab from '@hapi/lab';
import { expect } from '@hapi/code';
// import { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();

const lab = Lab.script();
const { describe, it, beforeEach } = lab;
export { lab };

import {Board} from "../src/model/game";


describe("basic game", () => {
  let game:Board;
  beforeEach(() => {
    game = new Board("1");
    game.print();
  });

  it("test", () => {
    console.log("all good");
  })
})