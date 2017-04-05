"use strict";

var _ = require("lodash");
var Mustache = require("mustache");

var Blobs = require("../../blob/blobs");
var Constants = require("../../blob/constants");

function binaryOpModulo(left, right) {

    let result = Constants.BETAL_NULL;

    if (left instanceof Blobs.NumberBlob && right instanceof Blobs.NumberBlob) {
        //Arithmetic modulo
        result = left.modulo(right);
    } else if(left instanceof Blobs.StringBlob && right instanceof Blobs.MapBlob) {
        result = new Blobs.StringBlob(Mustache.render(left.value(), right.json()));
    } else if(left instanceof MapBlob && right instanceof StringBlob) {
        result = new Blobs.StringBlob(Mustache.render(right.value(), left.json()));
    }
    
    return result;
}

module.exports = binaryOpModulo;
