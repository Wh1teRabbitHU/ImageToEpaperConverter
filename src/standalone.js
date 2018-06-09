'use strict';

const argsReader = require('./helpers/args-reader');
const converter  = require('./handlers/converter');

const sourceFile = argsReader.get(argsReader.ARG_KEYS.SOURCE);
const targetFile = argsReader.get(argsReader.ARG_KEYS.TARGET);

let options;

module.exports = {
	init: (opt) => {
		options = opt;
	},
	convert: () => {
		converter.convert(sourceFile, targetFile, options);
	}
};