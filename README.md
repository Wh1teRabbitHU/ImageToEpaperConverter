# ImageToEpaperConverter

Utility tool for WaveShare's e-paper modules. It can convert any jpg, bmp or png to binary, hexadecimal array or directly to a fully usable cpp file with header.

# How it's working?

I made this tool specifically for my 2.9" WaveShare's e-paper module. This display cannot work with normal image data, you must convert your image file into a single dimensional hexadecimal array format. The following two step required to achieve this:

First you need to convert all the picture's pixels into a binary array. (Black dots are ones, white ones are zeros, but you can invert it with an option flag). The second step is to join all the created numbers into a single string and slice it into 8 bit length parts. After that it has to convert into a specific hexadecimal format. (I think the reason behind this solution is that the module has limited display buffer and this format is just small enought to send and handle the data)

When this conversion done, you may send the output array of hexadecimal chars directly to the module. Important to note, that when you send your picture, you must fill all the screen! If you only send half the size, the rest of the display will be filled with random pixels. (unless this is what you want, then feel free to do it! :) ) So when you set the display dimensions in the options file, you must be precise! The converter fill the remaining spaces with empty data, if the pictures size not entirelly fill the screen.

# Installation

You can install this package from npm.

```bash
npm i image_to_epaper_converter
```

# Usage

It can be used from console or as a node package. If you choose to use it in the console, you must set all the options in a json file. (the project has a default one with all the available attributes as defaults. You can find it under the options folder)

## From console:

```bash
node standalone
```

You can provide a different options file with the 'options_path' param:

```bash
node standalone =./options/other.json
```

## From nodejs:

In a nodejs project you must pass the options as a javascript object:

```javascript
const converter = require('image_to_epaper_converter');

converter.convert({
	source_file: "picture.jpeg", // or providing 'source_data' as an image stream
	target_folder: "output",
	target_text_filename: "picture.txt",
	target_cpp_filename: "picture",
	cpp_variable_name: "PICTURE",
	tasks: [ "binary", "hexadecimal", "hexadecimal_cpp" ],
	display: {
		"width": 128,
		"height": 296,
		"fitmode": "none",
		"colormode": "inverted"
	}
});
```

Update: Now the convert method return with a result object in the following form:

```javascript
// Result when succeeded:
console.log({
	succeeded: true,
	// Only when binary task is selected
	binary: [ [ 0,1,1,1,0,0,1 ], [ 0,1,0,1,0,0,1 ], [ 0,0,0,1,0,0,1 ] /* ... */ ],
	// Only when either hexadecimal or hexadecimal_cpp is selected
	hexadecimal: [ 255, 250, 34 /* ... */ ],
	// Only when either hexadecimal or hexadecimal_cpp is selected
	hexadecimalString: [ '0xFF', '0xFA', '0x22' /* ... */ ]
});

// Result when failed:
console.log({
	succeeded: false,
	error: { /* error details, content depending on the error */ }
});
```

## Available option parameters:

- source_stream: A stream instance which contains the image. If this option is not provided, the script will use the source_file instead!
- source_file: The picture's absolute path (or relative to the project), the extension has to be either bmp, jpg, jpeg or png. Only used if source_stream is not given!
- target_folder: All the generated files are placed here. It can be a relative path to your project.
- target_text_filename: All the processed data goes to this file. If multiple task provided to the converter, then then it will put every output in this file, separated with empty lines.
- target_cpp_filename: Its the basename for generating the cpp files. Header and main codes are separated
- save_to_file: If this flag is false, the script won't save the output into file(s). It's usefull if you want to consume the result programatically. This flag is true by default.
- cpp_variable_name: It defines the variable's name in the generated cpp files.
- tasks: Its an array (or when you only need one task, you can use string aswell) with the converters tasks. All tasks are executed when you call the convert function. Available tasks: binary, hexadecimal, hexadecimal_cpp
- display: It describe the e-Paper modules properties.
  - width: The e-Paper modules width
  - height: The e-Paper modules height
  - fitmode: You have 3 options: 'none', 'center', 'repeat'.
    - none: It wont do anything. The picture will be displayed from the screen's starting corner. If your picture not fill the entire display surface, the remaining parts will be filled with zeros or ones. (it depends on your other settings)
    - center: This option will place in the given dimensions center. It wont change your picture, and the empty parts will be filled aswell.
    - repeat: When you set this option and your image not fill entirely the screen, the remaining empty parts will be filled with the repeated image.
  - fillmode: It change the empty parts color.
    - normal: Fill the empty parts with 'white' (empty) pixels
    - inverted: Fill the empty parts with 'colored' (black or red, depends on the sending commands) pixels
  - fillmode: It change the pictures color palette.
    - normal: The parts where the picture has color filled with 'colored' (black or red, depends on the sending commands) pixels
    - inverted: The parts where the picture has color filled with 'white' (empty) pixels
