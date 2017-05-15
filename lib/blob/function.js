"use strict";

var _ = require("lodash");
var Blob = require("./blob");

const STR_FUNCTION = "function";

class FunctionBlob extends Blob {

    constructor(name, params, body, jar, partials) {

        super(STR_FUNCTION);

        this.name = name || "";
        this.params = params || [];
        this.body = body;
        this.jar = jar || {};
        this.partials = partials || {};

        this.run = this.run.bind(this);
    }

    run(args, thisValue, globalContext) {

        if(this.name.indexOf(":") > 0) {
            return Promise.resolve(globalContext.run(this.name, args));
        }

        let ListBlob = require("./list");
        let Constants = require("./constants");
        let statementProcessor = require("../processors/StatementProcessor");
        let expressionProcessor = require("../processors/ExpressionProcessor");

        let localContext = {
            jar: _.assign({}, this.jar, {}),
            partials: _.assign({}, this.partials)
        };

        if(this.name) {
            localContext.jar[this.name] = this;
        }
        localContext.jar["self"] = this;
        localContext.jar["this"] = thisValue || Constants.BETAL_NULL;
        localContext.jar["args"] = new ListBlob(args);

        let that = this;

        return new Promise(function(done) {
            expressionProcessor.processParams(that.params, args, localContext, globalContext).then(function() {
                statementProcessor.processStatement(that.body, localContext, globalContext).then(function(result) {
                    if(result.value) {
                        done(result.value);
                    } else {
                        done(Constants.BETAL_NULL);
                    }
                });
            });
        });

    }

    stringRep() {
        return "[function]";
    }

    isTruthy() {
        return true;
    }

    isFunction() {
        return true;
    }

    json() {
        return null;
    }

}

module.exports = FunctionBlob;