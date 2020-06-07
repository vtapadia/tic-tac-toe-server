import * as Hapi from "@hapi/hapi";
import * as Joi from "@hapi/joi";
import * as Nes from "@hapi/nes";
import {v4 as uuid} from 'uuid';
import {Board} from "./game";
import {Player} from "./player";

const port:number = parseInt(process.env.PORT) || 3000;

const server:Hapi.Server = new Hapi.Server({
    port: port,
    host: '0.0.0.0'
});

const allGames = new Map();

server.route({
    method: 'GET',
    path: '/hello',
    handler: function (request, h) {
        return { msg: 'Hello World!' };
    }
});

server.route({
    method: 'POST',
    path: '/api/game/{gameId?}', 
    handler: function (request, h) {
        let userName = (request.payload && request.payload.userName) ? request.payload.userName : 'Guest';
        let player = new Player(uuid(), userName);
        let gameId = request.params.gameId ? request.params.gameId : uuid();
        
        if (request.params.gameId) {
            request.log('info', "Joining a game request");
            //Join game flow
            if (allGames.has(request.params.gameId)) {
                let b = allGames.get(request.params.gameId);
                b.addPlayer(player);
                let publishUrl = "/game/"+gameId;
                server.publish(publishUrl, {msg: "Player " + player.name + " joined.", game: "ready"});
            } else {
                //Game not found. 
                request.log('error', "Game ID not found");
            }
        } else {
            //Create game
            let b = new Board(gameId);
            b.addPlayer(player);
            allGames.set(b.id, b);
        }
        // const userName = request.params.gameId ? request.params.user : 'Guest';
        return {"game": gameId, "player": player};
    },
    options: {
        validate: {
            payload: Joi.object({
                userName: Joi.string().min(1).max(140)
            })
        }
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