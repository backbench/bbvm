"use strict";

var _ = require("lodash");

var Constants = require("./blob/constants");
var FunctionBlob = require("./blob/function");

class ExecutionContext {

    constructor(userId, benchId, userModules) {
        this.userId = userId;
        this.benchId = benchId;
        this.prepareModuleLibrary(userModules);

        this.run = this.run.bind(this);
    }

    prepareModuleLibrary(userModules) {
        this.moduleLibrary = require("./modules");
        _.assign(this.moduleLibrary, userModules || {});
    }

    run(functionName, args) {
        if(!this.moduleLibrary.hasOwnProperty(functionName)) {
            return Constants.BETAL_NULL;
        } else {
            let func = this.moduleLibrary[functionName];
            if(func instanceof FunctionBlob) {
                return func.run(args, this);
            } else if(_.isFunction(func)) {
                return func.apply(this.moduleLibrary, [args]);
            } else {
                console.log("Warning! Bad function ", functionName, func);
                return Constants.BETAL_NULL;
            }
        }
    }

}

module.exports = ExecutionContext;