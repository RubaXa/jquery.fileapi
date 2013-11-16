# $.fn.fileapi
jQuery plugin for FileAPI (multiupload, image upload, crop, resize and etc.)


## Install
```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min.js"></script>

<script>
	window.FileAPI = {
		  debug: false // debug mode
		, staticPath: '/js/jquery.fileapi/FileAPI/' // path to *.swf
	};
</script>
<script src="/js/jquery.fileapi/FileAPI/FileAPI.min.js"></script>
<script src="/js/jquery.fileapi/jquery.fileapi.min.js"></script>
```

---


## Example
```html
<div id="uploader">
	<div class="js-fileapi-wrapper">
		<input type="file" name="files[]" />
	</div>
	<div data-fileapi="active.show" class="progress">
		<div data-fileapi="progress" class="progress__bar"></div>
	</div>
</div>
<script>
	jQuery(function ($){
		$('#uploader').fileapi({
			url: './ctrl.php',
			autoUpload: true,
			accept: 'image/*',
			multiple: true,
			maxSize: FileAPI.MB*10 // max file size
		});
	});
</script>
```


---


## Options

### url`:String`
URL to which the request is sent.<br/>
If `undefined` or empty, it is set to the action property of the file upload form if available.


### autoUpload`:Boolean`
To enable automatic uploads, set this option to `true`.


### data`:Object`
Additional form data to be sent along with the file uploads can be set using this option.


### headers`:Object`
Additional request headers.


### multiple`:Boolean`
It specifies that multiple files can be selected at once, default `true`.


### accept`:String`
If the value of the type attribute is file, this attribute indicates the types of files that the server accepts;
otherwise it is ignored. The value must be a comma-separated list of unique content type specifiers: `image/*`, `audio/*`, `video/*`, etc.


### duplicate`:Boolean`
The ability to download duplicates, default `false`.


### paramName`:String`
The parameter name for the file form data (the request argument name).<br/>
If `undefined` or empty, the name property of the file input field is used, or `files[]` if the file input name property is also empty.


### dataType`:String`
The type of data that is expected back from the server, default `json`.


### chunkSize`:Number`
Chunk size in bytes, eg: `.5 * FileAPI.MB`.


### chunkUploadRetry`:Number`
Number of retries during upload chunks.


### maxSize`:Number`
The maximum allowed file size in bytes, by default unlimited.


### maxFiles`:Number`
This option limits the number of files that are allowed to be uploaded using this plugin.


### imageSize`:Object`
Allowable size of uploaded images, eg: `{ minWidth: 320, minHeight: 240, maxWidth: 3840, maxHeight: 2160 }`.


### sortFn`:Function`
Sort function of selected files.


### filterFn`:Function`
Filter function of selected files, eg: `function (file, info){ return /^image/.test(file.type) && info.width > 320 }`.


### elements`:Object`
```js
// Default options
elements: {
	// Controls
	ctrl: {
		upload: '[data-fileapi="ctrl.upload"]',
		reset: '[data-fileapi="ctrl.reset"]',
		abort: '[data-fileapi="ctrl.abort"]'
	},
	// Display element depending on files
	empty: {
		show: '[data-fileapi="empty.show"]',
		hide: '[data-fileapi="empty.hide"]'
	},
	// Display element depending on queue state
	emptyQueue: {
		show: '[data-fileapi="emptyQueue.show"]',
		hide: '[data-fileapi="emptyQueue.hide"]'
	},
	// Display element depending on upload state
	active: {
		show: '[data-fileapi="active.show"]',
		hide: '[data-fileapi="active.hide"]'
	},
	// Preview file (single upload)
	preview: {
		el: 0, // css selector
		width: 0,
		height: 0,
		keepAspectRatio: false // optional: false to stretch cropped image to preview area, true scale image proportionally
	},
	// Total size of queue
	size: '[data-fileapi="size"]',
	// Selected file name
	name: '[data-fileapi="name"]',
	// Progress bar total
	progress: '[data-fileapi="progress"]',
	// Filelist options
	file: {
		// Template
		tpl: '[data-fileapi="file.tpl"]',
		// Progress bar
		progress: '[data-fileapi="file.progress"]',
		// Display element depending on upload state
		active: {
			show: '[data-fileapi="active.show"]',
			hide: '[data-fileapi="active.hide"]'
		},
		// Preview file or icon
		preview: {
			el: 0, // css selector
			get: 0, // eg: function($el, file){ $el.append('<i class="icon icon_'+file.name.split('.').pop()+'"></i>'); }
			width: 0,
			height: 0,
			keepAspectRatio: false // optional: false to stretch cropped image to preview area, true scale image proportionally
		}
	},
	// Drag and drop
	dnd: {
		// DropZone: selector or element
		el: '[data-fileapi="dnd"]',
		// Hover class
		hover: 'dnd_hover'
	}
}
```

