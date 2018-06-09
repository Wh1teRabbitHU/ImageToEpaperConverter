'use strict';

const OPTION_KEYS = {
	DISPLAY_WIDTH: 'display.width', // numbers
	DISPLAY_HEIGHT: 'display.height', // numbers
	DISPLAY_FITMODE: 'display.fitmode', // 'none', 'center', 'repeat'
	DISPLAY_COLORMODE: 'display.colormode', // 'normal', 'inverted'

	IMAGE_CROP: 'image.crop',
	IMAGE_CROP_TOP: 'image.crop.top',
	IMAGE_CROP_LEFT: 'image.crop.left',
	IMAGE_CROP_WIDTH: 'image.crop.width',
	IMAGE_CROP_HEIGHT: 'image.crop.height',

	IMAGE_RESIZE: 'image.resize',
	IMAGE_RESIZE_WIDTH: 'image.resize.width',
	IMAGE_RESIZE_HEIGHT: 'image.resize.height',
	IMAGE_RESIZE_FIT: 'image.resize.fit',
	IMAGE_RESIZE_ALGORITHM: 'image.resize.algorithm',

	IMAGE_ROTATE: 'image.rotate',
	IMAGE_ROTATE_DEGREES: 'image.rotate.degrees',
	IMAGE_ROTATE_FIT: 'image.rotate.fit',
	IMAGE_ROTATE_PADCOLOR: 'image.rotate.padcolor'
};

function has(options, key) {
	return typeof get(options, key) != 'undefined';
}

function get(options, key, defaultValue) {
	if (typeof options == 'undefined') {
		return defaultValue;
	}

	if (key.indexOf('.') === -1) {
		return options[key] || defaultValue;
	}

	let keyParts = key.split('.');

	return get(options[keyParts[0]], keyParts.slice(1).join('.'), defaultValue);
}

module.exports = {
	has: has,
	get: get,

	OPTION_KEYS: OPTION_KEYS
};