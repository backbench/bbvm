"use strict";

var Blobs = require("../../../blob/blobs");
var Constants = require("../../../blob/constants");
var utils = require("../../../utils");

var AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports = {

    "std:parse": function(args) {
        if(args.length > 0) {
            if(args[0] instanceof Blobs.StringBlob) {
                try {
                    return utils.fromJson(args[0].json());
                } catch(ex) {
                    return Constants.BETAL_NULL;
                }
            }
        }
    },

    "std:json": function(args) {
        if(args.length > 0) {
            return new Blobs.StringBlob(utils.toJson(args[0]));
        }
    },

    "std:log": function(args, context) {
        if(args.length > 0) {
            let message = args.map((arg) => arg instanceof Blobs.StringBlob ? arg.value() : arg.stringRep()).join(" ");
            if(message) {
                dynamodb.put({
                    TableName: "logdb",
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