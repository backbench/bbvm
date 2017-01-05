"use strict";

var _ = require("lodash");

var expect = require("chai").expect;

var NumberBlob = require("../lib/blob/number");

var Constants = require("../lib/blob/constants");

var binaryOpPlus = require("../lib/ops/binaryOps").binaryOpPlus;

describe("binaryOpPlus test", function() {


    it("number + number must return the arithmetic sum", function() {

        let inputs = [
            {l: 10, r: 30}, {l: -20, r: 50}, {l: 50, r: -60}, {l: -50, r: -60}, {l: 1.334, r: 2.554},
            {l: -5.33, r: 4.55}, {l: 5.33, r: -4.55}, {l: -5.33, r: -4.55}, {l: 0, r: -4.55},
            {l: 0, r: 4.55}, {l: -4.4, r: 0}];
        
        let sums = _.map(inputs, (input) => binaryOpPlus(new NumberBlob(input.l), new NumberBlob(input.r)));

        let check = _.map(sums, (sum, i) => sum.getValue() === inputs[i].l + inputs[i].r);

        expect(_.every(check)).to.be.true;

    });


})