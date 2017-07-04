"use strict";

var Blobs = require("../../../blob/blobs");

module.exports = {

    "std:time:stamp": function() {
        return new Blobs.NumberBlob(new Date().getTime());
    }

};