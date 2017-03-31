"use strict";

var Blobs = require("../../../blob/blobs");
var utils = require("../../../utils");

module.exports = {

    "std:parse": function(args) {
        if(args.length > 0) {
            if(args[0] instanceof Blobs.StringBlob) {
                return utils.fromJson(args[0].json());
            }
        }
    },

    "std:json": function(args) {
        if(args.length > 0) {
            return new Blobs.StringBlob(utils.toJson(args[0]));
        }
    }

};