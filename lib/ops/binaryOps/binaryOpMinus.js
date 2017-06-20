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
        let result_val = left.getItems().filter((item) => !_.isEqual(item, right));
        result = new Blobs.ListBlob(result_val);
    } else if(left instanceof Blobs.ListBlob && right instanceof Blobs.ListBlob) {
        // remove every element of right from left
        let result_val = _.differenceWith(left.getItems(), right.getItems(), _.isEqual);
        result = new Blobs.ListBlob(result_val);
    } else if(left instanceof Blobs.MapBlob && right instanceof Blobs.ListBlob) {       
        let omitKeys = right.getItems().map((item) => {
            if(item.isString()) {
                return item.value();
            } else {
                return item.stringRep();
            }
        });
        let result_val = _.omit(left.mapRep(), omitKeys);
        result = new Blobs.MapBlob(result_val);
    } else if(left instanceof Blobs.MapBlob && right instanceof Blobs.StringBlob) {
        let result_val = _.omit(left.mapRep(), right.value());
        result = new Blobs.MapBlob(result_val);
    }
    return result;
}

module.exports = binaryOpMinus;
