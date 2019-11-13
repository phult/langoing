/**
 * @author Phuluong
 * December 27, 2015
 */

/** Exports **/
module.exports = new SocketIOConnection();
/** Imports **/
var event = require(__dir + "/core/app/event");
/** Classes **/
function SocketIOConnection() {
    this.messageListeners = [];
    this.connectionListeners = [];
    this.io = require("socket.io");
    /**
     * Add A messsage listener
     * @param {interface[onClientMessage]} listener
     * @returns {bool}
     */
    this.addMessageListener = function (namespace, listener) {
        this.messageListeners[namespace] = listener;
    };
    /**
     * Add a messsage listener
     * @param {function} listener
     * @returns {bool}
     */
    this.addConnectionListener = function (listener) {
        this.connectionListeners.push(listener);
    };
    this.sendMessage = function (toUserId, type, message, ignoredClientSession) {
        var users = this.sessionManager.getUserSessions(toUserId);
        for (var i = 0; i < users.length; i++) {
            if (ignoredClientSession != null && users[i].socket === ignoredClientSession.socket) {
                continue;
            }
            users[i].socket.emit(type, message);
        }
    };
    this.sendMessageToSession = function (session, type, message) {
        session.socket.emit(type, message);
    };
    this.sendMessageToFilteredSessions = function (filter, type, message) {
        var users = this.sessionManager.getSessions("socket.io");
        for (var i = 0; i < users.length; i++) {
            var isValidSession = true;
            for (var filterProp in filter) {
                if (!users[i].hasOwnProperty(filterProp)
                    || users[i][filterProp] != filter[filterProp]) {
                    isValidSession = false;
                    break;
                }
            }
            if (isValidSession && users[i].socket != null) {
                users[i].socket.emit(type, message);
            }
        }
    };
    this.sendMessageToFilteredInSessions = function (filter, type, message) {
        var users = this.sessionManager.getSessions("socket.io");
        for (var i = 0; i < users.length; i++) {
            var isValidSession = true;
            for (var filterProp in filter) {
                if (!users[i].hasOwnProperty(filterProp)
                    || users[i][filterProp].split(",").indexOf(filter[filterProp].toString()) == -1) {
                    isValidSession = false;
                    break;
                }
            }
            if (isValidSession && users[i].socket != null) {
                users[i].socket.emit(type, message);
            }
        }        
    };
    this.broadcastMessage = function (type, message) {
        var users = this.sessionManager.getSessions("socket.io");
        for (var i = 0; i < users.length; i++) {
            if (users[i].socket != null) {
                users[i].socket.emit(type, message);
            }
        }
    };
    this.listen = function (httpServer, sessionManager) {
        var self = this;
        this.sessionManager = sessionManager;
        socketIO = self.io(httpServer.getServer());
        socketIO.sockets.on("connection", function (socket) {
            // Initialize session
            var session = self.sessionManager.initSocketIOSession(socket);
            // Fire connection event
            onConnectionEvent.bind(self)("connection", session);
            socket.on("disconnect", function () {
                onConnectionEvent.bind(self)("disconnect", session);
            });
            // Receive a message from the client
            bindSocketMessageToListeners.bind(self)(socket, session);
        });
    };
    /** Utils **/
    function bindSocketMessageToListeners(socket, session) {
        var self = this;
        for (var namespace in self.messageListeners) {
            if (self.messageListeners[namespace] != null) {
                (function(e) {
                     socket.on(e, function(data) {
                        self.messageListeners[e](data, session);
                     });
                })(namespace);
            }
        }
    }
    function onConnectionEvent(type, session) {
        // Fire event
        event.fire("connection.socketio." + type, session);
        // Remove from sessions
        if (type === "disconnect") {
            this.sessionManager.destroy(session);
        }
        // Pass event to listeners
        for (var i = 0; i < this.connectionListeners.length; i++) {
            try {
                this.connectionListeners[i](type, session);
            } catch (exc) {
            }
        }
    }
}
