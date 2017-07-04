"use strict";

var _ = require("lodash");
var Blobs = require("../../../blob/blobs");
var Constants = require("../../../blob/constants");

module.exports = {

    "std:map": function(args, globalContext) {
        if(args.length > 1 && args[0] instanceof Blobs.ListBlob && args[1] instanceof Blobs.FunctionBlob) {
            return new Promise(function(done) {
                let result = args[0].getItems().map((item, index) => args[1].run([item, new Blobs.NumberBlob(index), args[0]], null, globalContext));
                Promise.all(result).then(function(values) {
                    done(new Blobs.ListBlob(values));
                });
            });
        }
    },

    "std:filter": function(args, globalContext) {
        if(args.length > 1 && args[0] instanceof Blobs.ListBlob && args[1] instanceof Blobs.FunctionBlob) {
            return new Promise(function(done) {
                let result = args[0].getItems().map((item, index) => args[1].run([item, new Blobs.NumberBlob(index), args[0]], null, globalContext));
                Promise.all(result).then(function(values) {
                    done(new Blobs.ListBlob(args[0].getItems().filter((item, index) => values[index].isTruthy())));
                });
            });
        }  
    },

    "std:get": function(args) {
        let result;
        if(args.length > 1 && args[0] instanceof Blobs.MapBlob && args[1] instanceof Blobs.StringBlob) {
            result = args[0].mapRep()[args[1].value()];
        } else if(args.length > 1 && args[0] instanceof Blobs.ListBlob && args[1] instanceof Blobs.NumberBlob) {
            result = args[0].getItems()[args[1].numberRep()];
        }
        return result ? result : ((args.length > 2) ? args[2] : Constants.BETAL_NULL);
    },

    "std:delete": "std:del",
    "std:del": function(args) {
        if(args.length > 1 && args[0] instanceof Blobs.MapBlob) {
            let deleteKeys = args.slice(1).filter(arg => arg instanceof Blobs.StringBlob);
            deleteKeys = deleteKeys.map(key => key.value());
            return new Blobs.MapBlob(_.omit(args[0].mapRep(), deleteKeys));
        } else if(args.length > 1 && args[0] instanceof Blobs.ListBlob) {
            let deleteIndices = args.slice(1).filter(item => item instanceof Blobs.NumberBlob);
            deleteIndices = deleteIndices.map((item) => item.numberRep());
            return new Blobs.ListBlob(args[0].getItems().filter((item, index) => {
                return deleteIndices.indexOf(index) === -1;
            }));
        } else {
            return args[0];
        }
    }
}