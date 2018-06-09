'use strict';

const argsReader = require('./helpers/args-reader');
const converter  = require('./handlers/converter');

const SRC_FILE_KEY = 'src';
const TARGET_FILE_KEY = 'target';

const srcFile = argsReader.get(SRC_FILE_KEY);
const targetFile = argsReader.get(TARGET_FILE_KEY);

let options;

module.exports = {
	init: (opt) => {
		options = opt;
	},
	convert: () => {
		converter.convert(srcFile, targetFile, options);
	}
};