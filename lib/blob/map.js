"use strict";

var _ = require("lodash");
var Blob = require("./blob");
var StringBlob = require("./string");

const STR_MAP = "map";

class MapBlob extends Blob {

    constructor(value) {
        super(STR_MAP);
        if (_.isPlainObject(value) && _.every(_.mapValues(value, (v) => v instanceof Blob))) {
            this._wrapped = _.assign({}, value);
        } else {
            throw new Error("Map constructor unimplemented for value " + value.toString() + " of type " + (typeof value));
        }

    }

    get(key) {
        return this._wrapped.hasOwnProperty(key) ? this._wrapped[key] : undefined;
    }

    set(key, value) {
        if (key instanceof StringBlob && value instanceof Blob) {
            return new MapBlob(_.assign({}, this._wrapped, {[key.value()]: value}));
        } else if (key instanceof StringBlob) {
            throw new Error("set function unimplemented for value " + value.toString() + " of the type " + (typeof value));
        } else {
            throw new Error("set function unimplemented for key " + key.toString() + " of the type " + (typeof key));
        }
    }

    length() {
        return _.size(this._wrapped);
    }

    extend(anotherMapBlob) {
        return new MapBlob(_.assign({}, this._wrapped, anotherMapBlob._wrapped))
    }

    mapRep() {
        return _.assign({}, this._wrapped);
    }

    stringRep() {
        return "{" + _.map(this._wrapped, (val, key) => ("\"" + key + "\": " + val.stringRep())).join(", ") + "}";
    }

    isTruthy() {
        return (this.length() !== 0);
    }

    isMap() {
        return true;
    }

    json() {
        return _.mapValues(this._wrapped, (val) => val.json());
    }

}

module.exports = MapBlob;
