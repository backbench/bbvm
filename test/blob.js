"use strict";

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

});