"use strict";

var _ = require("lodash");

var Blob = require("./blob");

const STR_BETAL = "betal";

const STR_NULL = "null", STR_FALSE = "false", STR_TRUE = "true";

class BetalBlob extends Blob {

    constructor(value) {

        super(STR_BETAL);

        if(_.isString(value) && _.includes([STR_NULL, STR_FALSE, STR_TRUE], value.toLowerCase())) {

            this._wrapped = value.toLowerCase();

        } else {

            throw new Error("Betal constructor unimplemented for value " + value + " of type " + (typeof value));

        }

    }

    isTruthy() {

        return this._wrapped === STR_TRUE;

    }

    isBetal() {

        return true;

    }

    stringRep() {

        return this._wrapped;

    }

    isTrue() {

        return this._wrapped === STR_TRUE;

    }

    isFalse() {

        return this._wrapped === STR_FALSE;

    }

    isNull() {

        return this._wrapped === STR_NULL;

    }

}

module.exports = BetalBlob;