'use strict';

const ImageJS     = require('imagejs');
const imageUtils  = require('../utils/image');
const fileUtils   = require('../utils/file');
const numberUtils = require('../utils/number');

async function convert(sourceFile, target, options = {}) {
	let bitmap = new ImageJS.Bitmap();

	try {
		await fileUtils.isFileReadable(sourceFile);
		await bitmap.readFile(sourceFile);

		bitmap = imageUtils.modifyPicture(bitmap, options);

		let binaryPixelArray, hexaPixelArray = null;

		if (!options.excludeBinary) {
			binaryPixelArray = numberUtils.getBinaryPixelArray(bitmap, options);
		}

		if (!options.excludeHexa) {
			hexaPixelArray = numberUtils.getHexaPixelArray(bitmap, options);
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