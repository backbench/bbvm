"use strict";

var _ = require("lodash");
var Blob = require("./blob");

const STR_FUNCTION = "function";

class FunctionBlob extends Blob {

    constructor(params, body, jar, partials) {
        super(STR_FUNCTION);
        this.params = params;
        this.body = body;
        this.jar = jar;
        this.partials = partials;

        this.run = this.run.bind(this);
    }

    run(args) {

    }

    stringRep() {
        return "[function]";
    }

    isTruthy() {
        return true;
    }

}

module.exports = FunctionBlob;