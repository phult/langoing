/** Imports **/
var fs = require("fs");
var config = require(__dir + "/core/app/config");
var util = require(__dir + "/core/app/util");
var sessionManager = require(__dir + "/core/io/session/session-manager");
var httpServer = require(__dir + "/core/net/http-server");
var autoLoader = require(__dir + "/core/loader/auto-loader");
var routerLoader = require(__dir + "/core/loader/route-loader");
var httpConnection = require(__dir + "/core/net/http-connection");
var socketIOConnection = require(__dir + "/core/net/socket-io-connection");
var routes = require(__dir + "/start/routes");
var packageCfg = require(__dir + "/package.json");
var loggerFactory = require(__dir + "/core/log/logger-factory");
var serviceContainer = require(__dir + "/core/ioc-container/service-container");
var serviceProviderRegister = require(__dir + "/config/service-providers");
var event = require(__dir + "/core/app/event");
var viewEngineFactory = require(__dir + "/core/io/view/engine-factory");
/** Exports **/
module.exports = new Application();
/** Modules **/
function Application() {
    var logger = loggerFactory.getLogger(this);
    var viewEngine = viewEngineFactory.getEngine(config.get("view"));
    this.start = function () {
        handleExceptions();
        logger.info("===========================================================");
        displayAppInfo();
        boot();
        displayConfiguration();
        logger.info("===========================================================");

    };
    function boot() {
        // Start client session manager
        sessionManager.start(config.get("session"));
        // Load request routes
        routerLoader.load({
            autoLoader: autoLoader,
            httpConnection: httpConnection,
            socketIOConnection: socketIOConnection,
            sessionManager: sessionManager,
            viewEngine: viewEngine
        });
        // Bind registed service providers
        serviceProviderRegister(serviceContainer);
        // Load autoload classes
        autoLoader.loadConfiguration(config.get("app.autoload"));
        // Start HTTP connection listener
        httpConnection.listen(httpServer);
        // Start Socket.io connection listener
        socketIOConnection.listen(httpServer, sessionManager);
        // Start http server
        httpServer.listen(config.get("app.port"), sessionManager);
        // Fire event
        event.fire("system.booted");
    }
    function handleExceptions() {
        process.on("uncaughtException", function (err) {
            logger.error("uncaughtException: " + err.message);
            logger.error(err.stack);
        });
    }
    function displayAppInfo() {
        logger.info(packageCfg.name + " v" + packageCfg.version);
        logger.info(packageCfg.homepage);
        logger.info("");
    }
    function displayConfiguration() {
        logger.info("Start time:  " + util.now());
        logger.info("Local IP:    " + util.getLocalIP());
        logger.info("Port:        " + config.get("app.port"));
        var sslMode = config.get("app.sslMode");
        logger.info("SSL mode:    " + sslMode.enable);
        if (sslMode.enable) {
            logger.info("SSL port:    " + sslMode.port);
        }
        logger.info("Debug mode:  " + config.get("app.debug"));
    }
}
