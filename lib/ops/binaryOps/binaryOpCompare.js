"use strict";

var Blobs = require("../../blob/blobs");
var Constants = require("../../blob/constants");

function binaryOpCompare(left, right, operator) {

    let result = Constants.BETAL_NULL;

    if(operator === "==" || operator === "is") {
        return new Blobs.BetalBlob(left.equals(right));
    } else if(operator === "!=") {
        return new Blobs.BetalBlob(!left.equals(right));
    }
    
    return result;
}

module.exports = binaryOpCompare;
