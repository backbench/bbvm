"use strict";

var Blobs = require("../../../blob/blobs");

var AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports = {
    "bb:log": function(args, context) {
        if(args.length > 0) {
            let message = args.map((arg) => arg instanceof Blobs.StringBlob ? arg.value() : arg.stringRep()).join(" ");
            if(message) {
                dynamodb.put({
                    TableName: process.env.DB_LOG,
                    Item: {
                        benchName: context.userId + ":" + context.benchId,
                        timestamp: (new Date()).toISOString(),
                        message: message
                    }
                }, function(err, data) {
                    console.log(err);
                });
            }
        }
    }
};