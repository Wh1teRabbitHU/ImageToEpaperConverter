'use strict';

const ARG_SEPARATOR = '=';

let args = [];

// Initializing the input arguments. Only key-value pairs are allowed
process.argv.forEach((val) => {
    if (val.indexOf(ARG_SEPARATOR) !== -1) {
        let keyValue = val.split(ARG_SEPARATOR);

        args[keyValue[0]] = keyValue[1];
    }
});

module.exports = {
    arguments: () => args,
    get: (key) => args[key]
}