//#!/usr/bin/env node

"use strict";

// var http = require('http');
var https = require('https');
var url = require('url');
var fs = require('fs');
var WebSocketServer = require('websocket').server;

// Used for managing the text chat user list.

var connectionArray = [];
var nextID = Date.now();
var appendToMakeUnique = 1;

// Output logging information to console

function log(text) {
    var time = new Date();

    console.log("[" + time.toLocaleTimeString() + "] " + text);
}

// If you want to implement support for blocking specific origins, this is
// where you do it. Just return false to refuse WebSocket connections given
// the specified origin.
function originIsAllowed(origin) {
    return true; // We will accept all connections
}



// Sends a message (which is already stringified JSON) to a single
// user, given their username. We use this for the WebRTC signaling,
// and we could use it for private text messaging.
function sendToOneUser(target, msgString) {
    for (var i = 0; i < connectionArray.length; i++) {
        if (connectionArray[i].clientID === parseInt(target)) {
            log('msg is sending to id:' + target);
            connectionArray[i].sendUTF(msgString);
            break;
        }
    }
}

// Scan the list of connections and return the one for the specified
// clientID. Each login gets an ID that doesn't change during the session,
// so it can be tracked across username changes.
function getConnectionForID(id) {
    var connect = null;
    var i;

    for (i = 0; i < connectionArray.length; i++) {
        if (connectionArray[i].clientID === id) {
            connect = connectionArray[i];
            break;
        }
    }

    return connect;
}



// Load the key and certificate data to be used for our HTTPS/WSS
// server.

// Our HTTPS server does nothing but service WebSocket
// connections, so every request just returns 404. Real Web
// requests are handled by the main server on the box. If you
// want to, you can return real HTML here and serve Web content.
var httpsOptions = {
    key: fs.readFileSync("../key.pem"),
    cert: fs.readFileSync("../cert.pem")
};

var httpsServer = https.createServer(httpsOptions, function(request, response) {
    log("Received secure request for " + request.url);
    response.writeHead(404);
    response.end('you can get');
});


// Spin up the HTTPS server on the port assigned to this sample.
// This will be turned into a WebSocket port very shortly.

httpsServer.listen(6503, function() {
    log("Server is listening on port 6503");
});

// Create the WebSocket server by converting the HTTPS server into one.

var wsServer = new WebSocketServer({
    httpServer: httpsServer,
    autoAcceptConnections: false
});

// Set up a "connect" message handler on our WebSocket server. This is
// called whenever a user connects to the server's port using the
// WebSocket protocol.

wsServer.on('request', function(request) {
    // Accept the request and get a connection.

    var connection = request.accept("json", request.origin);

    // Add the new connection to our list of connections.

    log("Connection accepted from " + connection.remoteAddress + ".");
    connectionArray.push(connection);

    connection.clientID = nextID;
    nextID++;

    // Send the new client its token; it send back a "username" message to
    // tell us what username they want to use.

    var msg = {
        type: "id",
        id: connection.clientID
    };
    connection.sendUTF(JSON.stringify(msg));

    // Set up a handler for the "message" event received over WebSocket. This
    // is a message sent by a client, and may be text to share with other
    // users, a private message (text or signaling) for one user, or a command
    // to the server.

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            log("Received Message: " + message.utf8Data);

            // Process incoming data.

            var sendToClients = true;
            msg = JSON.parse(message.utf8Data);
            var connect = getConnectionForID(msg.id);

            switch (msg.type) {
                // Public, textual message
                case "message":
                    msg.name = connect.username;
                    break;

                case "username":

                    break;
            }

            if (msg.to) {
                sendToOneUser(msg.to, JSON.stringify(msg));
            }
        }
    });

    // Handle the WebSocket "close" event; this means a user has logged off
    connection.on('close', function(reason, description) {
        log(reason);
    });
});