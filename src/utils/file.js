'use strict';

const fs = require('fs');

function getBinaryPixelArrayString(pixelArray) {
	let pixelArrayString = '';

	pixelArray.forEach((row) => {
		pixelArrayString += row.join(',') + '\n';
	});

	return pixelArrayString;
}

function getHexaPixelArrayString(pixelArray) {
	return pixelArray.join(',');
}

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

async function writePixelArrayToFile(file, binaryPixelArray = null, hexaPixelArray = null) {
	return new Promise((resolve, reject) => {
		let content = '';

		if (binaryPixelArray !== null) {
			content += getBinaryPixelArrayString(binaryPixelArray);
		}

		if (hexaPixelArray !== null) {
			if (binaryPixelArray !== null) {
				content += '\n\n';
			}

			content += getHexaPixelArrayString(hexaPixelArray);
		}

		fs.writeFile(file, content, 'utf8', (err) => {
			if (err) {
				reject(err);
			}

			resolve();
		});
	});
}

module.exports = {
	isFileReadable: isFileReadable,
	writePixelArrayToFile: writePixelArrayToFile
};