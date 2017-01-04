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

        return false;

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

    isBinary() {

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

}

module.exports = Blob;