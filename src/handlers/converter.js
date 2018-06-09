'use strict';

const ImageJS    = require('imagejs');
const imageUtils = require('../utils/image');
const fileUtils  = require('../utils/file');

function getBinaryPixelArray(bitmap) {
	let pixelArray = [];

	for (let row = 0; row < bitmap.width; row++) {
		let rowArray = [];

		for (let column = 0; column < bitmap.height; column++) {
			let pixel = bitmap.getPixel(column, row),
				binaryPixel = imageUtils.isPixelPresent(pixel.r, pixel.g, pixel.b) ? 1 : 0;

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

function convertBinaryArrayToHexaString(binaryArray) {
	let binaryString = binaryArray.join(''),
		binaryNumber = parseInt(binaryString, 2),
		hexaString = '0X' + ('0' + Number(binaryNumber).toString(16)).slice(-2).toUpperCase();

	return hexaString;
}

async function convert(sourceFile, target, options = {}) {
	let bitmap = new ImageJS.Bitmap();

	try {
		await fileUtils.isFileReadable(sourceFile);
		await bitmap.readFile(sourceFile);

		bitmap = imageUtils.modifyPicture(bitmap, options);

		let binaryPixelArray, hexaPixelArray = null;

		if (!options.excludeBinary) {
			binaryPixelArray = getBinaryPixelArray(bitmap);
		}

		if (!options.excludeHexa) {
			hexaPixelArray = getHexaPixelArray(bitmap);
		}

		await fileUtils.writePixelArrayToFile(target, binaryPixelArray, hexaPixelArray);

		console.log('Successfully converted the given image file! Source: ' + sourceFile, ', target: ' + target);
	} catch (err) {
		console.error(err);
	}
}

module.exports = {
	convert: convert
};