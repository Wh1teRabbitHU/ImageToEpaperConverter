const imageUtils   = require('../utils/image');
const optionsUtils = require('../utils/options');

const COLORED_FLAG = 0;
const WHITE_FLAG = 1;

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

function getBinaryPixelArray(bitmap, options = {}) {
	let pixelArray = [],
		maxWidth = bitmap.width,
		maxHeight = bitmap.height,
		columnOffset = 0,
		rowOffset = 0,
		fitMode = optionsUtils.get(options, optionsUtils.OPTION_KEYS.DISPLAY_FITMODE, 'none'),
		fillMode = optionsUtils.get(options, optionsUtils.OPTION_KEYS.DISPLAY_FILLMODE, 'normal'),
		colorMode = optionsUtils.get(options, optionsUtils.OPTION_KEYS.DISPLAY_COLORMODE, 'normal');

	if (optionsUtils.has(options, optionsUtils.OPTION_KEYS.DISPLAY_WIDTH)) {
		maxWidth = optionsUtils.get(options, optionsUtils.OPTION_KEYS.DISPLAY_WIDTH);
	}

	if (optionsUtils.has(options, optionsUtils.OPTION_KEYS.DISPLAY_HEIGHT)) {
		maxHeight = optionsUtils.get(options, optionsUtils.OPTION_KEYS.DISPLAY_HEIGHT);
	}

	if (fitMode === 'center') {
		if (maxWidth > bitmap.width) {
			rowOffset = (maxWidth - bitmap.width) / 2;
		}

		if (maxHeight > bitmap.height) {
			columnOffset = (maxHeight - bitmap.height) / 2;
		}
	}

	for (let column = 0; column < maxHeight; column++) {
		let rowArray = [];

		for (let row = 0; row < maxWidth; row++) {
			let x = row,
				y = column;

			if (fitMode === 'center') {
				if (x < rowOffset || x > rowOffset + bitmap.width || y < columnOffset || y > columnOffset + bitmap.height) {
					rowArray.push(fillMode === 'normal' ? WHITE_FLAG : COLORED_FLAG);

					continue;
				} else {
					x -= rowOffset;
					y -= columnOffset;
				}
			} else if (bitmap.width < x || bitmap.height < y) {
				if (fitMode === 'none') {
					rowArray.push(fillMode === 'normal' ? WHITE_FLAG : COLORED_FLAG);

					continue;
				} else if (fitMode === 'repeat') {
					x = bitmap.width < x ? x % bitmap.width : x;
					y = bitmap.height < y ? y % bitmap.height : y;
				}
			}

			let coloredFlag = colorMode === 'normal' ? COLORED_FLAG : WHITE_FLAG,
				whiteFlag = colorMode === 'normal' ? WHITE_FLAG : COLORED_FLAG;

			let pixel = bitmap.getPixel(x, y),
				binaryPixel = imageUtils.isPixelPresent(pixel.r, pixel.g, pixel.b) ? coloredFlag : whiteFlag;

			rowArray.push(binaryPixel);
		}

		pixelArray.push(rowArray);
	}

	return pixelArray;
}

function getHexaPixelArray(bitmap, options = {}) {
	let binaryPixelArray = getBinaryPixelArray(bitmap, options),
		pixelArray = [];

	for (let rowIndex = 0; rowIndex < binaryPixelArray.length; rowIndex++) {
		let column;

		for (column = 0; column + 8 <= binaryPixelArray[rowIndex].length; column += 8) {
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

module.exports = {
	getBinaryPixelArrayString: getBinaryPixelArrayString,
	getHexaPixelArrayString: getHexaPixelArrayString,
	getBinaryPixelArray: getBinaryPixelArray,
	getHexaPixelArray: getHexaPixelArray
};