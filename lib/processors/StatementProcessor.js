"use strict";

var _ = require("lodash");
var waterfall = require("async-waterfall");

var Blobs = require("../blob/blobs");
var Constants = require("../blob/constants");

var utils = require("./utils");
var Types = require("./types");

var ExpressionProcessor = require("./ExpressionProcessor");

const OK = (value) => ({ status: "ok", value: value });
const BREAK = () => ({ status: "break" });
const RETURN = (value) => ({ status: "return", value: value });
const CONTINUE = () => ({ status: "continue" });

var statementProcessors = {

    [Types.STATEMENT_BLOCK]: function(s, localContext, globalContext) {
        return processStatements(s.statements, localContext, globalContext);
    },

    [Types.STATEMENT_IF]: function(s, localContext, globalContext) {
        return new Promise(function(done) {
            ExpressionProcessor.processExpression(s.condition, localContext, globalContext).then(function(value) {
                if (value.isTruthy()) {
                    processStatement(s.body, localContext, globalContext).then(function(result) {
                        done(result);
                    });
                } else {
                    if (s.elseBody) {
                        processStatement(s.elseBody, localContext, globalContext).then(function(result) {
                            done(result);
                        });
                    } else {
                        done(OK());
                    }
                }
            });
        });
    },

    [Types.STATEMENT_FOR]: function(s, localContext, globalContext) {
        return new Promise(function(done) {
            runLoop(s.init, s.condition, s.update, s.body, done, localContext, globalContext);
        });
    },

    [Types.STATEMENT_FOR_IN]: function(s, localContext, globalContext) {
        return new Promise(function(done) {
            ExpressionProcessor.processExpression(s.collection, localContext, globalContext).then(function(collection) {
                if (collection instanceof Blobs.ListBlob) {
                    waterfall(collection.getItems().map(function(item) {
                        return function() {
                            let callback = arguments[arguments.length - 1];
                            let acc = (arguments.length > 1 ? arguments[0] : OK());
                            if (_.includes([RETURN(), BREAK()].map((x) => x.status), acc.status)) {
                                callback(null, acc);
                            } else {
                                let processIterator = null;
                                if (s.iterator.type === Types.ITERATOR_ID) {
                                    processIterator = ExpressionProcessor.processAssignment({
                                        "type": Types.EXPRESSION_ID,
                                        "id": s.iterator.name
                                    }, item, localContext, globalContext);
                                } else if (s.iterator.type === Types.ITERATOR_MAP) {
                                    processIterator = ExpressionProcessor.processAssignment(s.iterator.map, item, localContext, globalContext);
                                }
                                processIterator.then(function() {
                                    processStatement(s.body, localContext, globalContext).then(function(result) {
                                        callback(null, result);
                                    });
                                });
                            }
                        }
                    }), function(err, result) {
                        if(result.status === RETURN().status) {
                            done(result);
                        } else {
                            done(OK());
                        }
                    });
                } else {
                    done(OK());
                }
            });
        });
    },

    [Types.STATEMENT_WHILE]: function(s, localContext, globalContext) {
        return new Promise(function(done) {
            let initialRun = s["do"] ? processStatement(s.body, localContext, globalContext) : undefined;
            Promise.resolve(initialRun).then(function(result) {
                if (result && (result.status === RETURN().status)) {
                    done(result);
                } else if (result && (result.status === BREAK().status)) {
                    done(OK());
                } else {
                    runLoop(null, s.condition, null, s.body, done, localContext, globalContext);
                }
            });
        });
    },

    [Types.STATEMENT_SWITCH]: function(s, localContext, globalContext) {
        return new Promise(function(done) {
            ExpressionProcessor.processExpression(s.predicate, localContext, globalContext).then(function(predicate) {
                waterfall(s.clauses.map(function(clause) {
                    return function() {
                        let next = arguments[arguments.length - 1];
                        let acc = (arguments.length > 1 ? arguments[0] : undefined);
                        if(acc) {
                            done(acc);
                        } else {
                            if(clause.type === Types.SWITCH_CLAUSE_CASE) {
                                ExpressionProcessor.processExpression(clause.value, localContext, globalContext).then(function(condition) {
                                    if(predicate.equals(condition)) {
                                        processStatement(clause.body, localContext, globalContext).then(function(result) {
                                            done(result);
                                        });
                                    } else {
                                        next();
                                    }
                                });
                            } else {
                                processStatement(clause.body, localContext, globalContext).then(function(result) {
                                    done(result);
                                });
                            }
                        }
                    }
                }), function(err) {
                    done(OK());
                });
            });
        });
    },

    [Types.STATEMENT_EXPRESSION]: function(s, localContext, globalContext) {
        return new Promise(function(done) {
            ExpressionProcessor.processExpression(s.expression, localContext, globalContext).then(function(value) {
                done(OK(value));
            });
        });
    },

    [Types.STATEMENT_BREAK]: function(s, localContext, globalContext) {
        return BREAK();
    },

    [Types.STATEMENT_CONTINUE]: function(s, localContext, globalContext) {
        return CONTINUE();
    },

    [Types.STATEMENT_RETURN]: function(s, localContext, globalContext) {
        return new Promise(function(done) {
            if (s.value) {
                ExpressionProcessor.processExpression(s.value, localContext, globalContext).then(function(value) {
                    done(RETURN(value));
                });
            } else {
                done(RETURN());
            }
        });
    },

    [Types.STATEMENT_EMPTY]: function(s, localContext, globalContext) {
        return OK();
    }
};

function processStatement(s, localContext, globalContext) {
    if (_.isPlainObject(s)) {
        return Promise.resolve(statementProcessors[s.type](s, localContext, globalContext));
    } else {
        throw new Error("processStatement not defined for statement type " + JSON.stringify(s));
    }
}

function processStatements(statements, localContext, globalContext) {
    return new Promise(function(done) {
        waterfall(statements.map(function(statement) {
            return function() {
                var callback = arguments[arguments.length - 1];
                var acc = (arguments.length > 1 ? arguments[0] : OK());
                if (_.includes([RETURN(), BREAK(), CONTINUE()].map((x) => x.status), acc.status)) {
                    callback(null, acc);
                } else {
                    processStatement(statement, localContext, globalContext).then(function(result) {
                        callback(null, result);
                    });
                }
            }
        }), function(err, result) {
            result = result || OK();
            done(result);
        });
    });
}

function runLoop(initExpression, conditionExpression, updateExpression, bodyStatement,
    done, localContext, globalContext) {

    let init = initExpression &&
        ExpressionProcessor.processExpression(initExpression, localContext, globalContext);

    Promise.resolve(init).then(function() {

        let condition = conditionExpression &&
            ExpressionProcessor.processExpression(conditionExpression, localContext, globalContext);

        Promise.resolve(condition).then(function(condition) {
            if (condition.isTruthy()) {
                processStatement(bodyStatement, localContext, globalContext).then(function(result) {
                    if (result.status === RETURN().status) {
                        done(result);
                    } else if (result.status === BREAK().status) {
                        done(OK());
                    } else {
                        let update = updateExpression &&
                            ExpressionProcessor.processExpression(updateExpression, localContext, globalContext);

                        Promise.resolve(update).then(function() {
                            runLoop(undefined, conditionExpression, updateExpression, bodyStatement,
                                done, localContext, globalContext);
                        });
                    }
                });
            } else {
                done(OK());
            }
        });
    });

}

module.exports.processStatement = processStatement;
