module.exports = DbConnection;
var mysql = require('mysql');
var connection = null;

function DbConnection($config, $event, $logger) {
    this.connect = function(config) {
        connection = mysql.createConnection(config);
        connection.connect();
    };

    this.query = async function (queryString) {
        return new Promise(function (resolve, reject) {
            connection.query(queryString,
                function (error, results, fields) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    };
}