'use strict';

const optionsUtils = require('../utils/options');

const WHITE_COLOR = { r: 255, g: 255, b: 255, a: 0 };

function isPixelPresent(red, green, blue) {
	return (red + green + blue) / 3 > 255 * 0.5;
}

function modifyPicture(bitmap, options) {
	if (typeof options == 'undefined' || options === null) {
		return bitmap;
	}

	if (optionsUtils.has(options, optionsUtils.OPTION_KEYS.IMAGE_CROP)) {
		bitmap = bitmap.crop({
			top: optionsUtils.get(options, optionsUtils.OPTION_KEYS.IMAGE_CROP_TOP, 0),
			left: optionsUtils.get(options, optionsUtils.OPTION_KEYS.IMAGE_CROP_LEFT, 0),
			width: optionsUtils.get(options, optionsUtils.OPTION_KEYS.IMAGE_CROP_WIDTH, bitmap.width),
			height: optionsUtils.get(options, optionsUtils.OPTION_KEYS.IMAGE_CROP_HEIGHT, bitmap.height)
		});
	}

	if (optionsUtils.has(options, optionsUtils.OPTION_KEYS.IMAGE_RESIZE)) {
		bitmap = bitmap.resize({
			width: optionsUtils.get(options, optionsUtils.OPTION_KEYS.IMAGE_RESIZE_WIDTH, bitmap.width),
			height: optionsUtils.get(options, optionsUtils.OPTION_KEYS.IMAGE_RESIZE_HEIGHT, bitmap.height),
			fit: optionsUtils.get(options, optionsUtils.OPTION_KEYS.IMAGE_RESIZE_FIT, 'crop'),
			algorithm: optionsUtils.get(options, optionsUtils.OPTION_KEYS.IMAGE_RESIZE_ALGORITHM, 'nearestNeighbor')
		});
	}

	if (optionsUtils.has(options, optionsUtils.OPTION_KEYS.IMAGE_ROTATE)) {
		bitmap = bitmap.rotate({
			degrees: optionsUtils.get(options, optionsUtils.OPTION_KEYS.IMAGE_ROTATE_DEGREES, 0),
			fit: optionsUtils.get(options, optionsUtils.OPTION_KEYS.IMAGE_ROTATE_FIT, 'crop'),
			padColor: optionsUtils.get(options, optionsUtils.OPTION_KEYS.IMAGE_ROTATE_PADCOLOR, WHITE_COLOR)
		});
	}

	return bitmap;
}

module.exports = {
	isPixelPresent: isPixelPresent,
	modifyPicture: modifyPicture
};