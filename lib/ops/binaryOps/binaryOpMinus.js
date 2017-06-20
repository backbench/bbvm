"use strict";

var Mustache = require("mustache");
var _ = require("lodash");

var Blobs = require("../../blob/blobs");
var Constants = require("../../blob/constants");

function binaryOpMinus(left, right) {

    let result = Constants.BETAL_NULL;

    if (left instanceof Blobs.NumberBlob && right instanceof Blobs.NumberBlob) {
        //Arithmetic subtraction
        result = left.subtract(right);
    } else if(left instanceof Blobs.ListBlob && (right instanceof Blobs.NumberBlob || right instanceof Blobs.StringBlob || right instanceof Blobs.MapBlob || right instanceof Blobs.BetalBlob)) {
    	// remove all occurances of right from the list
    	result = left.getItems().filter((item) => !_.isEqual(item, right));
    } else if(left instanceof Blobs.ListBlob && right instanceof Blobs.ListBlob) {
    	// remove every element of right from left
    	result = _.differenceWith(left.getItems(), right.getItems(), _.isEqual);
    }
    return result;
}

module.exports = binaryOpMinus;
