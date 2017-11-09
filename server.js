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

server.listen(port);

//Websocket stuff

const colors = ["none", "red", "green", "blue", "white", "black", "yellow", "orange", "purple"];
const maxPlayers = 8;

var games = {};

wws.on("connection", (ws, req) => {
    console.log(req.connection.remoteAddress + " connected to the server\n");
    var code = "";
    var index;
    ws.on("message", (data) => {
        var message = JSON.parse(data);
        if (message && message.options && message.options.type) {
            console.log(message);
            switch (message.options.type) {
                case "host_connection":
                    do {
                        var char1 = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                        var char2 = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                        var char3 = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                        var char4 = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                        code = char1 + char2 + char3 + char4;
                    } while (games[code]);
                    games[code] = { host: ws, clients: [], count: 0 };
                     
                    ws.send(JSON.stringify({options: { type:"code", code: code }}));
                    break;

                case "client_connection":
                    code = message.options.code;
                    var game = games[code];
                    if(game){
                        if(game.count >= maxPlayers){
                            ws.send(JSON.stringify({options: { type: "error" }, package: "game is full"}));
                        }else{
                            game.count++;
                            index = game.count;
                            game.clients[index] = ws;
                            var host = games[code].host;
                            host.send(JSON.stringify({options: { type: "client_joined", color: index}}));
                            ws.send(JSON.stringify({options: { type: "color_change", color: index}}))
                        }
                    }else{
                        ws.send(JSON.stringify({options: { type: "error" }, package: "no game with code:" + code}));
                    }
                    break;
                
                case "host_to_client":
                    var options = message.options;
                    var game = games[options.code];
                    if(game){
                        var client = game.clients[options.color];
                        if(client){
                            client.send(JSON.stringify({options: { type: "package_from_host", packageType: options.packageType }, package: message.package}));
                            break;
                        }else
                            ws.send(JSON.stringify({options: { type: "error" }, package: "no client with color:" + options.color}));
                    }else
                        ws.send(JSON.stringify({options: { type: "error" }, package: "no game with code:" + options.code}));
                    break;

                case "client_to_host":
                    var options = message.options;
                    var game = games[options.code];
                    if(game){
                        var host = game.host;
                        host.send(JSON.stringify({options: { type: "package_from_client", color: options.color, packageType: options.packageType }, package: message.package}));

                    }else{
                        ws.send(JSON.stringify({options: { type: "error" }, package: "no game with code:" + code}));
                    }
                    break;
                default:
                    break;
            }
        }
    });

    ws.on("close", (data) => {
        if(code){
            var game = games[code];
            if(game){
                if(index){
                    game.clients[index] = null;
                    var host = game.host;
                    host.send(JSON.stringify({options: {type: "client_disconnected", color: index}}));
                }else{
                    game.clients.forEach(function(client){
                        if(client)
                            client.send(JSON.stringify({options: {type: "host_disconnected"}}));
                    });
                    games[code] = null;
                }
            }
        }
    });

})