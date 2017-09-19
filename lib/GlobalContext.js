"use strict";

var _ = require("lodash");

var Constants = require("./blob/constants");
var FunctionBlob = require("./blob/function");

var standardModules = require("./modules");

class GlobalContext {

    constructor(userId, benchId, userModules) {
        this.userId = userId;
        this.benchId = benchId;
        this.moduleLibrary = _.assign(standardModules, userModules || {});

        this.run = this.run.bind(this);
    }

    run(functionName, args) {
        if (!this.moduleLibrary.hasOwnProperty(functionName)) {
            return Constants.BETAL_NULL;
        } else {
            let func = this.moduleLibrary[functionName];
            if (func instanceof FunctionBlob) {
                return func.run(args, undefined, this);
            } else if (_.isFunction(func)) {
                let result = func.apply(this.moduleLibrary, [args, this]);
                return result ? result : Constants.BETAL_NULL;
            } else if(_.isString(func)) {
                return this.run(func, args);
            } else {
                console.log("Warning! Bad function ", functionName, func);
                return Constants.BETAL_NULL;
            }
        }
    }

}

module.exports = GlobalContext;