- image: With these options you can modify your picture before the conversion. This conversion use the following library: [imagejs](https://github.com/guyonroche/imagejs)
  - crop: You can crop your image. The width and height attributes of the image will be changed accordingly!
    - enabled: Enables the crop function. If this value is false, no crop will be applied to the image, no matter how you filled the other options.
    - top: The crop's vertical starting point in pixels
    - left: The crop's horizontal starting point in pixels
    - width: The crop's width from the horizontal starting point in pixels
    - height: The crop's height from the vertical starting point in pixels
  - resize: Resize your picture before conversion. The width and height attributes of the image will be changed accordingly!
    - enabled: Enables the resize function. If this value is false, no resize will be applied to the image, no matter how you filled the other options.
    - width: The target width of the image in pixels
    - height: The target height of the image in pixels
    - fit: Available options are: crop, pad, stretch
    - algorithm: Available algorithms: nearestNeighbor, bilinearInterpolation, bicubicInterpolation, hermiteInterpolation, bezierInterpolation
  - rotate: Rotate your picture before conversion.
     - enabled: Enables the rotate function. If this value is false, no rotation will be applied to the image, no matter how you filled the other options.
     - degrees: The rotations degrees. Available values: 1-359
     - fit: Available options are: crop, pad, same
     - padcolor: You can specify the empty pads color. The color is an object, with 4 attributes: r, g, b, a (red, green, blue, alpha).

## Tasks:

When you use this converter, you must choose from atleast one of these following tasks:

- binary
- hexadecimal
- hexadecimal_cpp

Before running any task, the image transformations are applied to your input image file.

### binary

This task converts your picture into a two-dimensional binary array. The following simple formula used for the pixel-to-binary conversion:

```javascript
(red + green + blue) / 3 > 255 * 0.5; // 1 or 0
```

The output data will be saved into the provided target file. The WaveShare e-paper cannot use this format directly, but maybe someone find it usefull in some other project. Also you can check that your options are set properly and the result looks as intended by previewing the generated binary file in your favourite text editor.

### hexadecimal

First it creates the previous two-dimensional binary array as input. After it'll concat all the numbers into a string, splits into 8 bit pieces and convert to the required hexadecimal format. Finally the output array saved into the provided target file. If both binary and hexadecimal tasks ran, the results goes into the same file, separated with two empty line.

### hexadecimal_cpp

This is the most handy task when you using the e-paper module with an arduino. It will create a header and a main cpp file. The result generated into these files as a standard variable. The two files looks like this example:

**target_file.h**

```cpp
// Proceduraly generated file, please do not edit it directly!

extern const unsigned char YOUR_PICTURE[];

```

**target_file.cpp**

```cpp
// Proceduraly generated file, please do not edit it directly!

#include "rabbit_picture.h"
#include <avr/pgmspace.h>

const unsigned char YOUR_PICTURE[] PROGMEM = {
	0X00, 0X3F, 0XFF, 0XFF, 0XFF, 0X80, 0X00, 0X00,
	0X00, 0X00, 0X00, 0X00, 0X00, 0X00, 0X00, 0X00,
	0X00, 0X3F, 0XFF, 0XFF, 0XFF, 0X80, 0X00, 0X00,
	0X00, 0X00, 0X00, 0X00, 0X00, 0X00, 0X00, 0X00,
	...
	0X00, 0X00, 0X00, 0X00, 0X00, 0X00, 0X00, 0X00
};

```

Both files created under the given target folder. The file's base name can be set with the `target_cpp_filename` option and the variable name with the `cpp_variable_name`. To generate the previous example you should create the following options file:

```json
{
	"source_file": "my_picture.jpeg",
	"target_folder": "output",
	"target_cpp_filename": "target_file",
	"cpp_variable_name": "YOUR_PICTURE",
	"tasks": [ "hexadecimal_cpp" ],
	"display": {
		"width": 128,
		"height": 296,
		"fitmode": "none",
		"colormode": "inverted"
	},
	"image": {
		"resize": {
			"enabled": true,
			"width": 128,
			"height": 296
		}
	}
}
```

# Need more informations?

If you need more informations are help to use this tool with your e-paper module, feel free to contact me! I'll upload my own version of the official e-paper cpp library later in a different repository and link it here.

For now you can find the original descriptions and files in the official wiki page: [2.9inch e-Paper Module](https://www.waveshare.com/wiki/2.9inch_e-Paper_Module_(B)) (Other module's page can be found in the related products box)