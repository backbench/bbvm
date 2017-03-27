"use strict";

var _ = require("lodash");
var utils = require("./utils");
var ExecutionContext = require("./ExecutionContext");

module.exports = function(event, _context, callback) {

    let userId = event.userId;
    let benchId = event.benchId;
    let func = event.func;
    let jsonArgs = event.args || [];

    let context = new ExecutionContext(userId, benchId);

    if(_.isString(userId) && _.isString(benchId) && _.isString(func) && _.isArray(jsonArgs)) {

        let args = jsonArgs.map((arg) => utils.fromJson(JSON.stringify(arg)));

        Promise.resolve(context.run(func, args)).then(function(result) {
            callback(undefined, {
                status: "ok",
                result: result.json()
            });
        }).catch(function(err) {
            console.log(err);
            callback(undefined, {
                status: "error",
                error: "internal_error"
            });
        });
    } else {
        callback(undefined, {
            status: "error",
            error: "invalid_request"
        });
    }

};