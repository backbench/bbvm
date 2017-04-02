"use strict";

var _ = require("lodash");
var utils = require("./utils");
var Blobs = require("./blob/blobs");

const HOT_MODULE_DB_HOST = "bbcache.dsrx7u.0001.use1.cache.amazonaws.com";

function parsePartials(userModule) {
    let partials = (userModule.partials || []).reduce(function(acc, partial) {
        return _.assign(acc, {
            [partial.name]: new Blobs.FunctionBlob(partial.name, partial.params, partial.body)
        });
    }, {});
    return partials;
}

function parseModule(userModule) {

    let partials = parsePartials(userModule);

    return (userModule.functions || []).reduce(function(acc, func) {
        return _.assign(acc, {
            [func.name]: new Blobs.FunctionBlob(null, func.params, func.body, null, partials)
        });
    }, {});

}

function parseModules(userModules) {
    return (userModules || []).reduce(function(acc, userModule) {
        return _.assign(acc, parseModule(userModule));
    }, {});
}

function loadModules(userId, benchId) {
    return new Promise(function(done, reject) {
        utils.invokeLambda("redis-proxy", {
            db: 1,
            host: HOT_MODULE_DB_HOST,
            cmd: "hgetall",
            args: [userId + ":" + benchId]
        }, function(err, res) {
            if(res.status.toLowerCase() === "ok") {
                let userModules = _.values(res.reply).map(m => JSON.parse(m));
                done(parseModules(userModules));
            } else {
                reject("internal_error");
            }
        });
    });
}

module.exports.loadModules = loadModules;
module.exports.parseModule = parseModule;
module.exports.parseModules = parseModules;