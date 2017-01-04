"use strict";

var _ = require("lodash");

class Blob {

    constructor(type) {

        this.type = type;

    }

    getType() {

        return this.type;

    }

    isBetal() {

        return this.type !== "betal";

    }

    equals(anotherBlob) {

        return _.isEqual(this, anotherBlob);

    }

}

module.exports = Blob;