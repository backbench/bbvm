"use strict";

var _ = require("lodash");
var waterfall = require("async-waterfall");

var Blobs = require("../blob/blobs");
var Constants = require("../blob/constants");

var Types = require("./types");

var expressionProcessors = {

    [Types.EXPRESSION_BETAL]: function(e, jar, context) {
        return new Blobs.BetalBlob(e.value);
    },

    [Types.EXPRESSION_NUMBER]: function(e, jar, context) {
        return new Blobs.NumberBlob(e.value);
    },

    [Types.EXPRESSION_STRING]: function(e, jar, context) {
        return new Blobs.StringBlob(e.value);
    },

    [Types.EXPRESSION_LIST]: function(e, jar, context) {
        return new Promise(function(done) {
            processExpressions(e.value, jar, context).then(function(values) {
                done(new Blobs.ListBlob(values));
            });
        });
    },

    [Types.EXPRESSION_MAP]: function(e, jar, context) {

    },

    [Types.EXPRESSION_FUNCTION]: function(e, jar, context) {

    }

};


var processExpression = function(e, jar, context) {
    if (e instanceof Blobs.Blob) {
        return e;
    } else if (_.isPlainObject(e)) {
        return expressionProcessors[e.type](e, jar, context);
    } else {
        throw new Error("processExpression not defined for expression ", e);
    }
}

var processExpressions = function(expressions, jar, context) {
    return new Promise(function(done) {
        waterfall(_.map(expressions, function(expression) {
            return function() {
                var callback = arguments[arguments.length - 1];
                var acc = arguments.length == 2 ? arguments[0] : [];
                if (expression.type === Types.EXPRESSION_SPREAD) {
                    Promise.resolve(processExpression(expression.collection, jar, context)).then(function(collection) {
                        if (collection instanceof Blobs.ListBlob) {
                            callback(null, acc.concat(collection.value));
                        } else {
                            acc.push(collection);
                            callback(null, acc);
                        }
                    });
                } else {
                    Promise.resolve(processExpression(expression, jar, context)).then(function(value) {
                        acc.push(value);
                        callback(null, acc);
                    });
                }
            };
        }), function(err, values) {
            values = values || [];
            done(values);
        });
    });
};

module.exports.processExpression = processExpression;

module.exports.processExpressions = processExpressions;
