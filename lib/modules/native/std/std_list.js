"use strict";

var _ = require("lodash");
var Blobs = require("../../../blob/blobs");
var Constants = require("../../../blob/constants");

module.exports = {

    "std:head": "std:first",
    "std:first": function(args) {
        if(args.length >= 1) {
            if(args[0] instanceof Blobs.ListBlob) {
                return _.first(args[0].getItems());
            }
        }
    },

    "std:last": function(args) {
        if(args.length >= 1) {
            if(args[0] instanceof Blobs.ListBlob) {
                return _.last(args[0].getItems());
            }
        }
    },

    "std:tail": function(args) {
        if(args.length >= 1) {
            if(args[0] instanceof Blobs.ListBlob) {
                return new Blobs.ListBlob(_.tail(args[0].getItems()));
            }
        }
    },

    "std:reverse": function(args) {
        if(args.length >= 1) {
            if(args[0] instanceof Blobs.ListBlob) {
                return new Blobs.ListBlob(_.reverse(args[0].getItems()));
            }
        }
    },

    "std:chunk": function(args) {
        let size = 1;
        if(args.length > 1 && args[1] instanceof Blobs.NumberBlob) {
            size = args[1].numberRep();
        }
        if(args.length > 0 && args[0] instanceof Blobs.ListBlob) {
            return new Blobs.ListBlob(_.chunk(args[0].getItems(), size).map(chunk => new Blobs.ListBlob(chunk)));
        }
    },

    "std:concat": function(args) {
        if(args.length > 1 && args[0] instanceof Blobs.ListBlob) {
            return _.tail(args).reduce(function(acc, arg) {
                return acc.concat(arg instanceof Blobs.ListBlob ? arg : new Blobs.ListBlob([arg]));
            }, args[0]);
        } else if(args.length > 0 && args[0] instanceof Blobs.ListBlob) {
            return args[0];
        }
    },

    "std:indexOf": function(args) {
        if(args.length > 1 && args[0] instanceof Blobs.ListBlob) {
            return new Blobs.NumberBlob(_.findIndex(args[0].getItems(), args[1]));
        }
    },

    "std:union": function(args) {
        let items = _.map(args, arg => arg instanceof Blobs.ListBlob ? arg.getItems() : [arg]);
        return new Blobs.ListBlob(_.unionWith(...items, (a, b) => a.equals(b)));
    },

    "std:intersection": function(args) {
        let items = _.map(args, arg => arg instanceof Blobs.ListBlob ? arg.getItems() : [arg]);
        return new Blobs.ListBlob(_.intersectionWith(...items, (a, b) => a.equals(b)));
    },

    "std:join": function(args) {
        if(args.length > 0 && args[0] instanceof Blobs.ListBlob) {
            let separator = (args.length > 1 && args[1] instanceof Blobs.StringBlob) ? args[1].value() : ',';
            let list = args[0].getItems().map(item => item instanceof Blobs.StringBlob ? item.value() : item.stringRep());
            return new Blobs.StringBlob(list.join(separator));
        }
    },

    "std:fromPairs": function(args) {
        if(args.length > 0 && args[0] instanceof Blobs.ListBlob) {
            let result = {};
            args[0]
                .getItems()
                .filter(item => item instanceof Blobs.ListBlob)
                .map(item => {
                    if(item.length() > 1 && item.getItem(0) instanceof Blobs.StringBlob) {
                        result[item.getItem(0).value()] = item.getItem(1);
                    } else if(item.length() > 0 && item.getItem(0) instanceof Blobs.StringBlob) {
                        result[item.getItem(0).value()] = Constants.BETAL_NULL;
                    }
                });
            return new Blobs.MapBlob(result);
        }
    },

    "std:sort": function(args, globalContext) {
        if(args.length > 1 && args[0] instanceof Blobs.ListBlob && args[1] instanceof Blobs.FunctionBlob) {
            return new Promise(function(done) {
                let result = args[0].getItems().map((item, index) => args[1].run([item, new Blobs.NumberBlob(index), args[0]], null, globalContext));
                let resultIndex = -1;
                Promise.all(result).then(function(values) {
                    let temp = args[0].getItems();
                    let temp2 = _.sortBy(temp, function(currentValue) {
                        resultIndex++;
                        if(values[resultIndex] instanceof Blobs.NumberBlob)
                            return values[resultIndex].numberRep();
                        else if(values[resultIndex] instanceof Blobs.StringBlob)
                            return values[resultIndex].value();
                        else if(values[resultIndex] instanceof Blobs.BetalBlob)
                            return values[resultIndex].json();
                        else
                            return values[resultIndex].stringRep();
                    });
                    done(new Blobs.ListBlob(temp2));
                });
            });
        } else if(args.length > 0 && args[0] instanceof Blobs.ListBlob) {
            console.log(JSON.stringify(args[0].getItems().map(x => x.stringRep()), null, 3));
            return new Blobs.ListBlob(_.sortBy(args[0].getItems(), item => {
                if(item instanceof Blobs.StringBlob)
                    return item.value();
                else
                    return item.stringRep()
            }))
        }
    }
};