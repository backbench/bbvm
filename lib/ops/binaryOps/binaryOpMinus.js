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
    } else if(left instanceof Blobs.ListBlob && right instanceof Blobs.ListBlob) {
        // remove every element of right from left
        let resultVal = _.differenceWith(left.getItems(), right.getItems(), (left, right) => left.equals(right));
        result = new Blobs.ListBlob(resultVal);
    } else if(left instanceof Blobs.ListBlob) {
        // remove all occurances of right from the list
        let resultVal = left.getItems().filter((item) => !item.equals(right));
        result = new Blobs.ListBlob(resultVal);
    } else if(left instanceof Blobs.MapBlob && right instanceof Blobs.ListBlob) {       
        let omitKeys = right.getItems().filter(item => item.isString()).map(item => item.value());
        let resultVal = _.omit(left.mapRep(), omitKeys);
        result = new Blobs.MapBlob(resultVal);
    } else if(left instanceof Blobs.MapBlob && right instanceof Blobs.StringBlob) {
        let resultVal = _.omit(left.mapRep(), right.value());
        result = new Blobs.MapBlob(resultVal);
    }
    return result;
}

module.exports = binaryOpMinus;
