"use strict";

var _ = require("lodash");
var Blob = require("./blob");
var BetalBlob = require("./betal");
var NumberBlob = require("./number");

const STR_LIST = "list";
const NULL_BLOB = new BetalBlob("null");

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

    getItem(index) {
        return _.nth(this._wrapped, index);
    }

    getItems() {
        return _.concat([], this._wrapped);
    }

    setItem(index, value) {
        if (value instanceof Blob && index instanceof NumberBlob) {
            let headSublist = this._wrapped;
            let indexValue = index.numberRep();
            if (indexValue < headSublist.length) {
                headSublist[indexValue] = value;
                return new ListBlob(headSublist);
            } else {
                let tailSublist = _.fill(new Array(indexValue - headSublist.length), NULL_BLOB);
                tailSublist.push(value);
                return new ListBlob(_.concat(headSublist, tailSublist));
            }
        } else if (value instanceof Blob) {
            throw new Error("List insertion unimplemented for index " + index.toString() + " of type " + (typeof index));
        } else {
            throw new Error("List insertion unimplemented for value " + value.toString() + " of type " + (typeof value));
        }
    }

    stringRep() {
        return "[" + _.map(this._wrapped, (x) => x.stringRep()).join(", ") + "]";
    }

    isTruthy() {
        return (this.length() !== 0);
    }

    isList() {
        return true;
    }

    json() {
        return this._wrapped.map((x) => x.json());
    }

}

module.exports = ListBlob;