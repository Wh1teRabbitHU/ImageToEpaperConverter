'use strict';

const fs      = require('fs');
const ImageJS = require("imagejs");

const WHITE_COLOR = { r: 255, g: 255, b: 255, a: 0 };

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
				content += '\n\n'
			}

			content += getHexaPixelArrayString(hexaPixelArray);
		}

		fs.writeFile(file, content, 'utf8', (err) => {
			if (err) {
				reject(err);
			}

			resolve();
		})
	});
}

function isPixelPresent(red, green, blue) {
	return (red + green + blue) / 3 > (255 * 0.5);
}

function modifyPicture(bitmap, options) {
	if (typeof options == 'undefined' || options === null) {
		return bitmap;
	}

	if (typeof options.crop != 'undefined') {
		bitmap = bitmap.crop({
			top: options.crop.top || 0,
			left: options.crop.left || 0,
			width: options.crop.width || bitmap.width,
			height: options.crop.height || bitmap.height
		});
	}

	if (typeof options.resize != 'undefined') {
		bitmap = bitmap.resize({
			width: options.resize.width || bitmap.width,
			height: options.resize.height || bitmap.height,
			fit: options.resize.fit || 'crop',
			algorithm: options.resize.algorithm || "nearestNeighbor"
		})
	}

	if (typeof options.rotate != 'undefined') {
		bitmap = bitmap.rotate({
			degrees: options.rotate.degrees,
			fit: options.rotate.fit || 'crop',
			padColor: options.rotate.padColor || WHITE_COLOR
		});
	}

	return bitmap;
}

function getBinaryPixelArray(bitmap) {
	let pixelArray = [];

	for (let row = 0; row < bitmap.width; row++) {
		let rowArray = [];

		for (let column = 0; column < bitmap.height; column++) {
			let pixel = bitmap.getPixel(column, row),
				binaryPixel = isPixelPresent(pixel.r, pixel.g, pixel.b) ? 1 : 0;

			rowArray.push(binaryPixel);
		}

		pixelArray.push(rowArray);
	}

	return pixelArray;
}

function getHexaPixelArray(bitmap) {
	let binaryPixelArray = getBinaryPixelArray(bitmap),
		pixelArray = [];

	for (let rowIndex = 0; rowIndex < binaryPixelArray.length; rowIndex++) {
		let column;

		for (column = 0; column < binaryPixelArray[rowIndex].length; column += 8) {
			let binaryArray = binaryPixelArray[rowIndex].slice(column, column + 8);

			pixelArray.push(convertBinaryArrayToHexaString(binaryArray));
		}

		let remainingBinaries = binaryPixelArray[rowIndex].length % 8;

		if (remainingBinaries !== 0) {
			let binaryArray = binaryPixelArray[rowIndex].slice(column);
			
			for (let i = 0; i < remainingBinaries; i++) {
				binaryArray.push(0);
			}

			pixelArray.push(convertBinaryArrayToHexaString(binaryArray));
		}
	}

	return pixelArray;
}

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

function convertBinaryArrayToHexaString(binaryArray) {
	let binaryString = binaryArray.join(''),
		binaryNumber = parseInt(binaryString, 2),
		hexaString = '0X' + ('0' + (Number(binaryNumber).toString(16))).slice(-2).toUpperCase();

	return hexaString;
}

async function convert(src, target, options = {}) {
	let bitmap = new ImageJS.Bitmap();

	try {
		await isFileReadable(src);
		await bitmap.readFile(src);

		bitmap = modifyPicture(bitmap, options);

		let binaryPixelArray, hexaPixelArray = null;

		if (!options.excludeBinary) {
			binaryPixelArray = getBinaryPixelArray(bitmap);
		}

		if (!options.excludeHexa) {
			hexaPixelArray = getHexaPixelArray(bitmap);
		}

		await writePixelArrayToFile(target, binaryPixelArray, hexaPixelArray);

		console.log('Successfully converted the given image file! Source: ' + src, ', target: ' + target);
	} catch (err) {
		console.error(err);
	}
}

module.exports = {
	convert: convert
};