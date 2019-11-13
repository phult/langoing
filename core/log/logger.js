/**
 * @author Phuluong
 * Feb 14, 2016
 */
/** Exports **/
module.exports = Logger;
/** Modules **/
/**
 * @param {object|String} obj The object uses the logger
 * @param {object} options
 */
function Logger(obj, options) {
    this.info = function (msg, outputData) {
        throw new Error("not implemented");
    };
    this.debug = function (msg, outputData) {
        throw new Error("not implemented");
    };
    this.warning = function (msg, outputData) {
        throw new Error("not implemented");
    };
    this.error = function (msg, outputData) {
        throw new Error("not implemented");
    };
}