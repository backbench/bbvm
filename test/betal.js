"use strict";

var expect = require("chai").expect;

var BetalBlob = require("../lib/blob/betal");

var Constants = require("../lib/blob/constants");

describe("Betal test", function() {

    describe("Constructor", function() {

        it("should accept the string 'true' as argument, and equal the betal: true", () => 

            expect(new BetalBlob("true").equals(Constants.BETAL_TRUE)).to.be.true );

        it("should accept the string 'false' as argument, and equal the betal: false ", () => 

            expect(new BetalBlob("false").equals(Constants.BETAL_FALSE)).to.be.true);

        it("should accept the string 'null' as argument, and equal the betal: null", () =>

            expect(new BetalBlob("null").equals(Constants.BETAL_NULL)).to.be.true);

        describe("should throw an error otherwise", () => {

            it("checking with string 'hello'", () =>

                expect(() => new BetalBlob("hello")).to.throw(Error));

            it("checking with boolean true", () => 

                expect(() => new BetalBlob(true)).to.throw(Error));

            it("checking with number 0", () => 

                expect(() => new BetalBlob(0)).to.throw(Error));

            it("checking with list [1,2,3]", () => 

                expect(() => new BetalBlob([1,2,3])).to.throw(Error));

            it("checking with map {x: 1, y: 2}", () => 

                expect(() => new BetalBlob({x: 1, y: 2})).to.throw(Error));

        });

    });

    describe("stringRep()", function() {

        it("a true betal must return the string 'true'", () =>

            expect(Constants.BETAL_TRUE.stringRep()).to.equal("true"));

        it("a false betal must return the string 'false'", () =>

            expect(Constants.BETAL_FALSE.stringRep()).to.equal("false"));

        it("a null betal must return the string 'null'", () =>

            expect(Constants.BETAL_NULL.stringRep()).to.equal("null"));

    });

    describe("isTruthy()", function() {

        it("a true betal should return true", () =>

            expect(Constants.BETAL_TRUE.isTruthy()).to.be.true);

        it("a false betal should return false", () =>

            expect(Constants.BETAL_FALSE.isTruthy()).to.be.false);

        it("a null betal should return false", () =>

            expect(Constants.BETAL_NULL.isTruthy()).to.be.false);

    });

    describe("isTrue()", function() {

        it("should return false for a null betal", () => expect(Constants.BETAL_NULL.isTrue()).to.be.false);

        it("should return false for a false betal", () => expect(Constants.BETAL_FALSE.isTrue()).to.be.false);

        it("should return true for a true betal", () => expect(Constants.BETAL_TRUE.isTrue()).to.be.true);

    });

    describe("isFalse()", function() {

        it("should return false for a null betal", () => expect(Constants.BETAL_NULL.isFalse()).to.be.false);

        it("should return true for a false betal", () => expect(Constants.BETAL_FALSE.isFalse()).to.be.true);

        it("should return false for a true betal", () => expect(Constants.BETAL_TRUE.isFalse()).to.be.false);    

    });

});