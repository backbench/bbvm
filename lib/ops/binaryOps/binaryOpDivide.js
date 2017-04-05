"use strict";

var Mustache = require("mustache");

var Blobs = require("../../blob/blobs");
var Constants = require("../../blob/constants");

function binaryOpDivide(left, right) {

    let result = Constants.BETAL_NULL;

    if (left instanceof Blobs.NumberBlob && right instanceof Blobs.NumberBlob) {
        //Arithmetic mutliplication
        result = left.divide(right);
    }
    
    return result;
}

module.exports = binaryOpDivide;
