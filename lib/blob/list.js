"use strict";

var _ = require("lodash");

var Blob = require("./blob");

const STR_LIST = "list";

class ListBlob extends Blob {

    constructor(value) {

        super(STR_LIST);
        
        if(_.isArray(value) && _.every(_.map(value, (v) => v instanceof Blob))) {

            this._wrapped = _.concat([], value);

        } else {

            throw new Error("List constructor unimplemented for value " + value.toString() + " of type " + (typeof value));

        }
  
    }

    length() {

        return this._wrapped.length;

    }

    concat(anotherListBlob) {

        return new ListBlob(_.concat(this._wrapped, anotherListBlob._wrapped));

    }

    getItems() {

        return _.concat([], this._wrapped);

    }

    stringRep() {

        return "[" + _.map(this._wrapped, (x) => x.stringRep()).join(", ") + "]";

    }

    isTruthy() {

        return (this.length() !== 0);

    }

}

module.exports = ListBlob;