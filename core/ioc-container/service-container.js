/**
 * @author Phuluong
 * December 27, 2015
 */
/** Exports **/
module.exports = new ServiceContainer();
/** Imports **/
var logger = (require(__dir + "/core/log/logger-factory")).getLogger("ServiceProvider");
/** Modules **/
function ServiceContainer() {
    var containerMap = {};
    this.bind = function (abstract, concrete) {
        if (containerMap[abstract] != null) {
            logger.warning("Binding a duplicated abstract: " + abstract, concrete);
        }
        containerMap[abstract] = concrete;
    };
    this.make = function (abstract) {
        var retval = null;
        var concrete = containerMap[abstract];
        if (concrete != null) {
            if (typeof concrete == "function") {
                retval = new concrete();
            } else if (typeof concrete == "object") {
                retval = concrete;
            }
        }
        return retval;
    };
}


