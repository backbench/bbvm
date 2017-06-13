"use strict";

var _ = require("lodash");
var waterfall = require("async-waterfall");

var Blobs = require("../blob/blobs");
var Constants = require("../blob/constants");

var binaryOps = require("../ops/binaryOps");
var unaryOps = require("../ops/unaryOps");

var utils = require("./utils");
var Types = require("./types");

var processAssignment = function(l, value, localContext, globalContext) {
    if (l.type === Types.EXPRESSION_MAP && value instanceof Blobs.MapBlob) {
        l.value.forEach((mapElement) => {
            if (mapElement.type === Types.MAP_ELEMENT_ID) {
                utils.write(mapElement.id, value.get(mapElement.id) || Constants.BETAL_NULL, localContext);
            }
        });
    } else if (l.type === Types.EXPRESSION_ID) {
        utils.write(l.id, value, localContext);
    }
    return value;
};

var expressionProcessors = {

    [Types.EXPRESSION_BETAL]: function(e, localContext, globalContext) {
        return new Blobs.BetalBlob(e.value);
    },

    [Types.EXPRESSION_NUMBER]: function(e, localContext, globalContext) {
        return new Blobs.NumberBlob(e.value);
    },

    [Types.EXPRESSION_STRING]: function(e, localContext, globalContext) {
        return new Blobs.StringBlob(e.value);
    },

    [Types.EXPRESSION_LIST]: function(e, localContext, globalContext) {
        return new Promise(function(done) {
            processExpressions(e.value, localContext, globalContext).then(function(values) {
                done(new Blobs.ListBlob(values));
            });
        });
    },

    [Types.EXPRESSION_MAP]: function(e, localContext, globalContext) {
        return new Promise(function(done) {
            waterfall(e.value.map(function(mapElement) {
                return function() {
                    var callback = arguments[arguments.length - 1];
                    var acc = (arguments.length > 1) ? arguments[0] : {};
                    if (mapElement.type === Types.MAP_ELEMENT_KEY_VALUE) {
                        Promise.resolve(processExpression(mapElement.value, localContext, globalContext)).then(function(value) {
                            acc[mapElement.key] = value;
                            callback(null, acc);
                        });
                    } else if (mapElement.type === Types.MAP_ELEMENT_ID) {
                        acc[mapElement.id] = utils.read(mapElement.id, localContext);
                        callback(null, acc);
                    } else if (mapElement.type === Types.MAP_ELEMENT_SPREAD) {
                        Promise.resolve(processExpression(mapElement.collection, localContext, globalContext)).then(function(collection) {
                            if (collection instanceof Blobs.MapBlob) {
                                _.assign(acc, collection.mapRep());
                                callback(null, acc);
                            } else {
                                callback(null, acc);
                            }
                        });
                    }
                };
            }), function(err, map) {
                map = map || {};
                done(new Blobs.MapBlob(map));
            });
        });
    },

    [Types.EXPRESSION_FUNCTION]: function(e, localContext, globalContext) {
        let jar = _.assign({}, localContext.jar);
        let partials = _.assign({}, localContext.partials);
        let func = new Blobs.FunctionBlob(e.name, e.params, e.body, jar, partials);
        if(e.name) {
            utils.write(e.name, func, localContext);
        }
        return func;
    },

    [Types.EXPRESSION_MEMBER_INDEX]: function(e, localContext, globalContext) {
        return new Promise(function(done) {
            processExpression(e.root, localContext, globalContext).then(function(root) {
                processExpression(e.index, localContext, globalContext).then(function(index) {
                    if (root instanceof Blobs.ListBlob && index instanceof Blobs.NumberBlob) {
                        done(root.getItem(index.numberRep()) || Constants.BETAL_NULL);
                    } else if (root instanceof Blobs.MapBlob && index instanceof Blobs.StringBlob) {
                        done(root.get(index.value()) || Constants.BETAL_NULL);
                    } else {
                        done(Constants.BETAL_NULL);
                    }
                });
            });
        });
    },

    [Types.EXPRESSION_MEMBER_DOT]: function(e, localContext, globalContext) {
        return new Promise(function(done) {
            processExpression(e.root, localContext, globalContext).then(function(root) {
                if (root instanceof Blobs.MapBlob && root.get(e.key)) {
                    done(root.get(e.key));
                } else {
                    Promise.resolve(globalContext.run("std:" + e.key, [root])).then(done);
                }
            });
        });
    },

    [Types.EXPRESSION_CALL]: function(e, localContext, globalContext) {
        return new Promise(function(done) {
            processExpressions(e.args || [], localContext, globalContext).then(function(args) {
                if (e.target.type === Types.EXPRESSION_MEMBER_DOT) {
                    processExpression(e.target.root, localContext, globalContext).then(function(root) {
                        if (root instanceof Blobs.MapBlob && root.get(e.target.key) instanceof Blobs.FunctionBlob) {
                            root.get(e.target.key).run(args, root, globalContext).then(done);
                        } else {
                            Promise.resolve(globalContext.run("std:" + e.target.key, [root].concat(args))).then(done);
                        }
                    });
                } else {
                    processExpression(e.target, localContext, globalContext).then(function(target) {
                        if (target instanceof Blobs.FunctionBlob) {
                            target.run(args, null, globalContext).then(done);
                        } else {
                            done(Constants.BETAL_NULL);
                        }
                    });
                }
            });
        });
    },

    [Types.EXPRESSION_ID]: function(e, localContext, globalContext) {
        return utils.read(e.id, localContext);
    },

    [Types.EXPRESSION_PUBLIC_ID]: function(e, localContext, globalContext) {
        return new Blobs.FunctionBlob(e.id);
    },

    [Types.EXPRESSION_UNARY_PREFIX_OP]: function(e, localContext, globalContext) {
        return new Promise(function(done) {
            processExpression(e.operand, localContext, globalContext).then(function(operand) {
                if(e.operator === "!") {
                    done(new Blobs.BetalBlob(!operand.isTruthy()));
                } else if(e.operator === '+') {
                    done(operand);
                } else if(e.operator === '-') {
                    done(unaryOps.unaryOpMinus(operand));
                } else {
                    done(Constants.BETAL_NULL);
                }
            });
        });
    },

    [Types.EXPRESSION_BINARY_OP]: function(e, localContext, globalContext) {
        return new Promise(function(done) {
            processExpression(e.left, localContext, globalContext).then(function(left) {
                if (e.operator === "+") {
                    processExpression(e.right, localContext, globalContext).then(function(right) {
                        done(binaryOps.binaryOpPlus(left, right));
                    });
                }  else if(e.operator === "-") {
                    processExpression(e.right, localContext, globalContext).then(function(right) {
                        done(binaryOps.binaryOpMinus(left, right));
                    });
                } else if(e.operator === "*") {
                    processExpression(e.right, localContext, globalContext).then(function(right) {
                        done(binaryOps.binaryOpMultiply(left, right));
                    });
                } else if(e.operator === "/") {
                    processExpression(e.right, localContext, globalContext).then(function(right) {
                        done(binaryOps.binaryOpDivide(left, right));
                    });
                } else if(e.operator === "%") {
                    processExpression(e.right, localContext, globalContext).then(function(right) {
                        done(binaryOps.binaryOpModulo(left, right));
                    });
                } else if(e.operator === "<" || e.operator == "<=") {
                    processExpression(e.right, localContext, globalContext).then(function(right) {
                        done(binaryOps.binaryOpLessThan(left, right, e.operator));
                    });
                } else if(e.operator === ">" || e.operator == ">=") {
                    processExpression(e.right, localContext, globalContext).then(function(right) {
                        done(binaryOps.binaryOpGreaterThan(left, right, e.operator));
                    });
                } else if(e.operator === "==" || e.operator === "!=" || e.operator === "is") {
                    processExpression(e.right, localContext, globalContext).then(function(right) {
                        done(binaryOps.binaryOpCompare(left, right, e.operator));
                    });
                } else if(e.operator === "&&" || e.operator === "and") {
                    if(!left.isTruthy()) {
                        done(left);
                    } else {
                        processExpression(e.right, localContext, globalContext).then(function(right) {
                            done(right);
                        });
                    }
                } else if(e.operator === "||" || e.operator === "or") {
                    if(left.isTruthy()) {
                        done(left);
                    }
                    else {
                        processExpression(e.right, localContext, globalContext).then(function(right) {
                            done(right);
                        });
                    }
                }
                else {
                    done(Constants.BETAL_NULL);
                }
            });
        });
    },

    [Types.EXPRESSION_CONDITIONAL_OP]: function(e, localContext, globalContext) {
        return new Promise(function(done) {
            processExpression(e.condition, localContext, globalContext).then(function(predicate) {
                if(predicate.isTruthy()) {
                    processExpression(e.yes, localContext, globalContext).then(function(result) {
                        done(result);
                    });
                } else {
                    processExpression(e.no, localContext, globalContext).then(function(result) {
                        done(result);
                    });
                }
            });
        });
    },

    [Types.EXPRESSION_ASSIGNMENT]: function(e, localContext, globalContext) {
        return new Promise(function(done) {
            processExpression(e.right, localContext, globalContext).then(function(value) {
                if(e.operator === "=") {
                    processAssignment(e.left, value, localContext, globalContext);
                }
                done(value);
            });
        });
    },

    [Types.EXPRESSION_SEQUENCE]: function(e, localContext, globalContext) {
        return new Promise(function(done) {
            processExpressions(e.expressions || [], localContext, globalContext).then(function(values) {
                if (values.length > 0) {
                    done(values[values.length - 1]);
                } else {
                    done(Constants.BETAL_NULL);
                }
            });

        });
    },

    [Types.EXPRESSION_SPREAD]: function(e, localContext, globalContext) {
        return processExpression(expression.collection, localContext, globalContext);
    }

};


