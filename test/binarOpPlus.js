"use strict";

var _ = require("lodash");

var expect = require("chai").expect;

var BetalBlob = require("../lib/blob/betal");

var NumberBlob = require("../lib/blob/number");

var StringBlob = require("../lib/blob/string");

var Constants = require("../lib/blob/constants");

var binaryOpPlus = require("../lib/ops/binaryOps").binaryOpPlus;

describe("binaryOpPlus test", function() {


    it("number + number must return the arithmetic sum", function() {

        let inputs = [
            {l: 10, r: 30}, {l: -20, r: 50}, {l: 50, r: -60}, {l: -50, r: -60}, {l: 1.334, r: 2.554},
            {l: -5.33, r: 4.55}, {l: 5.33, r: -4.55}, {l: -5.33, r: -4.55}, {l: 0, r: -4.55},
            {l: 0, r: 4.55}, {l: -4.4, r: 0}];
        
        let sums = _.map(inputs, (input) => binaryOpPlus(new NumberBlob(input.l), new NumberBlob(input.r)));

        let check = _.map(sums, (sum, i) => sum.numberRep() === inputs[i].l + inputs[i].r);

        expect(_.every(check)).to.be.true;

    });

    it("string + string must concatenate the strings", function() {

        let inputs = [
            {l: "hello", r: "world"}, {l: "", r: "world"}, {l: "hello", r: ""}
        ];

        let concats = _.map(inputs, (input) => binaryOpPlus(new StringBlob(input.l), new StringBlob(input.r)));

        let check = _.map(concats, (concat, i) => 

            concat.stringRep() === new StringBlob(inputs[i].l.concat(inputs[i].r)).stringRep());

        expect(_.every(check)).to.be.true;

    });

    describe("string + nonString must concatenate string and nonString.stringRep()", function() {

        let leftString = new StringBlob("hello");

        it("string + betal", function() {

            let betals = [Constants.BETAL_NULL, Constants.BETAL_FALSE, Constants.BETAL_TRUE];

            let check = _.map(betals, (betal) =>

                    binaryOpPlus(leftString, betal).stringRep() ===

                        leftString.concat(new StringBlob(betal.stringRep())).stringRep());

        });

        it("string + number", function() { 

            let nums = [0, -1, 3.14, -14.25];

            let check = _.map(nums, (num) =>

                binaryOpPlus(leftString, new NumberBlob(num)).stringRep() === 

                    leftString.concat(new StringBlob(num.toString())).stringRep());

            expect(_.every(check)).to.be.true;

        });

    });

});