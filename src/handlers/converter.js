const path         = require('path');
const ImageJS      = require('imagejs');
const imageUtils   = require('../utils/image');
const fileUtils    = require('../utils/file');
const numberUtils  = require('../utils/number');
const optionsUtils = require('../utils/options');
const cppUtils     = require('../utils/cpp');

async function convert(options = {}) {
	let bitmap = new ImageJS.Bitmap(),
		sourceStream = optionsUtils.get(options, optionsUtils.OPTION_KEYS.SOURCE_STREAM, null),
		sourceFile = optionsUtils.get(options, optionsUtils.OPTION_KEYS.SOURCE_FILE, ''),
		targetFolder = optionsUtils.get(options, optionsUtils.OPTION_KEYS.TARGET_FOLDER, 'target'),
		targetFilename = optionsUtils.get(options, optionsUtils.OPTION_KEYS.TARGET_TEXT_FILENAME),
		targetCppFilename = optionsUtils.get(options, optionsUtils.OPTION_KEYS.TARGET_CPP_FILENAME),
		saveToFile = optionsUtils.get(options, optionsUtils.OPTION_KEYS.SAVE_TO_FILE, true);

	try {
		if (sourceStream === null) {
			await fileUtils.isFileReadable(sourceFile);
			await bitmap.readFile(sourceFile);
		} else {
			await bitmap.read(sourceStream);
		}

		bitmap = imageUtils.modifyPicture(bitmap, options);

		let tasks = optionsUtils.get(options, optionsUtils.OPTION_KEYS.TASKS, 'binary');

		if (!Array.isArray(tasks)) {
			tasks = [ tasks ];
		}

		let fileContent = '',
			cppHeaderFileContent = '',
			cppMainFileContent = '',
			binaryPixelArray = null,
			hexaPixelArray = null,
			output = { succeeded: true };

		tasks.forEach((task) => {
			if (fileContent !== '') {
				fileContent += '\n\n';
			}

			switch (task) {
				case 'binary':
					binaryPixelArray = numberUtils.getBinaryPixelArray(bitmap, options);

					output.binary = binaryPixelArray;

					fileContent += numberUtils.getBinaryPixelArrayString(binaryPixelArray);
					break;
				case 'hexadecimal':
					hexaPixelArray = numberUtils.getHexaPixelArray(bitmap, options);

					output.hexadecimal = hexaPixelArray.map(num => parseInt(num, 16));
					output.hexadecimalString = hexaPixelArray;

					fileContent += numberUtils.getHexaPixelArrayString(hexaPixelArray);
					break;
				case 'hexadecimal_cpp':
					hexaPixelArray = numberUtils.getHexaPixelArray(bitmap, options);

					output.hexadecimal = hexaPixelArray.map(num => parseInt(num, 16));
					output.hexadecimalString = hexaPixelArray;

					cppHeaderFileContent = cppUtils.createCHeaderContent(options);
					cppMainFileContent = cppUtils.createCMainContent(hexaPixelArray, options);
					break;
				default:
					break;
			}
		});

		if (saveToFile && fileContent !== '') {
			await fileUtils.writeContentToFile(path.join(targetFolder, targetFilename), fileContent);
		}

		if (saveToFile && cppHeaderFileContent !== '' && cppMainFileContent !== '') {
			let targetCppFileRoot = path.join(targetFolder, targetCppFilename);

			await fileUtils.writeContentToFile(targetCppFileRoot + fileUtils.EXTENSIONS.CPP_HEADER, cppHeaderFileContent);
			await fileUtils.writeContentToFile(targetCppFileRoot + fileUtils.EXTENSIONS.CPP_MAIN, cppMainFileContent);
		}

		console.log('Successfully converted the given image file! Source file: ' + sourceFile, ', target folder: ' + targetFolder);

		return output;
	} catch (error) {
		console.error(error);

		return { succeeded: false, error };
	}
}

module.exports = {
	convert: convert
};