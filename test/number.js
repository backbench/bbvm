"use strict";

var _ = require("lodash");

var expect = require("chai").expect;

var NumberBlob = require("../lib/blob/number");

var Constants = require("../lib/blob/constants");

describe("Number test", function() {

    describe("Constructor", function() {

        describe("should accept a valid number", function() {

            let nums = [0, -1, 14.25, -9.889, 14.25e2, 314e-2, -14.25e2, -3.14e-2];

            _.each(nums, (num) =>

                it("checking with " + num, () => expect(() => new NumberBlob(num)).to.be.ok));
        });

        describe("should accept a valid number as string", function() {

            let nums = ["0", "-1", "14.25", "-9.889", "14.25e2", "314e-2", "-14.25e2", "-3.14e-2"];

            _.each(nums, (num) =>

                it("checking with '" + num + "'", () => expect(() => new NumberBlob(num)).to.be.ok));
        });

        describe("should throw an error otherwise", () => {

            let invalids = ["hello", NaN, Infinity, true, [1,2,3], {x: 1, y: 2}];

            _.each(invalids, (invalid) =>

                it("checking with " + (typeof invalid) + ": " +  invalid.toString(), () =>

                    expect(() => new NumberBlob(invalid)).to.throw(Error)));
        });

    });

    describe("stringRep()", function() {


        let nums = [0, -1, 14.25, "-9.889", 14.25e2, "314e-2", -14.25e2, -3.14e-2];

        _.each(nums, (num) =>

            it("checking with " + num, () => expect(new NumberBlob(num).stringRep()).to.equal(_.toNumber(num).toString())));

    });

    describe("isTruthy()", function() {

        it("should return false for the number 0", () =>

            expect(Constants.NUMBER_ZERO.isTruthy()).to.be.false);

        describe("should return true otherwise", function() {

            let nums = ["-1", "1", "14.25", "-23.22", "1.23e4", "1.33e-6"];

            _.each(nums, (num) => 

                it("checking with " + num, () => expect(new NumberBlob(num).isTruthy()).to.be.true));

        });

    });

    describe("getValue()", function() {

        let nums = ["0", "1", "-34", "14.25", "-9.889", "14.23e3", "314e-2", "-14.33e4", "-3140e-3"];

        _.each(nums, function(num) {

            let value = _.toNumber(num);

            it("NumberBlob(\"" + num + "\") => " + value, () => expect(new NumberBlob(num).getValue()).to.equal(value));

        });

    });

});