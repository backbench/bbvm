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
    },

    "std:toPairs": function(args) {
        if(args.length > 0 && args[0] instanceof Blobs.MapBlob) {
            let mapRep = args[0].mapRep();
            let result = [];
            _.forEach(mapRep, (value, key) => {
                result.push(new Blobs.ListBlob([new Blobs.StringBlob(key), value]));
            });
            return new Blobs.ListBlob(result);
        }
    }

};