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

const wws = new WebSocket.Server({server});

server.listen(port, () => console.log(`Running on localhost:${port}`));

wws.on("connection", (ws, req) => {
    console.log(req.connection.remoteAddress + " connected to the server\n");
    var externalIp = req.connection.remoteAddress;
    ws.send(req.connection.remoteAddress);
    ws.on("message", (data) => {
        ws.send("extern: " + externalIp + " | internal: " + data);
    });
    
})