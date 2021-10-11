const ARG_KEYS = {
	OPTIONS_PATH: 'options_path',
	TASK: 'task',
	SOURCE: 'source',
	TARGET: 'target',
	SEPARATOR: '='
};

let args = [];

// Initializing the input arguments. Only key-value pairs are allowed
process.argv.forEach((val) => {
	if (val.indexOf(ARG_KEYS.SEPARATOR) !== -1) {
		let keyValue = val.split(ARG_KEYS.SEPARATOR);

		args[keyValue[0]] = keyValue[1];
	}
});

module.exports = {
	arguments: () => args,
	get: (key) => args[key],

	ARG_KEYS: ARG_KEYS
};