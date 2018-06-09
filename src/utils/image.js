'use strict';

const WHITE_COLOR = { r: 255, g: 255, b: 255, a: 0 };

function isPixelPresent(red, green, blue) {
	return (red + green + blue) / 3 > 255 * 0.5;
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
			algorithm: options.resize.algorithm || 'nearestNeighbor'
		});
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

module.exports = {
	isPixelPresent: isPixelPresent,
	modifyPicture: modifyPicture
};