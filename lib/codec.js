"use strict";

/*
 *  msgpack codec for blobs
 */

var _ = require("lodash");
var msgpack = require("msgpack5")();
var Blobs = require("./blob/blobs");

// msgpack extension encoders and decoders
var msgpack_enc = {
    "betal": function(blob) {
        return new Buffer(blob.stringRep());
    },
    "number": function(blob) {
        return new Buffer(blob.stringRep());
    },
    "string": function(blob){
        return new Buffer(blob.value());
    },
    "list": function(blob) {
        return new Buffer(msgpack.encode(blob.getItems()));
    },
    "map": function(blob) {
        return new Buffer(msgpack.encode(blob.mapRep()));
    },
    "function": function(blob) {
        return new Buffer(msgpack.encode({
            name: blob.name,
            params: blob.params,
            body: blob.body,
            jar: blob.jar
        }));
    }
};

var msgpack_dec = {
    "betal": function(buf) {
        return new Blobs.BetalBlob(buf.toString());
    },
    "number": function(buf) {
        return new Blobs.NumberBlob(buf.toString());
    },
    "string": function(buf) {
        return new Blobs.StringBlob(buf.toString(), true);
    },
    "list": function(buf) {
        return new Blobs.ListBlob(msgpack.decode(buf));
    },
    "map": function(buf) {
        return new Blobs.MapBlob(msgpack.decode(buf));
    },
    "function": function(buf) {
        var f = msgpack.decode(buf);
        return new Blobs.FunctionBlob(f.name, f.params, f.body, f.jar);
    }
};

//Register blob msgpack extensions
msgpack.register(0, Blobs.BetalBlob, msgpack_enc["betal"], msgpack_dec["betal"]);
msgpack.register(1, Blobs.NumberBlob, msgpack_enc["number"], msgpack_dec["number"]);
msgpack.register(2, Blobs.StringBlob, msgpack_enc["string"], msgpack_dec["string"]);
msgpack.register(3, Blobs.ListBlob, msgpack_enc["list"], msgpack_dec["list"]);
msgpack.register(4, Blobs.MapBlob, msgpack_enc["map"], msgpack_dec["map"]);
msgpack.register(5, Blobs.FunctionBlob, msgpack_enc["function"], msgpack_dec["function"]);

function encode(blob) {
    return msgpack.encode(blob).toString('base64');
}

function decode(buf) {
    return msgpack.decode(new Buffer(buf, 'base64'));
}

function jarToJson(jar) {
    return _.mapValues(jar, function(blob) {
        return encode(blob);
    });
}

function jarFromJson(jar) {
    return _.mapValues(jar, function(encodedBlob) {
        return decode(encodedBlob);
    });
}

module.exports = {
    encode: encode,
    decode: decode,
    jarToJson: jarToJson,
    jarFromJson: jarFromJson
};