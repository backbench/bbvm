"use strict";

var _ = require("lodash");

var expect = require("chai").expect;

var ListBlob = require("../lib/blob/list");

var Constants = require("../lib/blob/constants");


describe("List test", function() {

    describe("Constructor", function() {

        it("should accept an empty array", () => expect(() => new ListBlob([])).to.be.ok);

        describe("Should accept an array of blobs", function() {

            let lists = [
                [Constants.BETAL_NULL, Constants.BETAL_FALSE, Constants.BETAL_TRUE],
                [Constants.STRING_EMPTY, Constants.NUMBER_ZERO],
                [new ListBlob([]), new ListBlob([Constants.NUMBER_ZERO, Constants.BETAL_NULL])]
            ];

            _.each(lists, (list) => it("checking with " + list, () =>

                expect(() => new ListBlob(list)).to.be.ok));

        });

    });

    describe("Should throw an error otherwise", () => {

            let invalids = ["hello", 23, NaN, Infinity, true, {x: 1, y: 2}];

            _.each(invalids, (invalid) =>

                it("checking with " + (typeof invalid) + ": " +  invalid.toString(), () =>

                    expect(() => new ListBlob(invalid)).to.throw(Error)));
    });

    describe("length()", function() {

        let lists = [
                [Constants.BETAL_NULL, Constants.BETAL_FALSE, Constants.BETAL_TRUE],
                [Constants.STRING_EMPTY, Constants.NUMBER_ZERO],
                [new ListBlob([]), new ListBlob([Constants.NUMBER_ZERO, Constants.BETAL_NULL])]
        ]; 

        _.each(lists, (list) => it("checking with " + list, () =>

                expect(new ListBlob(list).length()).to.equal(list.length)));

    });

    describe("stringRep()", function() {

        let lists = [
                [Constants.BETAL_NULL, Constants.BETAL_FALSE, Constants.BETAL_TRUE],
                [Constants.STRING_EMPTY, Constants.NUMBER_ZERO],
                [new ListBlob([]), new ListBlob([Constants.NUMBER_ZERO, Constants.BETAL_NULL])]
        ]; 

        let expected = [
            "[null, false, true]",
            "[\"\", 0]",
            "[[], [0, null]]"
        ];

        _.each(lists, (list, i) => it("checking with " + list, () => 

            expect(new ListBlob(list).stringRep()).to.equal(expected[i])));

    });

    describe("isTruthy()", function() {

        it("should return false for an empty list", () => expect(Constants.LIST_EMPTY.isTruthy()).to.be.false);

        let lists = [
            [Constants.BETAL_NULL, Constants.BETAL_FALSE, Constants.BETAL_TRUE],
            [Constants.STRING_EMPTY, Constants.NUMBER_ZERO],
            [new ListBlob([]), new ListBlob([Constants.NUMBER_ZERO, Constants.BETAL_NULL])]
        ];

        describe("should return true otherwise", function() {

            _.each(lists, (list, i) => it("checking with " + list, () => 

                expect(new ListBlob(list).isTruthy()).to.be.true));

        });

    });

    describe("getItems()", function() {

        let lists = [
                [Constants.BETAL_NULL, Constants.BETAL_FALSE, Constants.BETAL_TRUE],
                [Constants.STRING_EMPTY, Constants.NUMBER_ZERO],
                [new ListBlob([]), new ListBlob([Constants.NUMBER_ZERO, Constants.BETAL_NULL])]
            ];

        it("should return the elements in order", function() {            

            let check = _.map(lists, (list) => _.isEqual(new ListBlob(list).getItems(), list));

            expect(_.every(check)).to.be.true;

        });

        it("should return a read-only copy", function() {

            let check = _.map(lists, function(list) {

                let listBlob = new ListBlob(list);

                let items = listBlob.getItems();

                let copy = _.cloneDeep(items);

                //Modify items
                items.push(3);

                items.push("hello");

                //Make sure the list is still unchanged

                return _.isEqual(listBlob.getItems(), copy);


            });

            expect(_.every(check)).to.be.true;

        });

    });

});