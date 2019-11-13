/**
 * @author Phuluong
 * Jan 11, 2016
 */
/** Exports **/
module.exports = Driver;
/** Modules **/
function Driver(config) {
    this.has = function (sessionId, key) {
        throw new Error("not implemented");
    };
    this.get = function (sessionId, key, defaultValue) {
        throw new Error("not implemented");
    };
    this.set = function (sessionId, key, value) {
        throw new Error("not implemented");
    };
    this.remove = function (sessionId, key) {
        throw new Error("not implemented");
    };
    this.pull = function (sessionId, key, defaultvalue) {
        throw new Error("not implemented");
    };
    this.getSessions = function () {
        throw new Error("not implemented");
    };
    this.destroy = function (sessionId) {
        throw new Error("not implemented");
    };
}

