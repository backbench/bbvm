"use strict";

var BetalBlob = require("../../blob/betal");
var NumberBlob = require("../../blob/number");
var StringBlob = require("../../blob/string");
var ListBlob = require("../../blob/list");
var MapBlob = require("../../blob/map");
var Constants = require("../../blob/constants");

function unaryOpMinus(operand) {
	
	/*
     * Base: http://www.ecma-international.org/ecma-262/5.1/#sec-11.4.7
     */

    let result = Constants.BETAL_NULL;

    if(operand instanceof BetalBlob) {
        result = new BetalBlob(operand._wrapped == "false")
    } else if(operand instanceof NumberBlob) {
        result = new NumberBlob(-operand._wrapped);
    } else if(operand instanceof StringBlob) {
        //reverse the string
        let reversedString = '';
        for (let i = operand._wrapped.length - 1; i >= 0; i--)
            reversedString += operand._wrapped[i];

        result = new StringBlob(reversedString);

    } else if(operand instanceof ListBlob) {
        //reverse the list
        
        let reversedList = [];
        for (let i = operand._wrapped.length - 1; i>=0; i--)
            reversedList.push(operand._wrapped[i]);

        result = reversedList;
    }

    return result;
}

module.exports = unaryOpMinus;