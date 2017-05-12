"use strict";

var _ = require("lodash");
var Constants = require("../blob/constants");

function write(address, value, localContext) {
    if(_.isString(address)) {
        localContext.jar[address] = value;
    }
}

function read(address, localContext) {
    if(_.isString(address)) {
        if(localContext.jar.hasOwnProperty(address)) {
            return localContext.jar[address];
        } else if(localContext.partials && localContext.partials.hasOwnProperty(address)) {
            let partial = localContext.partials[address];
            partial.partials = localContext.partials;
            return partial;
        } else {
            return Constants.BETAL_NULL;
        }
    } else {
        return Constants.BETAL_NULL;
    }
}

module.exports.write = write;
module.exports.read = read;