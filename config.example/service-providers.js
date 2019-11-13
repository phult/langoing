var config = require(__dir + "/core/app/config");
var routerLoader = require(__dir + "/core/loader/route-loader");
var event = require(__dir + "/core/app/event");
var DbConnection = require(__dir + "/services/db-connection");
var logger = (require(__dir + "/core/log/logger-factory")).getLogger();
var dbConnection = new DbConnection(config, event, logger);
dbConnection.connect(config.get("database"));
module.exports = function ($serviceContainer) {
    $serviceContainer.bind("$config", config);
    $serviceContainer.bind("$route", routerLoader);
    $serviceContainer.bind("$event", event);
    $serviceContainer.bind("$logger", logger);
    $serviceContainer.bind("$dbConnection", dbConnection);
};