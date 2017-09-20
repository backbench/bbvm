"use strict";

var _ = require("lodash");
var utils = require("./utils");
var ModuleLoader = require("./ModuleLoader");
var GlobalContext = require("./GlobalContext");
var mysql = require('mysql');

module.exports = function(event, context, callback) {

    let userId = event.userId;
    let benchId = event.benchId;
    let func = event.func;
    let jsonArgs = event.args || [];

    var connection = mysql.createConnection({host : process.env.SQL_HOST, user : process.env.SQL_USER, password : process.env.SQL_PASS, database : process.env.SQL_DB});
    connection.connect();

    if (_.isString(userId) && _.isString(benchId) && _.isString(func) && _.isArray(jsonArgs)) {

        ModuleLoader.loadModules(userId, benchId).then(function(userModules) {

            let globalContext = new GlobalContext(userId, benchId, userModules);

            let args = jsonArgs.map((arg) => utils.fromJson(JSON.stringify(arg)));

            Promise.resolve(globalContext.run(func, args)).then(function(result) {
                callback(undefined, {
                    status: "ok",
                    result: result.json()
                });
                if (result.json()==null) {
                    var sqlQuery = "insert into main1(requestId, userId, benchId, status, logs, invokedFor, metadata, ts) values(\""+context.awsRequestId+"\", \""+userId+"\", \""+benchId+"\", \""+"error"+"\", \""+"Function Not Found"+"\", \""+"bbvm-dev"+"\", \""+func+"\", \""+new Date().toISOString()+"\")"                    
                } else{
                    var sqlQuery = "insert into main1(requestId, userId, benchId, status, logs, invokedFor, metadata, ts) values(\""+context.awsRequestId+"\", \""+userId+"\", \""+benchId+"\", \""+"ok"+"\", \""+""+"\", \""+"bbvm-dev"+"\", \""+func+"\", \""+new Date().toISOString()+"\")"
                }
                connection.query(sqlQuery);
                connection.end();
            }).catch(function(err) {
                console.log(err);
                var sqlQuery = "insert into main1(requestId, userId, benchId, status, logs, invokedFor, metadata, ts) values(\""+context.awsRequestId+"\", \""+userId+"\", \""+benchId+"\", \""+"error"+"\", \""+err+"\", \""+"bbvm-dev"+"\", \""+func+"\", \""+new Date().toISOString()+"\")"
                connection.query(sqlQuery);
                connection.end();
                callback(undefined, {
                    status: "error",
                    error: "internal_error"
                });
            });
        }).catch(function(err) {
            console.log(err);
            var sqlQuery = "insert into main1(requestId, userId, benchId, status, logs, invokedFor, metadata, ts) values(\""+context.awsRequestId+"\", \""+userId+"\", \""+benchId+"\", \""+"error"+"\", \""+err+"\", \""+"bbvm-dev"+"\", \""+func+"\", \""+new Date().toISOString()+"\")"
            connection.query(sqlQuery);
            connection.end();
            callback(undefined, {
                status: "error",
                error: "internal_error"
            });
        });
    } else {
        var sqlQuery = "insert into main1(requestId, userId, benchId, status, logs, invokedFor, metadata, ts) values(\""+context.awsRequestId+"\", \""+userId+"\", \""+benchId+"\", \""+"error"+"\", \""+"invalid_request"+"\", \""+"bbvm-dev"+"\", \""+func+"\", \""+new Date().toISOString()+"\")"
        connection.query(sqlQuery);
        connection.end();
        callback(undefined, {
            status: "error",
            error: "invalid_request"
        });
    }
};