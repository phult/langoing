/**
 * @author Phuluong
 * May 13, 2015 5:02:26 PM
 */

/** Imports **/
var http = require("http");
var https = require("https");
var fs = require("fs");
var config = require(__dir + "/core/app/config");
/** Exports **/
module.exports = new HttpServer();
/** Modules **/
function HttpServer() {
    var self = this;
    var listeners = [];
    var sslMode = config.get("app.sslMode");
    this.server = http.createServer(function (req, res) {
        onRequest(this, req, res);
    });
    if (sslMode.enable) {
        this.sslServer = https.createServer({
            key: fs.readFileSync(sslMode.options.key),
            cert: fs.readFileSync(sslMode.options.cert)
        }, function (req, res) {
            onRequest(this, req, res);
        });
    }
    /**
     * Start listening connections
     * @param {int} port
     */
    this.listen = function (port, sessionManager) {
        this.sessionManager = sessionManager;
        this.server.listen(port);
        if (sslMode.enable) {
            this.sslServer.listen(sslMode.port);
        }
    };
    this.getServer = function () {
        return this.server;
    };
    this.getSslServer = function () {
        return this.sslServer;
    };
    /**
     * Add a connection listener
     * @param {Object} listener
     * @returns {Boolean}
     */
    this.addConnectionListener = function (listener) {
        var retval = false;
        var isExisted = false;
        for (var i = 0; i < listeners.length; i++) {
            if (listeners[i] == listener) {
                isExisted = true;
                break;
            }
        }
        if (!isExisted) {
            listeners.push(listener);
            retval = true;
        }
        return retval;
    };
    /**
     * Remove a connection listener
     * @param {Object} listener Object contain onConnection(req, res);
     * @returns {Boolean}
     */
    this.removeConnectionListener = function (listener) {
        var retval = false;
        var itemIdx = -1;
        for (var i = 0; i < listeners.length; i++) {
            if (listeners[i] == listener) {
                itemIdx = i;
                break;
            }
        }
        if (itemIdx > -1) {
            listeners.splice(itemIdx, 1);
            retval = true;
        }
        return retval;
    };
    function onRequest(server, req, res) {
        req.session = self.sessionManager.initHTTPSession(req, res);
        if (config.get("app.requestTimeout", -1) != -1) {
            req.setTimeout(parseInt(config.get("app.requestTimeout")), function () {
                server.abort();
            });
        }
        for (var i = 0; i < listeners.length; i++) {
            listeners[i].onConnection(req, res);
        }
    }
}
