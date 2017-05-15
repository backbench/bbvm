"use strict";

var _ = require("lodash");
var Blob = require("./blob");

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
