"use strict";

var utils = require("../../../utils");
var Blobs = require("../../../blob/blobs");
var Constants = require("../../../blob/constants");

var AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports = {

    "bb:mem:set": function(args, context) {
        if (args.length >= 2) {
            let key = args[0] instanceof Blobs.StringBlob ? args[0].value() : args[0].stringRep();
            let value = args[1].json();

            if (key !== "" && value !== "") {
                dynamodb.put({
                    TableName: process.env.DB_MEMORY,
                    Item: {
                        benchName: context.userId + ":" + context.benchId,
                        key: key,
                        value: value
                    }
                }, function(err, res) {
                    err && console.log(err);
                });
            }
        }
    },

    "bb:mem:get": function(args, context) {
        return new Promise(function(done) {
            if (args.length >= 1) {
                let key = (args[0] instanceof Blobs.StringBlob ? args[0].value() : args[0].stringRep());
                dynamodb.get({
                    TableName: process.env.DB_MEMORY,
                    Key: {
                        benchName: context.userId + ":" + context.benchId,
                        key: key
                    },
                    ProjectionExpression: "#value",
                    ExpressionAttributeNames: {
                        "#value": "value"
                    }
                }, function(err, res) {
                    if (res && res.Item) {
                        done(utils.fromJson(JSON.stringify(res.Item.value)));
                    } else {
                        done(Constants.BETAL_NULL);
                    }
                });
            }
        });
    },

    "bb:mem:del": function(args, context) {
        if (args.length >= 1) {
            let key = (args[0] instanceof Blobs.StringBlob ? args[0].value() : args[0].stringRep());
            dynamodb.delete({
                TableName: process.env.DB_MEMORY,
                Key: {
                    benchName: context.userId + ":" + context.benchId,
                    key: key
                }
            }, function(err, res) {
                err && console.log(err);
            });
        }
    }

}