"use strict";

var _ = require("lodash");

var BetalBlob = require("../../blob/betal");

var NumberBlob = require("../../blob/number");

var StringBlob = require("../../blob/string");

var Constants = require("../../blob/constants");

function binaryOpPlus(left, right) {

    /*
     * Base: http://www.ecma-international.org/ecma-262/5.1/#sec-11.6.1
     */

     if(left instanceof NumberBlob && right instanceof NumberBlob) {

        //Arithmetic addition
        return left.add(right);

     } else if(left instanceof StringBlob && right instanceof StringBlob) {

        //String concatenation
        return left.concat(right);

     } else if(left instanceof StringBlob) {

        //String concatenation with right.stringRep()
        return left.concat(new StringBlob(right.stringRep()));

     }
}

module.exports = binaryOpPlus;