"use strict";

var _ = require("lodash");

var Blob = require("./blob");

const STR_STRING = "string";

class StringBlob extends Blob {

    constructor(value) {
        super(STR_STRING);
        if(_.isString(value)) {
            this._wrapped = value;
        } else {
            throw new Error("String constructor unimplemented for value " + value + " of type " + (typeof value));
        }
    }

    concat(anotherStringBlob) {
        return new StringBlob(this._wrapped.concat(anotherStringBlob._wrapped));
    }

    length() {
        return this._wrapped.length;
    }

    stringRep() {
        return JSON.stringify(this._wrapped);
    }

    isTruthy() {
        return this._wrapped.length !== 0;
    }

    json() {
        return this._wrapped;
    }

}

module.exports = StringBlob;