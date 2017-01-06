"use strict";

var StringBlob = require("../../../blob/string");

var Constants = require("../../../blob/constants");

module.exports = {

    "std:type": function(args) {

        if(args.length > 0) {

            return new StringBlob(args[0].getType());

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

    }

};