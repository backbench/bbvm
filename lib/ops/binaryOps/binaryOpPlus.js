"use strict";

var _ = require("lodash");

var BetalBlob = require("../../blob/betal");

var NumberBlob = require("../../blob/number");

var Constants = require("../../blob/constants");

function binaryOpPlus(left, right) {

    /*
     * Base: http://www.ecma-international.org/ecma-262/5.1/#sec-11.6.1
     */

     if(left instanceof NumberBlob && right instanceof NumberBlob) {

        return left.add(right);

     }

}

module.exports = binaryOpPlus;