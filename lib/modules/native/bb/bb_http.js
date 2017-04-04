"use strict";

var _ = require("lodash");
var request = require("request");

var utils = require("../../../utils");
var Blobs = require("../../../blob/blobs");
var Constants = require("../../../blob/constants");

function parseResponse(err, res, body, done) {
    if (err) {
        done(Constants.BETAL_NULL);
    } else {
        let response = {
            status: res.statusCode,
            statusMessage: res.statusMessage,
            headers: res.headers,
            body: (_.isBuffer(body) ? null : body)
        };
        done(utils.fromJson(JSON.stringify(response)));
    }
}

module.exports = {

    "bb:http:get": "bb:http:req",
    "bb:http:req": function(args) {
        if (args.length > 0) {
            if (args[0] instanceof Blobs.StringBlob || args[0] instanceof Blobs.MapBlob) {
                return new Promise(function(done) {
                    request(args[0].json(), function(err, res, body) {
                        parseResponse(err, res, body, done);
                    });
                });
            }
        }
    },

    "bb:http:post": function(args) {
        if (args.length > 0) {
            if (args[0] instanceof Blobs.StringBlob || args[0] instanceof Blobs.MapBlob) {
                return new Promise(function(done) {
                    request.post(args[0].json(), function(err, res, body) {
                        parseResponse(err, res, body, done);
                    });
                });
            }
        }
    },

    "bb:http:put": function(args) {
        if (args.length > 0) {
            if (args[0] instanceof Blobs.StringBlob || args[0] instanceof Blobs.MapBlob) {
                return new Promise(function(done) {
                    request.put(args[0].json(), function(err, res, body) {
                        parseResponse(err, res, body, done);
                    });
                });
            }
        }
    },

    "bb:http:patch": function(args) {
        if (args.length > 0) {
            if (args[0] instanceof Blobs.StringBlob || args[0] instanceof Blobs.MapBlob) {
                return new Promise(function(done) {
                    request.patch(args[0].json(), function(err, res, body) {
                        parseResponse(err, res, body, done);
                    });
                });
            }
        }
    },

    "bb:http:delete": function(args) {
        if (args.length > 0) {
            if (args[0] instanceof Blobs.StringBlob || args[0] instanceof Blobs.MapBlob) {
                return new Promise(function(done) {
                    request.delete(args[0].json(), function(err, res, body) {
                        parseResponse(err, res, body, done);
                    });
                });
            }
        }
    },

    "bb:http:head": function(args) {
        if (args.length > 0) {
            if (args[0] instanceof Blobs.StringBlob || args[0] instanceof Blobs.MapBlob) {
                return new Promise(function(done) {
                    request.head(args[0].json(), function(err, res, body) {
                        parseResponse(err, res, body, done);
                    });
                });
            }
        }
    }

};
