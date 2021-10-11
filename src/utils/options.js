const OPTION_KEYS = {
	SOURCE_STREAM: 'source_stream', // Source stream
	SOURCE_FILE: 'source_file', // Source file
	TARGET_FOLDER: 'target_folder', // Target folder path
	TARGET_TEXT_FILENAME: 'target_text_filename', // Target filename, placed in the target folder
	TARGET_CPP_FILENAME: 'target_cpp_filename', // Filename wothout extension, placed in the target folder
	SAVE_TO_FILE: 'save_to_file', // This option will determine if it's going to save the output to file or not
	CPP_VARIABLE_NAME: 'cpp_variable_name', // Filename wothout extension, placed in the target folder
	TASKS: 'tasks', // 'binary', 'hexadecimal', 'hexadecimal_cpp'

	DISPLAY_WIDTH: 'display.width', // numbers
	DISPLAY_HEIGHT: 'display.height', // numbers
	DISPLAY_FITMODE: 'display.fitmode', // 'none', 'center', 'repeat'
	DISPLAY_FILLMODE: 'display.fillmode', // 'normal', 'inverted'
	DISPLAY_COLORMODE: 'display.colormode', // 'normal', 'inverted'

	IMAGE_CROP: 'image.crop',
	IMAGE_CROP_ENABLED: 'image.crop.enabled',
	IMAGE_CROP_TOP: 'image.crop.top',
	IMAGE_CROP_LEFT: 'image.crop.left',
	IMAGE_CROP_WIDTH: 'image.crop.width',
	IMAGE_CROP_HEIGHT: 'image.crop.height',

	IMAGE_RESIZE: 'image.resize',
	IMAGE_RESIZE_ENABLED: 'image.resize.enabled',
	IMAGE_RESIZE_WIDTH: 'image.resize.width',
	IMAGE_RESIZE_HEIGHT: 'image.resize.height',
	IMAGE_RESIZE_FIT: 'image.resize.fit',
	IMAGE_RESIZE_ALGORITHM: 'image.resize.algorithm',

	IMAGE_ROTATE: 'image.rotate',
	IMAGE_ROTATE_ENABLED: 'image.rotate.enabled',
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
		if (typeof options[key] == 'undefined') {
			return defaultValue;
		}

		return options[key];
	}

	let keyParts = key.split('.');

	return get(options[keyParts[0]], keyParts.slice(1).join('.'), defaultValue);
}

module.exports = {
	has: has,
	get: get,

	OPTION_KEYS: OPTION_KEYS
};