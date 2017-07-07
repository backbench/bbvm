"use strict";

var Blobs = require("../../blob/blobs");
var Constants = require("../../blob/constants");

function binaryOpGreaterThan(left, right, operator) {

    let result = Constants.BETAL_NULL;

    if(operator === ">") {
        result = (left.compare(right) > 0 ? Constants.BETAL_TRUE : Constants.BETAL_FALSE);
    } else if(operator === ">=") {
        if(left.equals(right)) {
            result = Constants.BETAL_TRUE;
        } else {
            result = (left.compare(right) > 0 ? Constants.BETAL_TRUE : Constants.BETAL_FALSE);
        }
    }
    
    return result;
}

module.exports = binaryOpGreaterThan;
