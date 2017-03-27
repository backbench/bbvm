"use strict";

var _ = require("lodash");

class Blob {

    constructor(type) {
        this.type = type;
    }

    getType() {
        return this.type;
    }

    isTruthy() {
        throw new Error("isTruthy() unimplemented for " + this.type);
    }

    stringRep() {
        throw new Error("stringRep() unimplemented for " + this.type);
    }

    isBetal() {
        return false;
    }

    isNumber() {
        return false;
    }

    isString() {
        return false;
    }

    isList() {
        return false;
    }

    isMap() {
        return false;
    }

    isFunction() {
        return false;
    }

    equals(anotherBlob) {
        return _.isEqual(this, anotherBlob);
    }

    json() {
        throw new Error("json() unimplemented for " + this.type);
    }

}

module.exports = Blob;
