"use strict";

var _ = require("lodash");

var expect = require("chai").expect;

var BetalBlob = require("../lib/blob/betal");

var NumberBlob = require("../lib/blob/number");

var StringBlob = require("../lib/blob/string");

var Constants = require("../lib/blob/constants");

var Modules = require("../lib/modules");

describe("std:isBetal()", function() {

    it("should return a true betal for any betal", function() {

        let betals = [Constants.BETAL_NULL, Constants.BETAL_FALSE, Constants.BETAL_TRUE];

        let check = _.map(betals, (betal) => Modules["std:isBetal"]([betal]) == Constants.BETAL_TRUE);

        expect(_.every(check)).to.be.true;

    });

});