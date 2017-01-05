"use strict";

var _ = require("lodash");

var expect = require("chai").expect;

var BetalBlob = require("../lib/blob/betal");

var Constants = require("../lib/blob/constants");

describe("Blob test", function() {

    describe("getType()", function() {

        describe("should return the string 'betal' for any betal", function() {

            it("checking with betal true", () =>

                expect(Constants.BETAL_TRUE.getType()).to.equal("betal"));

            it("checking with betal false", () =>

                expect(Constants.BETAL_FALSE.getType()).to.equal("betal"));

            it("checking with betal null", () =>
                
                expect(Constants.BETAL_NULL.getType()).to.equal("betal"));

        });

    });

    describe("isBetal()", function() {

        it("should return true for a betal", () => 

            expect(_.every(_.map([Constants.BETAL_TRUE,
                    Constants.BETAL_FALSE,
                    Constants.BETAL_NULL], (betal) => betal.isBetal()))).to.be.true);

    });

    describe("isNumber()", function() {

        it("should return false for a betal", () => 

            expect(_.every(_.map([Constants.BETAL_TRUE,
                    Constants.BETAL_FALSE,
                    Constants.BETAL_NULL], (betal) => betal.isNumber()))).to.be.false);

    });

    describe("isString()", function() {

        it("should return false for a betal", () => 

            expect(_.every(_.map([Constants.BETAL_TRUE,
                    Constants.BETAL_FALSE,
                    Constants.BETAL_NULL], (betal) => betal.isString()))).to.be.false);

    });

    describe("isList()", function() {

        it("should return false for a betal", () => 

            expect(_.every(_.map([Constants.BETAL_TRUE,
                    Constants.BETAL_FALSE,
                    Constants.BETAL_NULL], (betal) => betal.isList()))).to.be.false);

    });

    describe("isMap()", function() {

        it("should return false for a betal", () => 

            expect(_.every(_.map([Constants.BETAL_TRUE,
                    Constants.BETAL_FALSE,
                    Constants.BETAL_NULL], (betal) => betal.isMap()))).to.be.false);

    });

    describe("isFunction()", function() {

        it("should return false for a betal", () => 

            expect(_.every(_.map([Constants.BETAL_TRUE,
                    Constants.BETAL_FALSE,
                    Constants.BETAL_NULL], (betal) => betal.isFunction()))).to.be.false);

    });

});