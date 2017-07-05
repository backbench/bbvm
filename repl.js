"use strict";

var request = require("request");
var utils = require("./lib/utils");
var codec = require("./lib/codec");
var GlobalContext = require("./lib/GlobalContext");
var ExpressionProcessor = require("./lib/processors/ExpressionProcessor");

module.exports.handler = function(event, context, callback) {

    let expressionSource = event.expression;
    let encodedJar = event.jar || {};

    let localContext = {
        jar: codec.jarFromJson(encodedJar)
    };

    let globalContext = new GlobalContext();
    globalContext.moduleLibrary = require("./lib/modules/native/std");

    request.post({
        url: "https://compiler.backbench.io",
        json: {
            type: "expression",
            source: "(" + expressionSource + ")"
        }
    }, function(err, res, body) {
        if(err) {
            callback(undefined, {
                status: "error",
                error: "internal_error"
            });
        } else {
            if(body.status === "ok") {
                let expression = body.result;
                ExpressionProcessor.processExpression(expression, localContext, globalContext).then(function(result) {
                    callback(undefined, {
                        status: "ok",
                        result: event.json ? utils.toJson(result) : codec.encode(result),
                        jar: codec.jarToJson(localContext.jar)
                    });
                });
            } else {
                callback(undefined, {
                    status: "error",
                    error: body.error
                });
            }
        }

    });
};