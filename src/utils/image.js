const optionsUtils = require('../utils/options');

const WHITE_COLOR = { r: 255, g: 255, b: 255, a: 0 };

function isPixelPresent(red, green, blue) {
	return (red + green + blue) / 3 > 255 * 0.5;
}

function modifyPicture(bitmap, options) {
	if (typeof options == 'undefined' || options === null) {
		return bitmap;
	}

	if (optionsUtils.get(options, optionsUtils.OPTION_KEYS.IMAGE_CROP_ENABLED, false)) {
		bitmap = bitmap.crop({
			top: optionsUtils.get(options, optionsUtils.OPTION_KEYS.IMAGE_CROP_TOP, 0),
			left: optionsUtils.get(options, optionsUtils.OPTION_KEYS.IMAGE_CROP_LEFT, 0),
			width: optionsUtils.get(options, optionsUtils.OPTION_KEYS.IMAGE_CROP_WIDTH, bitmap.width),
			height: optionsUtils.get(options, optionsUtils.OPTION_KEYS.IMAGE_CROP_HEIGHT, bitmap.height)
		});
	}

	if (optionsUtils.get(options, optionsUtils.OPTION_KEYS.IMAGE_RESIZE_ENABLED, false)) {
		bitmap = bitmap.resize({
			width: optionsUtils.get(options, optionsUtils.OPTION_KEYS.IMAGE_RESIZE_WIDTH, bitmap.width),
			height: optionsUtils.get(options, optionsUtils.OPTION_KEYS.IMAGE_RESIZE_HEIGHT, bitmap.height),
			fit: optionsUtils.get(options, optionsUtils.OPTION_KEYS.IMAGE_RESIZE_FIT, 'crop'),
			algorithm: optionsUtils.get(options, optionsUtils.OPTION_KEYS.IMAGE_RESIZE_ALGORITHM, 'nearestNeighbor')
		});
	}

	let rotateDegrees = optionsUtils.get(options, optionsUtils.OPTION_KEYS.IMAGE_ROTATE_DEGREES, 0);

	if (optionsUtils.get(options, optionsUtils.OPTION_KEYS.IMAGE_ROTATE_ENABLED, false) && rotateDegrees !== 0) {
		bitmap = bitmap.rotate({
			degrees: rotateDegrees,
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