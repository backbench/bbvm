"use strict";

var BetalBlob = require("./betal");
var NumberBlob = require("./number");
var StringBlob = require("./string");
var ListBlob = require("./list");

module.exports = {
    BETAL_NULL: new BetalBlob("null"),
    BETAL_FALSE: new BetalBlob("false"),
    BETAL_TRUE: new BetalBlob("true"),
    NUMBER_ZERO: new NumberBlob(0),
    NUMBER_ONE: new NumberBlob(1),
    STRING_EMPTY: new StringBlob(""),
    LIST_EMPTY: new ListBlob([])
};