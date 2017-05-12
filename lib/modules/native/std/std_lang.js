"use strict";

var Blobs = require("../../../blob/blobs");

var Constants = require("../../../blob/constants");

module.exports = {

    "std:type": function(args) {
        if (args.length > 0) {
            return new Blobs.StringBlob(args[0].getType());
        }
    },

    "std:isBetal": function(args) {
        return (args.length > 0 && args[0].isBetal()) ? Constants.BETAL_TRUE : Constants.BETAL_FALSE;
    },

    "std:isNumber": function(args) {
        return (args.length > 0 && args[0].isNumber()) ? Constants.BETAL_TRUE : Constants.BETAL_FALSE;
    },

    "std:isString": function(args) {
        return (args.length > 0 && args[0].isString()) ? Constants.BETAL_TRUE : Constants.BETAL_FALSE;
    },

    "std:isList": function(args) {
        return (args.length > 0 && args[0].isList()) ? Constants.BETAL_TRUE : Constants.BETAL_FALSE;
    },

    "std:isMap": function(args) {
        return (args.length > 0 && args[0].isMap()) ? Constants.BETAL_TRUE : Constants.BETAL_FALSE;
    },

    "std:isFunction": function(args) {
        return (args.length > 0 && args[0].isFunction()) ? Constants.BETAL_TRUE : Constants.BETAL_FALSE;
    },

    "std:isTruthy": function(args) {
        return (args.length > 0 && args[0].isTruthy()) ? Constants.BETAL_TRUE : Constants.BETAL_FALSE;
    },

    "std:size": "std:length",
    "std:length": function(args) {
        if(args.length > 0) {
            if(args[0] instanceof Blobs.StringBlob
                || args[0] instanceof Blobs.ListBlob
                || args[0] instanceof Blobs.MapBlob) {
                return new Blobs.NumberBlob(args[0].length());
            }
        }
    }

};
