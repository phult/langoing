/**
 * @author Phuluong
 * Feb 14, 2016
 */
/** Exports **/
module.exports = new LoggerFactory();
/** Imports **/
var config = require("../../core/app/config");
var Logger = require("./logger");
/** Modules **/
function LoggerFactory() {
    /**
     * Build a logger instance
     * @param {String|object} obj
     * @returns {Logger}
     */
    this.getLogger = function (obj) {
        var retval = null;
        var logConfig = config.get("log");
        logConfig.debug = config.get("app.debug");
        var logger = new (require(__dir + logConfig.loggerPath + "/" + logConfig.logger))(obj, logConfig);
        if (logger instanceof Logger) {
            retval = logger;
        } else {
            retval = new Logger();
        }
        return retval;
    };
}
