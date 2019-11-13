/**
 * @author Phuluong
 * Jan 11, 2016
 */
module.exports = Memory;
var Driver = require(__dir + "/core/io/session/driver");
function Memory(config) {
    this.config = config;
    var sessionData = [];
    this.has = function (sessionId, key) {
        var retval = false;
        if (sessionData[sessionId] != null && sessionData[sessionId][key] != null) {
            retval = true;
        }
        return retval;
    };
    this.get = function (sessionId, key, defaultValue) {
        var retval = defaultValue;
        key = key.hash();
        if (sessionData[sessionId] != null && sessionData[sessionId][key] != null) {
            retval = sessionData[sessionId][key];
        }
        return retval;
    };
    this.set = function (sessionId, key, value) {
        key = key.hash();
        if (sessionData[sessionId] == null) {
            sessionData[sessionId] = {};
        }
        sessionData[sessionId][key] = value;
        return true;
    };
    this.remove = function (sessionId, key) {
        var retval = false;
        key = key.hash();
        if (sessionData[sessionId] != null && sessionData[sessionId][key] != null) {
            delete sessionData[sessionId][key];
            retval = true;
        }
        return retval;
    };
    this.pull = function (sessionId, key, defaultValue) {
        var retval = this.get(sessionId, key, defaultValue);
        this.remove(sessionId, key);
        return retval;
    };
    this.getSessions = function () {
        return {};
    };
    this.destroy = function (sessionId) {
        delete sessionData[sessionId];
    };
}
Memory.prototype = new Driver();