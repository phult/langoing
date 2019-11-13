/**
 * @author Phuluong
 * Feb 17, 2016
 */
/** Exports **/
module.exports = new EngineFactory();
/** Imports **/
var Engine = require("./engine");
/** Modules **/
function EngineFactory() {
    this.getEngine = function (config) {
        var retval = null;
        var engine = new (require(__dir + config.enginePath + "/" + config.engine))(config);
        if (engine instanceof Engine) {
            retval = engine;
        } else {
            retval = new Engine();
        }
        return retval;
    };
}