"use strict";

var _ = require("lodash");
var Blobs = require("../../../blob/blobs");
var Constants = require("../../../blob/constants");

module.exports = {

    "std:head": "std:first",
    "std:first": function(args) {
        if(args.length >= 1) {
            if(args[0] instanceof Blobs.ListBlob) {
                return _.first(args[0].getItems());
            }
        }
    },

    "std:last": function(args) {
        if(args.length >= 1) {
            if(args[0] instanceof Blobs.ListBlob) {
                return _.last(args[0].getItems());
            }
        }
    },

    "std:tail": function(args) {
        if(args.length >= 1) {
            if(args[0] instanceof Blobs.ListBlob) {
                return new Blobs.ListBlob(_.tail(args[0].getItems()));
            }
        }
    },

    "std:reverse": function(args) {
        if(args.length >= 1) {
            if(args[0] instanceof Blobs.ListBlob) {
                return new Blobs.ListBlob(_.reverse(args[0].getItems()));
            }
        }
    },

    "std:chunk": function(args) {
        let size = 1;
        if(args.length > 1 && args[1] instanceof Blobs.NumberBlob) {
            size = args[1].numberRep();
        }
        if(args.length > 0 && args[0] instanceof Blobs.ListBlob) {
            return new Blobs.ListBlob(_.chunk(args[0].getItems(), size).map(chunk => new Blobs.ListBlob(chunk)));
        }
    },

    "std:concat": function(args) {
        if(args.length > 1 && args[0] instanceof Blobs.ListBlob) {
            return _.tail(args).reduce(function(acc, arg) {
                return acc.concat(arg instanceof Blobs.ListBlob ? arg : new Blobs.ListBlob([arg]));
            }, args[0]);
        } else if(args.length > 0 && args[0] instanceof Blobs.ListBlob) {
            return args[0];
        }
    }
};