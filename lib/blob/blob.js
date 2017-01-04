"use strict";

var _ = require("lodash");

class Blob {

    constructor(type) {

        this.type = type;

    }

    getType() {

        return this.type;

    }

    equals(anotherBlob) {

        return _.isEqual(this, anotherBlob);

    }

}

module.exports = Blob;