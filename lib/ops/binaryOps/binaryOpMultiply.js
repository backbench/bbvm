"use strict";

var Mustache = require("mustache");

var Blobs = require("../../blob/blobs");
var Constants = require("../../blob/constants");

function binaryOpMultiply(left, right) {

    let result = Constants.BETAL_NULL;

    if (left instanceof Blobs.NumberBlob && right instanceof Blobs.NumberBlob) {
        //Arithmetic mutliplication
        result = left.multiply(right);
    } else if(left instanceof Blobs.StringBlob || right instanceof Blobs.StringBlob) {
        if(left.isString()) {
            if(right.isNumber())
                result = right.multiply(new Blobs.NumberBlob(left.value()));
            else if(right.isString())
                result = (new Blobs.NumberBlob(right.value())).multiply(new Blobs.NumberBlob(left.value()));
        } else if(left.isNumber())
            result = left.multiply(new Blobs.NumberBlob(right.value()));
    }
    
    return result;
}

module.exports = binaryOpMultiply;
