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

        let result = left.getValue() + right.getValue();

        if(_.isFinite(result)) {

            return new NumberBlob(result);

        } else {

            return Constants.BETAL_NULL;

        }

     }

}

module.exports = binaryOpPlus;