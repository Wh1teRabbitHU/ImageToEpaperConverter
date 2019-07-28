'use strict';

const path         = require('path');
const ImageJS      = require('imagejs');
const imageUtils   = require('../utils/image');
const fileUtils    = require('../utils/file');
const numberUtils  = require('../utils/number');
const optionsUtils = require('../utils/options');
const cppUtils       = require('../utils/cpp');

async function convert(options = {}) {
	let bitmap = new ImageJS.Bitmap(),
		sourceFile = optionsUtils.get(options, optionsUtils.OPTION_KEYS.SOURCE_FILE),
		targetFolder = optionsUtils.get(options, optionsUtils.OPTION_KEYS.TARGET_FOLDER),
		targetFilename = optionsUtils.get(options, optionsUtils.OPTION_KEYS.TARGET_TEXT_FILENAME),
		targetCppFilename = optionsUtils.get(options, optionsUtils.OPTION_KEYS.TARGET_CPP_FILENAME),
		returnArray = optionsUtils.get(options, optionsUtils.OPTION_KEYS.RETURN_ARRAY, false);

	try {
		await fileUtils.isFileReadable(sourceFile);
		await bitmap.readFile(sourceFile);

		bitmap = imageUtils.modifyPicture(bitmap, options);

		let tasks = optionsUtils.get(options, optionsUtils.OPTION_KEYS.TASKS, 'binary');

		if (Array.isArray(tasks) && returnArray) {
			throw "can only return Array of one task!";
		}

		if (!Array.isArray(tasks)) {
			tasks = [ tasks ];
		}

		let fileContent = '',
			cppHeaderFileContent = '',
			cppMainFileContent = '',
			binaryPixelArray, hexaPixelArray = null;

		tasks.forEach((task) => {
			if (fileContent !== '') {
				fileContent += '\n\n';
			}

			switch (task) {
				case 'binary':
					binaryPixelArray = numberUtils.getBinaryPixelArray(bitmap, options);

					if (!returnArray) fileContent += numberUtils.getBinaryPixelArrayString(binaryPixelArray);
					break;
				case 'hexadecimal':
					hexaPixelArray = numberUtils.getHexaPixelArray(bitmap, options);

					if (!returnArray) fileContent += numberUtils.getHexaPixelArrayString(hexaPixelArray);
					break;
				case 'hexadecimal_cpp':
					hexaPixelArray = numberUtils.getHexaPixelArray(bitmap, options);

					if (!returnArray) cppHeaderFileContent = cppUtils.createCHeaderContent(options);
					if (!returnArray) cppMainFileContent = cppUtils.createCMainContent(hexaPixelArray, options);
					break;
				default:
					break;
			}
		});

		if (fileContent !== '') {
			await fileUtils.writeContentToFile(path.join(targetFolder, targetFilename), fileContent);
		}

		if (cppHeaderFileContent !== '' && cppMainFileContent !== '') {
			let targetCppFileRoot = path.join(targetFolder, targetCppFilename);

			await fileUtils.writeContentToFile(targetCppFileRoot + fileUtils.EXTENSIONS.CPP_HEADER, cppHeaderFileContent);
			await fileUtils.writeContentToFile(targetCppFileRoot + fileUtils.EXTENSIONS.CPP_MAIN, cppMainFileContent);
		}

		if (!returnArray) console.log('Successfully converted the given image file! Source file: ' + sourceFile, ', target folder: ' + targetFolder);
		if (returnArray && binaryPixelArray) return binaryPixelArray;
		if (returnArray && hexaPixelArray) return hexaPixelArray;
	} catch (err) {
		console.error(err);
	}
}

module.exports = {
	convert: convert
};