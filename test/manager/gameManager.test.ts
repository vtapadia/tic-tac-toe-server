import * as Lab from '@hapi/lab';
import { expect } from '@hapi/code';

const lab = Lab.script();
const { describe, it, beforeEach } = lab;
export { lab };

import * as gameManager from "../../src/manager/gameManager";

describe("Gane Manager", () => {
  it("test game ID length", () => {
    console.log("id [%s]", gameManager.newId());
    expect(gameManager.newId().length).to.equal(6);
    gameManager.setIdLength(1);
    console.log("id [%s]", gameManager.newId());
    expect(gameManager.newId().length).to.equal(1);
    gameManager.setIdLength(6);
    console.log("id [%s]", gameManager.newId());
    expect(gameManager.newId().length).to.equal(6);
  })
})

