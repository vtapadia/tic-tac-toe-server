import * as Hapi from "@hapi/hapi";
import * as Joi from "@hapi/joi";
import * as Nes from "@hapi/nes";
import {v4 as uuid} from 'uuid';
import {Player} from "./player";
import * as gameManager from "./manager/gameManager"
import { HealthPlugin } from 'hapi-k8s-health'
import { Mark, Point, Status } from "./types/appTypes";

const port:number = parseInt(process.env.PORT) || 3000;

const server:Hapi.Server = new Hapi.Server({
    port: port,
    host: '0.0.0.0',
    debug: { request: ['*'] }
});

server.register({
    plugin: HealthPlugin,
    options: {
      livenessProbes: {
        status: () => Promise.resolve('Yeah !')
      },
      readinessProbes: {
        ready: () => Promise.resolve('All Ready')
      }
    }
})

server.route({
    method: 'GET',
    path: '/hello',
    handler: function (request, h) {
        return { msg: 'Hello World!' };
    }
});

server.route({
    method: 'POST',
    path: '/api/game/{gameId}/player',
    handler: function (request, h) {
        let gameId = request.params.gameId;
        if (gameManager.hasGame(gameId)) {
            let game = gameManager.getGame(gameId);
            let player = request.payload as Player;
            let mark = game.addPlayer(player);
            let publishUrl = "/game/"+gameId;
            let webMessage = {
                type: "PLAYER_JOIN",
                msg: "Player " + player.name + " joined",
                game: {
                    status: game.status,
                    turn: game.turn
                }
            }
            server.publish(publishUrl, webMessage);
            return {mark: mark};
        } else {
            throw Error("Game not found");
        }
    },
    options: {
        validate: {
            payload: Joi.object({
                name: Joi.string().min(1).max(140),
                displayName: Joi.string().min(1).max(140),
                self: Joi.boolean()
            })
        }
    }
});

server.route({
    method: 'POST',
    path: '/api/game/{gameId}/move',
    handler: function (request, h) {
        let gameId = request.params.gameId;
        if (gameManager.hasGame(gameId)) {
            let game = gameManager.getGame(gameId);
            let moveInput = request.payload as MoveInput;
            if (game.isPlayersMark(moveInput.player, moveInput.mark)) {
                game.play(moveInput.mark, moveInput.point);

                let publishUrl = "/game/"+gameId;
                let webMessage = {
                    type: "MOVE",
                    game: {
                        status: game.status,
                        turn: game.turn,
                        point: moveInput.point
                    }
                }
                server.publish(publishUrl, webMessage);
                return {code: "M0000", message: "all good"};
            } else {
                return {code: "M4000", message: "not players mark"};
            }
        } else {
            return {code: "M4100", message: "Game not found"};
        }
    }
});

interface MoveInput {
    mark: Mark
    point: Point
    player: Player
}

interface SimpleResponse {
    code: string
    msg: string
}

server.route({
    method: 'GET',
    path: '/api/game/{gameId}',
    handler: function (request, h) {
        let gameId = request.params.gameId;
        console.log("Game ID requested for : %s", gameId);
        if (gameManager.hasGame(gameId)) {
            let game = gameManager.getGame(gameId);
            return {
                status: game.status,
                turn: game.turn,
                players: game.players
            };
        } else {
            throw Error("Game not found");
        }
    }
})

server.route({
    method: 'POST',
    path: '/api/game/{gameId}/replay',
    handler: function (request, h) {
        let gameId = request.params.gameId;
        if (gameManager.hasGame(gameId)) {
            let game = gameManager.getGame(gameId);
            let player = request.payload as Player;

            if (game.isPlayer(player)) {
                if (game.status == Status.FINISHED) {
                    game.replay();
                    let publishUrl = "/game/"+gameId;
                    let webMessage = {
                        type: "REPLAY",
                        game: {
                            status: game.status,
                            turn: game.turn,
                        }
                    }
                    server.publish(publishUrl, webMessage);
                    return simpleResponses.SUCCESS;
                } else {
                    return simpleResponses.GAME_STATUS_INVALID;
                }
            } else {
                return simpleResponses.PLAYER_NOT_IN_GAME;
            }
        } else {
            return simpleResponses.GAME_NOT_FOUND;
        }
    }
});
server.route({
    method: 'POST',
    path: '/api/game',
    handler: function (request, h) {
        let id = gameManager.newGame();
        
        return {gameId: id};
    }
})

let simpleResponses = {
    SUCCESS: {code: "M0000", message: "all good"},
    GAME_STATUS_INVALID: {code: "M1000", message: "Game not in correct status for replay"},
    PLAYER_NOT_IN_GAME: {code: "M4200", message: "player not belong to game"},
    GAME_NOT_FOUND: {code: "M4100", message: "Game not found"}
}

const init = async () => {
    try {
        await server.register(Nes);
        server.subscription('/game/{gameId}');
        await server.start(); // the builtin server.start method is async
    } catch (err) {
        console.error(err);
        process.exit(1);
    };

    console.log('Server running on %s :-)', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();