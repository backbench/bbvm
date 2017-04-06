"use strict";

var Blobs = require("../../blob/blobs");
var Constants = require("../../blob/constants");

function binaryOpGreaterThan(left, right, operator) {

    let result = Constants.BETAL_NULL;

    if(operator === ">") {
        if (left instanceof Blobs.NumberBlob && right instanceof Blobs.NumberBlob) {
            return new Blobs.BetalBlob(left.numberRep() > right.numberRep());
        }
    } else if(operator == ">=") {
        if (left instanceof Blobs.NumberBlob && right instanceof Blobs.NumberBlob) {
            return new Blobs.BetalBlob((left.numberRep() > right.numberRep()) || (left.equals(right)));
        }
    }
    
    return result;
}

module.exports = binaryOpGreaterThan;
