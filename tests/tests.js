module('jQuery.FileAPI');

(function (){
	var serverUrl = 'http://rubaxa.org/FileAPI/server/ctrl.php';

	QUnit.config.autostart = isPhantomJS;


	FileAPI.event.on(startBtn, 'click', function (){
		QUnit.start();
	});


	var $el = $('#uploader');
	var $one = $('#one');
	var $multiple = $('#multiple');


	function checkDisabledCtrls(disabled, postfix){
		equal($('#uploadBtn').prop('disabled'), disabled, 'upload - '+postfix);
		equal($el.find('[data-fileapi="ctrl.reset"]').prop('disabled'), disabled, 'reset - '+postfix);

		equal($el.find('[data-fileapi="empty.show"]').is(':visible'), disabled, 'empty.show - '+postfix);
		equal($el.find('[data-fileapi="empty.hide"]').is(':visible'), !disabled, 'empty.hide - '+postfix);

		equal($el.find('[data-fileapi="emptyQueue.show"]').is(':visible'), disabled, 'emptyQueue.show - '+postfix);
		equal($el.find('[data-fileapi="emptyQueue.hide"]').is(':visible'), !disabled, 'emptyQueue.hide - '+postfix);
	}


	function _checkFileListView(files, $files, postfix){
		$files.each(function (i){
			var $file = $(this), file = files[i];
			equal($file.find('.idx').html(), i, '$idx - '+i+' - '+postfix);
			equal($file.find('.uid').html(), FileAPI.uid(file), 'uid - '+i+' - '+postfix);
			equal($file.find('.name').html(), file.name, 'name - '+i+' - '+postfix);
			equal($file.find('.type').html(), file.type, 'type - '+i+' - '+postfix);
			equal($file.find('.size').html(), file.size, 'size - '+i+' - '+postfix);
		});
	}



	asyncTest('files.multiple:false', function (){
		var $el = $('#userpic');

		$el.fileapi('destroy').fileapi({
			url: serverUrl,
			multiple: false,
			elements: {
				preview: {
					el: '.js-preview',
					width: 200,
					height: 200
				}
			},
			files: [{
				src: './files/dino.png',
				name: 'dino.png'
			}]
		});

		setTimeout(function () {
			equal($el.find('.js-preview canvas').width(), 200, 'width');
			equal($el.find('.js-preview canvas').height(), 200, 'height');
			start();
		}, 500);
	});


	test('files.multiple:true', function (){
		$el.fileapi('destroy').fileapi({
			url: serverUrl,
			multiple: true,
			elements: {
				ctrl: { upload: '#uploadBtn' },
				file: {
					preview: {
						el: '.img',
						width: 100,
						height: 100
					}
				}
			},
			files: ['./files/image.jpg', {
				src: './files/dino.png',
				type: 'image/png',
				name: 'dino.png',
				size: 315
			}]
		});

		ok($('#uploadBtn').prop('disabled'), 'upload btn');
		_checkFileListView($el.fileapi('files'), $el.find('[data-fileapi="list"]').children());
	});


	test('UI', function (){
		function checkFiles(inpFiles, postfix){
			ok(inpFiles.length > 0, 'files > 0 - '+postfix);
			equal(files.length, inpFiles.length, 'selected files - '+postfix);

			var names = [], size = 0;
			FileAPI.each(inpFiles, function (file){
				size += file.size;
				names.push(file.name);
			});

			equal($el.find('[data-fileapi="name"]').text(), names.join(', '), 'ui.names - '+postfix);
			equal($el.find('[data-fileapi="size"]').text(), widget._getFormatedSize(size), 'ui.size - '+postfix);

			var $files = $el.find('[data-fileapi="list"]').children();
			equal($files.length, files.length, 'list - '+postfix);

			_checkFileListView(files, $files, postfix);
		}


		// TEST
		stop();

		var
			  files
			, prepareIdx = 0
			, onFileComplete = false
			, onTestedEvents = {}
			, testingEvents = 'Upload Progress FilePrepare FileUpload FileProgress FileComplete'
		;


		$el
			.fileapi('destroy')
			.fileapi({
				url: serverUrl,
				data: {},
				onSelect: function (evt, ui){
					files = ui.files
				},
				elements: {
					ctrl: { upload: '#uploadBtn' }
				},
				onUpload: function (){
					ok(!$el.find('[data-fileapi="ctrl.abort"]').prop('disabled'), 'abort after "upload"');
					onTestedEvents.onUpload = true;

					FileAPI.each(testingEvents.split(' '), function (name){
						$el.fileapi('option', 'on'+name, function (){
							onTestedEvents['on'+name] = true;
						});
					}, this);
				},
				onComplete: function (evt, uiEvt){
					FileAPI.each(testingEvents.split(' '), function (name){
						ok(onTestedEvents['on'+name], 'on'+name);
						ok(onTestedEvents[name.toLowerCase()], name);
					});

					ok(onFileComplete, 'filecomplete listener');

					setTimeout(function (){
						start();
						ok($('#uploadBtn').prop('disabled'), 'upload after "complete"');
						ok($el.find('[data-fileapi="ctrl.reset"]').prop('disabled'), 'reset after "complete"');
						ok($el.find('[data-fileapi="ctrl.abort"]').prop('disabled'), 'abort after "complete"');
					}, 500);
				}
			})
			.on(testingEvents.toLowerCase(), function (evt){
				onTestedEvents[evt.type] = true;
			})
			.on('fileprepare', function (evt, ui){
				prepareIdx++;
				ui.file.foo = prepareIdx;
				ui.options.data.foo = prepareIdx;
			})
			.on('filecomplete', function (evt, ui){
				onFileComplete = true;
				equal(ui.xhr.options.data.foo, prepareIdx, "xhr.options.data.foo: "+prepareIdx);
				equal(ui.result.data._REQUEST.foo, prepareIdx, "result.foo: "+prepareIdx);
			})
		;



		var widget = $el.fileapi('widget');
		equal(widget.toString(), '[jQuery.FileAPI object]', 'widget');

		// controls before "change"
		checkDisabledCtrls(true, 'before "change"');
		ok($el.find('[data-fileapi="ctrl.abort"]').prop('disabled'), 'abort - before "change"');

		// simulate "change"
		$one.appendTo($el);
		$el.find('input').trigger('change');

		// controls after "change"
		checkDisabledCtrls(false, 'after "change"');

		// one
		checkFiles($one.prop('files'), 'one');

		// click on reset
		$el.find('[data-fileapi="ctrl.reset"]').trigger('click');

		// controls after "reset"
		checkDisabledCtrls(true, 'after "change"');
		ok($el.find('[data-fileapi="ctrl.abort"]').prop('disabled'), 'abort - after "reset"');

		equal($el.find('[data-fileapi="name"]').text(), '', 'fileName (after reset)');
		equal($el.find('[data-fileapi="size"]').text(), '', 'fileSize (after reset)');

		// simulate "change"
		$one.detach();
		$multiple.appendTo($el);
		$el.find('input').trigger('change');

		// controls after "change"
		checkDisabledCtrls(false, 'after "change"');

		// multiple
		checkFiles($multiple.prop('files'), 'multiple');


		// Start upload
		$('#uploadBtn').trigger('click');
		ok($el.find('[data-fileapi="active.show"]').is(':visible'), 'active.show after "start"');
		ok(!$el.find('[data-fileapi="active.hide"]').is(':visible'), 'active.show after "start"');
	});
})();
