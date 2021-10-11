const converter  = require('./handlers/converter');

let options;

module.exports = {
	init: (opt) => {
		options = opt;
	},
	convert: () => {
		converter.convert(options);
	}
};