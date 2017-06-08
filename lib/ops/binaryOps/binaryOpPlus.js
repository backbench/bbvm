"use strict";

var _ = require("lodash");

var BetalBlob = require("../../blob/betal");
var NumberBlob = require("../../blob/number");
var StringBlob = require("../../blob/string");
var ListBlob = require("../../blob/list");
var Constants = require("../../blob/constants");

function binaryOpPlus(left, right) {

    /*
     * Base: http://www.ecma-international.org/ecma-262/5.1/#sec-11.6.1
     */

    let result = Constants.BETAL_NULL;

    if (left instanceof NumberBlob && right instanceof NumberBlob) {
        //Arithmetic addition
        result = left.add(right);
    } else if (left instanceof ListBlob && right instanceof ListBlob) {
        //List concatenation
        result = left.concat(right);
    } else if (left instanceof ListBlob || right instanceof ListBlob) {
        if (left instanceof ListBlob) {
            //Appends to list
            result = left.concat(new ListBlob([right]));
        } else if (right instanceof ListBlob) {
            //Prepends to list
            result = new ListBlob([left]).concat(right);
        }
    } else if (left instanceof StringBlob && right instanceof StringBlob) {
        //String concatenation
        result = left.concat(right);
    } else if (left instanceof StringBlob) {
        //String concatenation with right.stringRep()
        result = left.concat(new StringBlob(right.stringRep()));
    } else if(right instanceof StringBlob) {
        result = (new StringBlob(left.stringRep())).concat(right);
    } else if(left.equals(Constants.BETAL_NULL)) {
        //null + Blob is Blob
        result = right;
    } else if(right.equals(Constants.BETAL_NULL)) {
        //Blob + null is Blob
        result = left;
    }
    
    return result;
}

module.exports = binaryOpPlus;
