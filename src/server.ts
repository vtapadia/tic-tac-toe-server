import * as Hapi from "@hapi/hapi";
import * as Joi from "@hapi/joi";
import * as Nes from "@hapi/nes";
import {v4 as uuid} from 'uuid';
import {Player} from "./player";
import * as gameManager from "./manager/gameManager"

const port:number = parseInt(process.env.PORT) || 3000;

const server:Hapi.Server = new Hapi.Server({
    port: port,
    host: '0.0.0.0'
});


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
            let player = new Player(uuid(), request.payload.name);
            game.addPlayer(player);
            let publishUrl = "/game/"+gameId;
            server.publish(publishUrl, {msg: "Player " + player.name + " joined.", game: "ready"});
            return 
        } else {
            throw Error("Game not found");
        }
    },
    options: {
        validate: {
            payload: Joi.object({
                name: Joi.string().min(1).max(140)
            })
        }
    }
});

server.route({
    method: 'POST',
    path: '/api/game',
    handler: function (request, h) {
        // let gameId = request.params.gameId ? request.params.gameId : uuid();
        let id = gameManager.newGame();
        
        return {gameId: id};
    }
})

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