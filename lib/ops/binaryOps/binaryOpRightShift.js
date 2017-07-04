"use strict";

var BetalBlob = require("../../blob/betal");
var NumberBlob = require("../../blob/number");
var StringBlob = require("../../blob/string");
var ListBlob = require("../../blob/list");
var MapBlob = require("../../blob/map");
var Constants = require("../../blob/constants");

function binaryOpLeftShift(left, right) {

    let result = Constants.BETAL_NULL;

    if(left instanceof NumberBlob && right instanceof NumberBlob)
        result = new NumberBlob(left._wrapped >> right._wrapped);
    
    return result;
}

module.exports = binaryOpLeftShift;
