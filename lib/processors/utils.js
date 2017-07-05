"use strict";

var _ = require("lodash");
var Constants = require("../blob/constants");
var Blobs = require("../blob/blobs");

function write(address, value, localContext) {
    if(_.isString(address)) {
        localContext.jar[address] = value;
    } else if(_.isArray(address)) {
        let rootID = address.shift();
        let parsedNestedAssignment;
        if(localContext.jar.hasOwnProperty(rootID.id)) {
            parsedNestedAssignment = localContext.jar[rootID.id];
        } else if(address[0] instanceof Blobs.NumberBlob) {
            parsedNestedAssignment = new Blobs.ListBlob([]);
        } else if(address[0] instanceof Blobs.StringBlob) {
            parsedNestedAssignment = new Blobs.MapBlob({})
        }
        parsedNestedAssignment = parseNestedAssignment(address, parsedNestedAssignment, value);
        localContext.jar[rootID.id] = parsedNestedAssignment;
    }
}

function read(address, localContext) {
    if(_.isString(address)) {
        if(localContext.jar.hasOwnProperty(address)) {
            return localContext.jar[address];
        } else if(localContext.partials && localContext.partials.hasOwnProperty(address)) {
            let partial = localContext.partials[address];
            partial.partials = localContext.partials;
            return partial;
        } else if(address === "jar") {
            return new Blobs.MapBlob(localContext.jar);
        } else {
            return Constants.BETAL_NULL;
        }
    } else {
        return Constants.BETAL_NULL;
    }
}

var parseNestedAssignment = function(nestedKeys, accumulator, rhs) {
    if (nestedKeys.length !== 0) {
        let nextKey = nestedKeys.shift();
        if (nextKey instanceof Blobs.StringBlob) {
            let key = nextKey.value();
            if (accumulator instanceof Blobs.MapBlob) {
                accumulator = accumulator.set(nextKey, parseNestedAssignment(nestedKeys, accumulator.get(key), rhs));
            } else {
                accumulator = new Blobs.MapBlob({[key]: parseNestedAssignment(nestedKeys, accumulator, rhs)})
            }
        } else if(nextKey instanceof Blobs.NumberBlob) {
            let key = nextKey.numberRep();
            if (accumulator instanceof Blobs.ListBlob) {
                accumulator = accumulator.setItem(nextKey, parseNestedAssignment(nestedKeys, accumulator.getItems()[key], rhs));
            } else {
                accumulator = (new Blobs.ListBlob([])).setItem(nextKey, parseNestedAssignment(nestedKeys, accumulator, rhs));
            }
        }
        return accumulator;
    } else {
        return rhs;
    }
};

module.exports.write = write;
module.exports.read = read;