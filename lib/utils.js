"use strict";

var _ = require("lodash");
var Blobs = require("./blob/blobs");
var Constants = require("./blob/constants");

module.exports = {

    toJson: function(blob){
        return JSON.stringify(blob.json());
    },

    fromJson: function(json) {

        function convert(o) {
            if(_.isNull(o) || _.isBoolean(o)) {
                return new Blobs.BetalBlob(o);
            } else if(_.isFinite(o)) {
                return new Blobs.NumberBlob(o);
            } else if(_.isString(o)) {
                return new Blobs.StringBlob(o);
            } else if(_.isArray(o)) {
                return new Blobs.ListBlob(o.map(convert));
            } else if(_.isPlainObject(o)) {
                return new Blobs.MapBlob(_.mapValues(o, convert));
            } else {
                return Constants.BETAL_NULL;
            }
        }

        return convert(JSON.parse(json));

    },

    invokeLambda: function(functionName, payload, cb) {

        let AWS = require("aws-sdk");
        AWS.config.update({region:'us-east-1'});
        let lambda = new AWS.Lambda();

        lambda.invoke({
            FunctionName: functionName,
            Payload: JSON.stringify(payload)
        }, function(err, res) {
            if (err) {
                cb(err);
            } else if (res.Payload) {
                cb(undefined, JSON.parse(res.Payload));
            } else {
                cb("Lambda error: Payload missing in response when invoking " + functionName + payload);
            }
        });
    }

};
