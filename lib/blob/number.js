"use strict";

var _ = require("lodash");

var Blob = require("./blob");

const STR_NUMBER = "number";

class NumberBlob extends Blob {

    constructor(value) {
        super(STR_NUMBER);
        if (_.isFinite(value)) {
            this._wrapped = value;
        } else if (_.isString(value) && _.isFinite(_.toNumber(value))) {
            this._wrapped = _.toNumber(value);
        } else {
            throw new Error("Number constructor unimplemented for value " + value + " of type " + (typeof value));
        }
    }

    add(anotherNumberBlob) {
        return new NumberBlob(this._wrapped + anotherNumberBlob._wrapped);
    }

    subtract(anotherNumberBlob) {
        return new NumberBlob(this._wrapped - anotherNumberBlob._wrapped);
    }

    multiply(anotherNumberBlob) {
        let Constants = require("./constants");
        let result = this._wrapped * anotherNumberBlob._wrapped;
        return _.isFinite(result) ? new NumberBlob(result) : Constants.BETAL_NULL;
    }

    divide(anotherNumberBlob) {
        let Constants = require("./constants");
        let result = this._wrapped / anotherNumberBlob._wrapped;
        return _.isFinite(result) ? new NumberBlob(result) : Constants.BETAL_NULL;   
    }

    modulo(anotherNumberBlob) {
        let Constants = require("./constants");
        let result = this._wrapped % anotherNumberBlob._wrapped;
        return _.isFinite(result) ? new NumberBlob(result) : Constants.BETAL_NULL;   
    }

    isTruthy() {
        return this._wrapped !== 0;
    }

    isNumber() {
        return true;
    }

    stringRep() {
        return this._wrapped.toString();
    }

    numberRep() {
        return this._wrapped;
    }

    json() {
        return this.numberRep();
    }

}

module.exports = NumberBlob;
