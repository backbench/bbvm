var Blobs = require("./blobs");

function _value(blob) {

    if (blob instanceof Blobs.BetalBlob) {
        return blob.isTruthy() ? 1 : 0;
    } else if (blob instanceof Blobs.NumberBlob) {
        return blob.numberRep();
    } else if (blob instanceof Blobs.StringBlob) {
        return blob.length();
    } else if (blob instanceof Blobs.ListBlob) {
        return blob.length();
    } else if (blob instanceof Blobs.MapBlob) {
        return blob.length();
    } else if (blob instanceof Blob.FunctionBlob) {
        return 0;
    }

}

module.exports = {

    compare: function(left, right) {
        let result = 0;
        if (left.equals(right)) {
            result = 0;
        } else if (left instanceof Blobs.StringBlob && right instanceof Blobs.StringBlob) {
            result = (left.value() > right.value() ? 1 : -1);
        } else {
            let lValue = _value(left);
            let rValue = _value(right);
            if(lValue === rValue) {
                result = 0;
            } else {
                result = (lValue > rValue ? 1 : -1);
            }
        }
        return result;
    }

};