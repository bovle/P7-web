const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const app = express();

// Angular DIST output folder
app.use(express.static(path.join(__dirname, '/dist')));

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/index.html'));
});

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

const wws = new WebSocket.Server({ server });

server.listen(port, () => console.log(`Running on localhost:${port}`));

//Websocket stuff

const colors = ["red", "green", "blue", "white", "black", "yellow", "orange", "purple"];
const maxPlayers = 7;

var games = {};

wws.on("connection", (ws, req) => {
    console.log(req.connection.remoteAddress + " connected to the server\n");
    ws.on("message", (data) => {
        var message = JSON.parse(data);
        if (message && message.type) {
            switch (message.type) {
                case "host_connection":
                    var code = "";
                    do {
                        var char1 = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                        var char2 = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                        var char3 = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                        var char4 = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                        code = char1 + char2 + char3 + char4;
                    } while (games[code]);
                    games[code] = { host: ws, clients: [], count: 0 };
                     
                    ws.send(JSON.stringify({type: "code", payload: code}));
                    break;

                case "client_connection":
                    console.log(message);
                    var game = games[message.payload];
                    if(game){
                        if(game.count > maxPlayers){
                            ws.send("game is full");
                        }else{
                            var index = game.count;
                            game.clients[index] = ws;
                            game.count++;
                            var host = games[message.payload].host;
                            host.send(JSON.stringify({type: "player_joined", payload: index}));
                        }
                    }else{
                        ws.send("no game with code:" + message.payload);
                    }
                    break;
                
                case "host_to_client":
                    console.log(message);
                    var data = JSON.parse(message.payload);
                    var game = games[data.code];
                    var client = game.clients[data.clientColor];
                    client.send(JSON.stringify({type: "message_from_host", payload: data.message}));
                    break;
                default:
                    break;
            }
        }
    });

})