"use strict";

var _ = require("lodash");
var Blobs = require("./blob/blobs");
var Constants = require("./blob/constants");

module.exports = {

    toJson: function(blob){
        return JSON.stringify(blob.json());
    },

    fromJson: function(json) {

        function convert(o) {
            if(_.isNull(o) || _.isBoolean(o)) {
                return new Blobs.BetalBlob(o);
            } else if(_.isFinite(o)) {
                return new Blobs.NumberBlob(o);
            } else if(_.isString(o)) {
                return new Blobs.StringBlob(o);
            } else if(_.isArray(o)) {
                return new Blobs.ListBlob(o.map(convert));
            } else {
                return Constants.BETAL_NULL;
            }
        }

        return convert(JSON.parse(json));

    }

};