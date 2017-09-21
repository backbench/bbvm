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

    if (_.isString(userId) && _.isString(benchId) && _.isString(func) && _.isArray(jsonArgs)) {

        ModuleLoader.loadModules(userId, benchId).then(function(userModules) {

            let globalContext = new GlobalContext(userId, benchId, userModules);

            let args = jsonArgs.map((arg) => utils.fromJson(JSON.stringify(arg)));

            Promise.resolve(globalContext.run(func, args)).then(function(result) {
                callback(undefined, {
                    requestId: context.awsRequestId,
                    status: "ok",
                    result: result.json()
                });
            }).catch(function(err) {
                console.log(err);
                callback(undefined, {
                    requestId: context.awsRequestId,
                    status: "error",
                    error: "internal_error"
                });
            });
        }).catch(function(err) {
            console.log(err);
            callback(undefined, {
                requestId: context.awsRequestId,
                status: "error",
                error: "internal_error"
            });
        });
    } else {
        callback(undefined, {
            requestId: context.awsRequestId,
            status: "error",
            error: "invalid_request"
        });
    }
};