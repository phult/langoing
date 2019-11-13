/**
 * @author Phuluong
 * Feb 13, 2016
 */
/** Exports **/
module.exports = new Config();
/** Imports **/
var fs = require("fs");
var util = require(__dir + '/core/app/util');
/** Modules **/
function Config() {
    var configContainer = {};
    /**
     * Get config value by key
     * @param {String} key
     * @param {} defaultValue
     * @returns {}
     */
    this.get = function (key, defaultValue) {
        var retval = defaultValue;
        if (configContainer[key] != null) {
            retval = configContainer[key];
        } else {
            key = key.replaceAll(".", "/");
            var path = __dir + "/config/" + key;
            var parentPath = path.substring(0, path.lastIndexOf("/"));
            try {
                var property = path.substring(path.lastIndexOf("/") + 1, path.length);
                if (fs.existsSync(path + ".js")) {
                    retval = require(path);
                } else if (fs.existsSync(parentPath + ".js")) {                    
                    if ((require(parentPath))[property] != null) {
                        retval = (require(parentPath))[property];
                    }
                } else if (key.indexOf("package") == 0) {
                    retval = (require(__dir + "/package.json"))[property];
                }
                configContainer[key] = retval;
            } catch (exc) {
            }
        }
        if (retval == null) {
            
        }
        return retval;
    };
    /**
     * Set config value
     * @param {String} key
     * @param {} value
     */
    this.set = function (key, value) {
        configContainer[key] = value;
    };
}

