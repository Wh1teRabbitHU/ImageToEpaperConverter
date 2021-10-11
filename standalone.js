const argsReader = require('./src/helpers/args-reader');
const converter  = require('./src/standalone');

const optionsPath = argsReader.get(argsReader.ARG_KEYS.OPTIONS_PATH);
const targetTask = argsReader.get(argsReader.ARG_KEYS.TASK);

let options;

if (typeof optionsPath == 'undefined') {
	options = require('./options/default.json'); // eslint-disable-line
} else {
	options = require(optionsPath); // eslint-disable-line
}

converter.init(options);

if (typeof targetTask == 'undefined') {
	converter.convert();
} else {
	switch (targetTask) {
		case 'convert':
			converter.convert();
			break;
		default:
			throw new Error('Not a valid task!');
	}
}