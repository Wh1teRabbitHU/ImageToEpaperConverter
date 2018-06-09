'use strict';

const argsReader = require('./src/args-reader');
const converter  = require('./src/converter');

const SRC_FILE_KEY = 'src';
const TARGET_FILE_KEY = 'target';

const srcFile = argsReader.get(SRC_FILE_KEY);
const targetFile = argsReader.get(TARGET_FILE_KEY);

// 296x128
converter.convert(srcFile, targetFile, {
    resize: {
        width: 128,
        height: 128
    }
});