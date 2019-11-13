/**
 * @author Phuluong
 * December 27, 2015
 */

/** Exports **/
module.exports = IOBuilder;
/** Imports **/
var util = require("../app/util");
/** Modules **/
function IOBuilder() {
    this.type = function (type) {
        this.p.type = type;
        return this;
    };
    this.status = function (status) {
        this.p.status = status;
        return this;
    };
    this.header = function (name, value) {
        this.p.headers[name] = value;
        return this;
    };
    this.toEvent = function (event) {
        this.p.toEvent = event;
        return this;
    };
    this.to = function (session) {
        this.p.isToAll = false;
        if (session != null) {
            this.p.tos.push(session);
            this.p.tos = util.arrayUnique(this.p.tos);
        }
        return this;
    };
    this.toAll = function () {
        this.p.isToAll = true;
        return this;
    };
    this.toExpection = function (session) {
        this.p.isToAll = false;
        if (session != null) {
            this.p.toExpections.push(session);
        }
        return this;
    };
    this.toCriteria = function (property, value) {
        this.p.isToAll = false;
        this.p.toCriterias[property] = value;
        return this;
    };
    this.toExpectionCriteria = function (property, value) {
        this.p.isToAll = false;
        this.p.toExpectionCriterias[property] = value;
        return this;
    };
    this.build = function () {
        buildHttp.bind(this)();
        buildReceiver.bind(this)();
    };
    /** Utils **/
    function buildHttp() {
        if (this.response != null) {
            this.response.writeHead(this.p.status, this.p.headers);
        }
    }
    function buildReceiver() {
        var self = this;
        this.p.tos = [];
        // build emit event
        this.p.toEvent = (this.p.toEvent === null ? this.routeName : this.p.toEvent);
        // build received io sessions
        var socketIOSessions = this.sessionManager.getSessions("socket.io");
        if (this.p.isToAll) {
            this.p.tos = socketIOSessions;
        } else {
            if (this.session != null && this.session.type === "socket.io") {
                this.p.tos.push(this.session);
            }
            for (var property in this.p.toCriterias) {
                socketIOSessions.forEach(function (session) {
                    if (session[property] == self.p.toCriterias[property]) {
                        self.p.tos.push(session);
                    }
                });
            }
        }
        for (var property in this.p.toExpectionCriterias) {
            for (var i = 0; i < this.p.tos.length; ++i) {
                if (this.p.toExpectionCriterias[property] == this.p.tos[i][property]) {
                    this.p.tos.splice(i, 1);
                }
            }
        }
        this.p.tos = util.arrayRemoveItems(this.p.tos, this.p.toExpections);
    }
}