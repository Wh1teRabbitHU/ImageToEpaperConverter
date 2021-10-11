const fs = require('fs');

const EXTENSIONS = {
	CPP_HEADER: '.h',
	CPP_MAIN: '.cpp'
};

async function isFileReadable(file) {
	return new Promise((resolve, reject) => {
		fs.access(file, fs.constants.R_OK, (err) => {
			if (err) {
				reject(err);
			}

			resolve();
		});
	});
}

async function writeContentToFile(file, text) {
	return new Promise((resolve, reject) => {
		fs.writeFile(file, text, 'utf8', (err) => {
			if (err) {
				reject(err);
			}

			resolve();
		});
	});
}

module.exports = {
	isFileReadable: isFileReadable,
	writeContentToFile: writeContentToFile,

	EXTENSIONS: EXTENSIONS
};