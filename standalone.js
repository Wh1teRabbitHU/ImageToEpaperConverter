'use strict';

const converter = require('./src/standalone');
const options = require('./options/default.json');

converter.init(options);

converter.convert();