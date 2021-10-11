const optionsUtils = require('../utils/options');

const ARRAY_ELEMENT_PER_ROW = 8;

function createCHeaderContent(options) {
	let headerContent = '';

	if (!optionsUtils.has(options, optionsUtils.OPTION_KEYS.CPP_VARIABLE_NAME)) {
		return headerContent;
	}

	headerContent += '// Proceduraly generated file, please do not edit it directly!\n\n';
	headerContent += 'extern const unsigned char ';
	headerContent += optionsUtils.get(options, optionsUtils.OPTION_KEYS.CPP_VARIABLE_NAME) + '[];';
	headerContent += '\n';

	return headerContent;
}

function createCMainContent(hexaPixelArray, options) {
	let headerContent = '',
		cppFileName = optionsUtils.get(options, optionsUtils.OPTION_KEYS.TARGET_CPP_FILENAME);

	if (!optionsUtils.has(options, optionsUtils.OPTION_KEYS.CPP_VARIABLE_NAME)) {
		return headerContent;
	}

	headerContent += '// Proceduraly generated file, please do not edit it directly!\n\n';
	headerContent += '#include "' + cppFileName + '.h"\n';
	headerContent += '#include <avr/pgmspace.h>\n';
	headerContent += '\n';
	headerContent += 'const unsigned char ';
	headerContent += optionsUtils.get(options, optionsUtils.OPTION_KEYS.CPP_VARIABLE_NAME) + '[] PROGMEM = {\n';

	let part,
		remainingElementPcs = hexaPixelArray.length % ARRAY_ELEMENT_PER_ROW,
		partArray = [];

	for (part = 0; part + ARRAY_ELEMENT_PER_ROW <= hexaPixelArray.length; part += ARRAY_ELEMENT_PER_ROW) {
		let hexaSubArray = hexaPixelArray.slice(part, part + ARRAY_ELEMENT_PER_ROW);

		partArray.push('\t' + hexaSubArray.join(', '));
	}

	if (remainingElementPcs !== 0) {
		let hexaSubArray = hexaPixelArray.slice(part);

		partArray.push('\t' + hexaSubArray.join(', '));
	}

	headerContent += partArray.join(',\n');
	headerContent += '\n};\n';

	return headerContent;
}

module.exports = {
	createCHeaderContent: createCHeaderContent,
	createCMainContent: createCMainContent
};