---

## Events
### onSelect`:Function`(evt`:$.Event`, data`:FilesObject`)
Retrieve file List, takes two arguments.

```js
$('...').fileapi({
	onSelect: function (evt, data){
		data.all; // All files
		data.files; // Correct files
		if( data.other.length ){
			// errors
			var errors = data.other[0].errors;
			if( errors ){
				errors.maxSize;
				errors.maxFiles;
				errors.minWidth;
				errors.minHeight;
				errors.maxWidth;
				errors.maxHeight;
			}
		}
	}
});
```


### onUpload`:Function`(evt`:$.Event`, xhr`:Object`, options`:Object`)
Start uploading.

### onFileUpload`:Function`(evt`:$.Event`, file`:Object`, xhr`:Object`, options`:Object`)
Start upload the same file.

### onProgress`:Function`(evt`:$.Event`, uiEvt`:ProgressEvent`, file`:Object`, xhr`:Object`, options`:Object`)
Common uploading progress.

### onFileProgress`:Function`(evt`:$.Event`, uiEvt`:ProgressEvent`, file`:Object`, xhr`:Object`, options`:Object`)
Progress upload the same file.

### onComplete`:Function`(evt`:$.Event`, err`:String|Null`, xhr`:Object`, file`:Object`, options`:Object`)
Completion of the entire uploading.

### onFileComplete`:Function`(evt`:$.Event`, err`:String|Null`, xhr`:Object`, file`:Object`, options`:Object`)
Completion of uploading the file.

### onDrop`:Function`(evt`:$.Event`, data`:FilesObject`)
Retrieve file List, takes two arguments.

### onDropHover`:Function`(evt`:$.Event`, uiEvt`:Object`)
```js
$('#box').fileapi({
	onDropHover: function (evt, uiEvt){
		$(this).toggleClass('dnd_hover', uiEvt.state);
	}
});
```



## Cropper
Based on [Jсrop](http://deepliquid.com/content/Jcrop.html).

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min.js"></script>
<script>window.FileAPI = { /* options */ };</script>
<script src="/js/jquery.fileapi/FileAPI/FileAPI.min.js"></script>
<script src="/js/jquery.fileapi/jquery.fileapi.min.js"></script>
<script src="/js/jquery.fileapi/jcrop/jquery.Jcrop.min.js"></script>
<link href="/js/jquery.fileapi/jcrop/jquery.Jcrop.min.css" rel="stylesheet" type="text/css"/>
```

Usage:
```js
$('#userpic').fileapi({
	url: '...',
	accept: 'image/*',
	onSelect: function (imageFile){
		$('#userpic-upload-btn')
			.unbind('.fileapi')
			.bind('click.fileapi', function (){
				$('#userpic').fileapi('upload');
			})
		;

		$('#image-preview').cropper({
			  file: imageFile
			, bgColor: '#fff'
			, maxSize: [320, 240] // viewport max size
			, minSize: [100, 100] // crop min size
			, aspectRatio: 1      // optional, aspect ratio: 0 - disable, >0 - fixed, remove this option: autocalculation from minSize
			, onSelect: function (coords){
				$('#userpic').fileapi('crop', imageFile, coords);
			}
		});
	}
});
```


---


## MIT LICENSE
Copyright 2013 Lebedev Konstantin <ibnRubaXa@gmail.com>
http://rubaxa.github.io/jquery.fileapi/

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


---


## Changelog
 * + `remove(file)` method

### 0.2.0
 * enhancement `ui event` in onSelect
 * + `maxFiles` option support
 * fixed `onFileUpload` & `onFileProgress` events
 * + #9: Preview with aspect ratio keeping support (optional)

### 0.1.4
 * + `headers:Object`
 * + `queue()`; * `clear()`;
 * `clearOnComplete: false`
 * * `resetOnSelect` -> `clearOnSelect`

### 0.1.1
 * + `resetOnSelect` option, default `!multiple`
 * fix $.fn.cropper reinit


### 0.1.0
 * Inital commit
