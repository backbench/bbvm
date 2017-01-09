"use strict";

var NumberBlob = require("../../../blob/number");

var Constants = require("../../../blob/constants");

module.exports = {

    "std.type": function(args) {

        if(args.length > 0) {

            return new NumberBlob(args[0].getType());
        }
    }    
}; 