"use strict";

var Mustache = require("mustache");

var Blobs = require("../../../blob/blobs");
var Constants = require("../../../blob/constants");

module.exports = {

    "std:render": function(args) {
        if(args.length >= 2) {
            if(args[0] instanceof Blobs.StringBlob && args[1] instanceof Blobs.MapBlob) {
                console.log(args[0].value(), args[1].json());
                return new Blobs.StringBlob(Mustache.render(args[0].value(), args[1].json()));
            }
        }
    },

    "std:upper": function(args) {
        if(args.length > 0 && args[0] instanceof Blobs.StringBlob) {
            return new Blobs.StringBlob(args[0].value().toUpperCase());
        }
    },

    "std:lower": function(args) {
        if(args.length > 0 && args[0] instanceof Blobs.StringBlob) {
            return new Blobs.StringBlob(args[0].value().toLowerCase());
        }
    }

};
