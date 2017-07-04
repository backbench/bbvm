"use strict";

var _ = require("lodash");
var Blobs = require("../../../blob/blobs");
var Constants = require("../../../blob/constants");

module.exports = {

    "std:keys": function(args) {
        if(args.length > 0 && args[0] instanceof Blobs.MapBlob) {
            return new Blobs.ListBlob(_.keys(args[0].mapRep()).map(key => new Blobs.StringBlob(key)));
        }
    },

    "std:values": function(args) {
        if(args.length > 0 && args[0] instanceof Blobs.MapBlob) {
            return new Blobs.ListBlob(_.values(args[0].mapRep()));
        }
    }

};