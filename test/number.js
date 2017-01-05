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

            it("checking with string 'hello'", () =>

                expect(() => new NumberBlob("hello")).to.throw(Error));

            it("checking with NaN", () => 

                expect(() => new NumberBlob(NaN)).to.throw(Error));

            it("checking with Infinity", () => 

                expect(() => new NumberBlob(Infinity)).to.throw(Error));

            it("checking with boolean true", () => 

                expect(() => new NumberBlob(true)).to.throw(Error));

            it("checking with list [1,2,3]", () => 

                expect(() => new NumberBlob([1,2,3])).to.throw(Error));

            it("checking with map {x: 1, y: 2}", () => 

                expect(() => new NumberBlob({x: 1, y: 2})).to.throw(Error));

        });

    });

    describe("stringRep()", function() {

        it("should return 0 for the number 0", () => expect(new NumberBlob("0").stringRep()).to.equal("0"));

        it("should return -1 for the number -1", () => expect(new NumberBlob("-1").stringRep()).to.equal("-1"));

        it("should return 42 for the number 42", () => expect(new NumberBlob("42").stringRep()).to.equal("42"));

        it("should return 1.223 for the number 1223e-3", 

            () => expect(new NumberBlob("1223e-3").stringRep()).to.equal("1.223"));

        it("should return -1425 for the number -1.425e3", 

            () => expect(new NumberBlob("-1.425e3").stringRep()).to.equal("-1425"));
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