var processExpression = function(e, localContext, globalContext) {
    if (e instanceof Blobs.Blob) {
        return Promise.resolve(e);
    } else if (_.isPlainObject(e)) {
        return Promise.resolve(expressionProcessors[e.type](e, localContext, globalContext));
    } else {
        throw new Error("processExpression not defined for expression " + JSON.stringify(e));
    }
};

var processExpressions = function(expressions, localContext, globalContext) {
    return new Promise(function(done) {
        waterfall(expressions.map(function(expression) {
            return function() {
                var callback = arguments[arguments.length - 1];
                var acc = (arguments.length > 1) ? arguments[0] : [];
                if (expression.type === Types.EXPRESSION_SPREAD) {
                    processExpression(expression.collection, localContext, globalContext).then(function(collection) {
                        if (collection instanceof Blobs.ListBlob) {
                            callback(null, acc.concat(collection.getItems()));
                        } else {
                            callback(null, acc.concat(collection));
                        }
                    });
                } else {
                    processExpression(expression, localContext, globalContext).then(function(value) {
                        callback(null, acc.concat(value));
                    });
                }
            };
        }), function(err, values) {
            values = values || [];
            done(values);
        });
    });
};

var processParams = function(params, args, localContext, globalContext) {
    return new Promise(function(done) {
        waterfall(params.map(function(param, index) {
            return function(next) {
                if (index < args.length) {
                    if (param.type === Types.PARAMETER_MAP) {
                        processAssignment(param.map, args[index], localContext, globalContext);
                    } else {
                        utils.write(param.name, args[index], localContext);
                    }
                    next();
                } else if (param.type === Types.PARAMETER_DEFAULT) {
                    processExpression(param.value, localContext, globalContext).then(function(value) {
                        utils.write(param.name, value, localContext);
                        next();
                    });
                } else {
                    next();
                }
            };
        }), function(err) {
            done();
        });
    });
};

module.exports.processAssignment = processAssignment;

module.exports.processExpression = processExpression;

module.exports.processExpressions = processExpressions;

module.exports.processParams = processParams;
