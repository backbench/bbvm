"use strict";

var _ = require("lodash");

var expect = require("chai").expect;

var StringBlob = require("../lib/blob/string");

var Constants = require("../lib/blob/constants");


describe("String test", function() {

    describe("Constructor", function() {

        describe("Should accept any valid string", function() {

            let strings = ["", "hello", "world", "123", "true", "    "];

            _.each(strings, (string) => it("checking with '" + string + "'", () =>

                expect(() => new StringBlob(string)).to.be.ok));

        });

    });

    describe("Should throw an error otherwise", () => {

            let invalids = [23, NaN, Infinity, true, [1,2,3], {x: 1, y: 2}];

            _.each(invalids, (invalid) =>

                it("checking with " + (typeof invalid) + ": " +  invalid.toString(), () =>

                    expect(() => new NumberBlob(invalid)).to.throw(Error)));
    });

    describe("stringRep()", function() {

        let strings = ["", "hello", "world", "123", "true", "    "];

        _.each(strings, (string) =>

            it("checking with " + string, () => 

                expect(new StringBlob(string).stringRep()).to.equal(JSON.stringify(string))));

    });

    describe("length()", function() {

        let strings = ["", "hello", "world", "123", "true", "    "];

        _.each(strings, (string) =>

            it("checking with " + string, () =>

                expect(new StringBlob(string).length()).to.equal(string.length)));        

    });

    describe("isTruthy()", function() {

        it("should return false for an empty string", () =>

            expect(Constants.STRING_EMPTY.isTruthy()).to.be.false);

        describe("Should return true otherwise", function() {

            let strings = ["hello", "world", "123", "true", "    "];

            _.each(strings, (num) => 

                it("checking with " + num, () => expect(new StringBlob(num).isTruthy()).to.be.true));

        });

    });

});