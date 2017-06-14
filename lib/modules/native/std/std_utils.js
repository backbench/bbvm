"use strict";

var fillRange = require("fill-range");
var _ = require("lodash");

var Blobs = require("../../../blob/blobs");
var Constants = require("../../../blob/constants");
var utils = require("../../../utils");

module.exports = {

    "std:to": function(args) {
        let step = undefined;
        if(args.length > 2 && args[2] instanceof Blobs.NumberBlob) {
            step = args[2].numberRep();
        }
        if(args.length > 1 && args[0] instanceof Blobs.NumberBlob && args[1] instanceof Blobs.NumberBlob) {
            return new Blobs.ListBlob(fillRange(args[0].numberRep(), args[1].numberRep(), step).map(x => new Blobs.NumberBlob(x)));
        } else if (args.length > 1 && args[0] instanceof Blobs.StringBlob && args[1] instanceof Blobs.StringBlob) {
            return new Blobs.ListBlob(fillRange(args[0].value(), args[1].value(), step).map(x => new Blobs.StringBlob(x)));
        }
    },

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

    "std:log": function(args) {
        if(args.length > 0) {
            let logMessage = args.map(arg => arg.stringRep()).join(" ");
            console.log(logMessage);
        }
    },

    "std:random": function(args) {
        if(args.length >= 3 && args[0] instanceof Blobs.NumberBlob && args[1] instanceof Blobs.NumberBlob && args[2] instanceof Blobs.BetalBlob)
            return new Blobs.NumberBlob(_.random(args[0].numberRep(), args[1].numberRep(), args[2].isTruthy()));
        else if(args.length >= 2 && args[0] instanceof Blobs.NumberBlob && args[1] instanceof Blobs.NumberBlob)
            return new Blobs.NumberBlob(_.random(args[0].numberRep(), args[1].numberRep()));
        else if(args.length >=1 && args[0] instanceof Blobs.NumberBlob)
            return new Blobs.NumberBlob(_.random(args[0].numberRep()));
    }

};