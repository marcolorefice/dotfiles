Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.focusEditor = focusEditor;
exports.replaceTag = replaceTag;
exports.replaceTags = replaceTags;
exports.formatType = formatType;
exports.prepareType = prepareType;
exports.prepareInlineDocs = prepareInlineDocs;
exports.buildDisplayText = buildDisplayText;
exports.buildSnippet = buildSnippet;
exports.extractParams = extractParams;
exports.formatTypeCompletion = formatTypeCompletion;
exports.disposeAll = disposeAll;
exports.openFileAndGoToPosition = openFileAndGoToPosition;
exports.openFileAndGoTo = openFileAndGoTo;
exports.updateTernFile = updateTernFile;
exports.writeFile = writeFile;
exports.isDirectory = isDirectory;
exports.fileExists = fileExists;
exports.getFileContent = getFileContent;
exports.readFile = readFile;
exports.setMarkerCheckpoint = setMarkerCheckpoint;
exports.markerCheckpointBack = markerCheckpointBack;
exports.markDefinitionBufferRange = markDefinitionBufferRange;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsPackageConfig = require('./atom-ternjs-package-config');

var _atomTernjsPackageConfig2 = _interopRequireDefault(_atomTernjsPackageConfig);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

'use babel';

var checkpointsDefinition = [];

var tags = {

  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
};

var accessKey = 'altKey';

exports.accessKey = accessKey;

function focusEditor() {

  var editor = atom.workspace.getActiveTextEditor();

  if (!editor) {

    return;
  }

  var view = atom.views.getView(editor);

  view && view.focus && view.focus();
}

function replaceTag(tag) {

  return tags[tag];
}

function replaceTags(str) {

  if (!str) {

    return '';
  }

  return str.replace(/[&<>]/g, replaceTag);
}

function formatType(data) {

  if (!data.type) {

    return '';
  }

  data.type = data.type.replace(/->/g, ':').replace('<top>', 'window');

  if (!data.exprName) {

    return data.type;
  }

  data.type = data.type.replace(/^fn/, data.exprName);

  return data.type;
}

function prepareType(data) {

  if (!data.type) {

    return;
  }

  return data.type.replace(/->/g, ':').replace('<top>', 'window');
}

function prepareInlineDocs(data) {

  return data.replace(/@param/, '<span class="doc-param-first">@param</span>').replace(/@param/g, '<span class="storage type doc-param">@param</span>').replace(/@return/, '<span class="storage type doc-return">@return</span>');
}

function buildDisplayText(params, name) {

  if (params.length === 0) {

    return name + '()';
  }

  var suggestionParams = params.map(function (param) {

    param = param.replace('}', '\\}');
    param = param.replace(/'"/g, '');

    return param;
  });

  return name + '(' + suggestionParams.join(',') + ')';
}

function buildSnippet(params, name) {

  if (params.length === 0) {

    return name + '()';
  }

  var suggestionParams = params.map(function (param, i) {

    param = param.replace('}', '\\}');

    return '${' + (i + 1) + ':' + param + '}';
  });

  return name + '(' + suggestionParams.join(',') + ')';
}

function extractParams(type) {

  if (!type) {

    return [];
  }

  var start = type.indexOf('(') + 1;
  var params = [];
  var inside = 0;

  for (var i = start; i < type.length; i++) {

    if (type[i] === ':' && inside === -1) {

      params.push(type.substring(start, i - 2));

      break;
    }

    if (i === type.length - 1) {

      var param = type.substring(start, i);

      if (param.length) {

        params.push(param);
      }

      break;
    }

    if (type[i] === ',' && inside === 0) {

      params.push(type.substring(start, i));
      start = i + 1;

      continue;
    }

    if (type[i].match(/[{\[\(]/)) {

      inside++;

      continue;
    }

    if (type[i].match(/[}\]\)]/)) {

      inside--;
    }
  }

  return params;
}

function formatTypeCompletion(obj, isProperty, isObjectKey, isInFunDef) {

  if (obj.isKeyword) {

    obj._typeSelf = 'keyword';
  }

  if (obj.type === 'string') {

    obj.name = obj.name ? obj.name.replace(/(^"|"$)/g, '') : null;
  } else {

    obj.name = obj.name ? obj.name.replace(/["']/g, '') : null;
    obj.name = obj.name ? obj.name.replace(/^..\//, '') : null;
  }

  if (!obj.type) {

    return obj;
  }

  if (!obj.type.startsWith('fn')) {

    if (isProperty) {

      obj._typeSelf = 'property';
    } else {

      obj._typeSelf = 'variable';
    }
  }

  obj.type = obj.rightLabel = prepareType(obj);

  if (obj.type.replace(/fn\(.+\)/, '').length === 0) {

    obj.leftLabel = '';
  } else {

    if (obj.type.indexOf('fn') === -1) {

      obj.leftLabel = obj.type;
    } else {

      obj.leftLabel = obj.type.replace(/fn\(.{0,}\)/, '').replace(' : ', '');
    }
  }

  if (obj.rightLabel.startsWith('fn')) {

    var params = extractParams(obj.rightLabel);

    if (_atomTernjsPackageConfig2['default'].options.useSnippets || _atomTernjsPackageConfig2['default'].options.useSnippetsAndFunction) {

      if (!isInFunDef) {

        obj._snippet = buildSnippet(params, obj.name);
      }

      obj._hasParams = params.length ? true : false;
    } else {

      if (!isInFunDef) {

        obj._snippet = params.length ? obj.name + '(${' + 0 + ':${}})' : obj.name + '()';
      }

      obj._displayText = buildDisplayText(params, obj.name);
    }

    obj._typeSelf = 'function';
  }

  if (obj.name) {

    if (obj.leftLabel === obj.name) {

      obj.leftLabel = null;
      obj.rightLabel = null;
    }
  }

  if (obj.leftLabel === obj.rightLabel) {

    obj.rightLabel = null;
  }

  return obj;
}

function disposeAll(disposables) {

  for (var disposable of disposables) {

    if (!disposable) {

      continue;
    }

    disposable.dispose();
  }
}

function openFileAndGoToPosition(position, file) {

  atom.workspace.open(file).then(function (textEditor) {

    var cursor = textEditor.getLastCursor();

    if (!cursor) {

      return;
    }

    cursor.setBufferPosition(position);
  });
}

function openFileAndGoTo(start, file) {

  atom.workspace.open(file).then(function (textEditor) {

    var buffer = textEditor.getBuffer();
    var cursor = textEditor.getLastCursor();

    if (!buffer || !cursor) {

      return;
    }

    cursor.setBufferPosition(buffer.positionForCharacterIndex(start));
    markDefinitionBufferRange(cursor, textEditor);
  });
}

function updateTernFile(content, restartServer) {

  var projectRoot = _atomTernjsManager2['default'].server && _atomTernjsManager2['default'].server.projectDir;

  if (!projectRoot) {

    return;
  }

  writeFile(_path2['default'].resolve(__dirname, projectRoot + '/.tern-project'), content, restartServer);
}

function writeFile(filePath, content, restartServer) {

  _fs2['default'].writeFile(filePath, content, function (error) {

    atom.workspace.open(filePath);

    if (!error && restartServer) {

      _atomTernjsManager2['default'].restartServer();
    }

    if (!error) {

      return;
    }

    var message = 'Could not create/update .tern-project file. Use the README to manually create a .tern-project file.';

    atom.notifications.addInfo(message, {

      dismissable: true
    });
  });
}

function isDirectory(dir) {

  try {

    return _fs2['default'].statSync(dir).isDirectory();
  } catch (error) {

    return false;
  }
}

function fileExists(path) {

  try {

    _fs2['default'].accessSync(path, _fs2['default'].F_OK, function (error) {

      console.error(error);
    });
  } catch (error) {

    return false;
  }
}

function getFileContent(filePath, root) {

  var _filePath = root + filePath;
  var resolvedPath = _path2['default'].resolve(__dirname, _filePath);

  if (fileExists(resolvedPath) !== undefined) {

    return false;
  }

  return readFile(resolvedPath);
}

function readFile(path) {

  return _fs2['default'].readFileSync(path, 'utf8');
}

function setMarkerCheckpoint() {

  var editor = atom.workspace.getActiveTextEditor();
  var buffer = editor.getBuffer();
  var cursor = editor.getLastCursor();

  if (!cursor) {

    return;
  }

  var marker = buffer.markPosition(cursor.getBufferPosition(), {});

  checkpointsDefinition.push({

    marker: marker,
    editor: editor
  });
}

function markerCheckpointBack() {

  if (!checkpointsDefinition.length) {

    return;
  }

  var checkpoint = checkpointsDefinition.pop();

  openFileAndGoToPosition(checkpoint.marker.getRange().start, checkpoint.editor.getURI());
}

function markDefinitionBufferRange(cursor, editor) {

  var range = cursor.getCurrentWordBufferRange();
  var marker = editor.markBufferRange(range, { invalidate: 'touch' });

  var decoration = editor.decorateMarker(marker, {

    type: 'highlight',
    'class': 'atom-ternjs-definition-marker',
    invalidate: 'touch'
  });

  if (!decoration) {

    return;
  }

  setTimeout(function () {

    decoration.setProperties({

      type: 'highlight',
      'class': 'atom-ternjs-definition-marker active',
      invalidate: 'touch'
    });
  }, 1);

  setTimeout(function () {

    decoration.setProperties({

      type: 'highlight',
      'class': 'atom-ternjs-definition-marker',
      invalidate: 'touch'
    });
  }, 1501);

  setTimeout(function () {

    marker.destroy();
  }, 2500);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdGVmYW5vLmNvcmFsbG8vLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtaGVscGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7aUNBRW9CLHVCQUF1Qjs7Ozt1Q0FDakIsOEJBQThCOzs7O29CQUN2QyxNQUFNOzs7O2tCQUNSLElBQUk7Ozs7QUFMbkIsV0FBVyxDQUFDOztBQU9aLElBQUkscUJBQXFCLEdBQUcsRUFBRSxDQUFDOztBQUUvQixJQUFNLElBQUksR0FBRzs7QUFFWCxLQUFHLEVBQUUsT0FBTztBQUNaLEtBQUcsRUFBRSxNQUFNO0FBQ1gsS0FBRyxFQUFFLE1BQU07Q0FDWixDQUFDOztBQUVLLElBQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQzs7OztBQUUzQixTQUFTLFdBQVcsR0FBRzs7QUFFNUIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDOztBQUVwRCxNQUFJLENBQUMsTUFBTSxFQUFFOztBQUVYLFdBQU87R0FDUjs7QUFFRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFeEMsTUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0NBQ3BDOztBQUVNLFNBQVMsVUFBVSxDQUFDLEdBQUcsRUFBRTs7QUFFOUIsU0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Q0FDbEI7O0FBRU0sU0FBUyxXQUFXLENBQUMsR0FBRyxFQUFFOztBQUUvQixNQUFJLENBQUMsR0FBRyxFQUFFOztBQUVSLFdBQU8sRUFBRSxDQUFDO0dBQ1g7O0FBRUQsU0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztDQUMxQzs7QUFFTSxTQUFTLFVB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Q0FBQzs7QUFFTixZQUFVLENBQUMsWUFBTTs7QUFFZixjQUFVLENBQUMsYUFBYSxDQUFDOztBQUV2QixVQUFJLEVBQUUsV0FBVztBQUNqQixlQUFPLCtCQUErQjtBQUN0QyxnQkFBVSxFQUFFLE9BQU87S0FDcEIsQ0FBQyxDQUFDO0dBRUosRUFBRSxJQUFJLENBQUMsQ0FBQzs7QUFFVCxZQUFVLENBQUMsWUFBTTs7QUFFZixVQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7R0FFbEIsRUFBRSxJQUFJLENBQUMsQ0FBQztDQUNWIiwiZmlsZSI6Ii9Vc2Vycy9zdGVmYW5vLmNvcmFsbG8vLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtaGVscGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBtYW5hZ2VyIGZyb20gJy4vYXRvbS10ZXJuanMtbWFuYWdlcic7XG5pbXBvcnQgcGFja2FnZUNvbmZpZyBmcm9tICcuL2F0b20tdGVybmpzLXBhY2thZ2UtY29uZmlnJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcblxubGV0IGNoZWNrcG9pbnRzRGVmaW5pdGlvbiA9IFtdO1xuXG5jb25zdCB0YWdzID0ge1xuXG4gICcmJzogJyZhbXA7JyxcbiAgJzwnOiAnJmx0OycsXG4gICc+JzogJyZndDsnXG59O1xuXG5leHBvcnQgY29uc3QgYWNjZXNzS2V5ID0gJ2FsdEtleSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBmb2N1c0VkaXRvcigpIHtcblxuICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG5cbiAgaWYgKCFlZGl0b3IpIHtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKTtcblxuICB2aWV3ICYmIHZpZXcuZm9jdXMgJiYgdmlldy5mb2N1cygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVwbGFjZVRhZyh0YWcpIHtcblxuICByZXR1cm4gdGFnc1t0YWddO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVwbGFjZVRhZ3Moc3RyKSB7XG5cbiAgaWYgKCFzdHIpIHtcblxuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIHJldHVybiBzdHIucmVwbGFjZSgvWyY8Pl0vZywgcmVwbGFjZVRhZyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRUeXBlKGRhdGEpIHtcblxuICBpZiAoIWRhdGEudHlwZSkge1xuXG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgZGF0YS50eXBlID0gZGF0YS50eXBlLnJlcGxhY2UoLy0+L2csICc6JykucmVwbGFjZSgnPHRvcD4nLCAnd2luZG93Jyk7XG5cbiAgaWYgKCFkYXRhLmV4cHJOYW1lKSB7XG5cbiAgICByZXR1cm4gZGF0YS50eXBlO1xuICB9XG5cbiAgZGF0YS50eXBlID0gZGF0YS50eXBlLnJlcGxhY2UoL15mbi8sIGRhdGEuZXhwck5hbWUpO1xuXG4gIHJldHVybiBkYXRhLnR5cGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcmVwYXJlVHlwZShkYXRhKSB7XG5cbiAgaWYgKCFkYXRhLnR5cGUpIHtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIHJldHVybiBkYXRhLnR5cGUucmVwbGFjZSgvLT4vZywgJzonKS5yZXBsYWNlKCc8dG9wPicsICd3aW5kb3cnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByZXBhcmVJbmxpbmVEb2NzKGRhdGEpIHtcblxuICByZXR1cm4gZGF0YVxuICAgIC5yZXBsYWNlKC9AcGFyYW0vLCAnPHNwYW4gY2xhc3M9XCJkb2MtcGFyYW0tZmlyc3RcIj5AcGFyYW08L3NwYW4+JylcbiAgICAucmVwbGFjZSgvQHBhcmFtL2csICc8c3BhbiBjbGFzcz1cInN0b3JhZ2UgdHlwZSBkb2MtcGFyYW1cIj5AcGFyYW08L3NwYW4+JylcbiAgICAucmVwbGFjZSgvQHJldHVybi8sICc8c3BhbiBjbGFzcz1cInN0b3JhZ2UgdHlwZSBkb2MtcmV0dXJuXCI+QHJldHVybjwvc3Bhbj4nKVxuICAgIDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkRGlzcGxheVRleHQocGFyYW1zLCBuYW1lKSB7XG5cbiAgaWYgKHBhcmFtcy5sZW5ndGggPT09IDApIHtcblxuICAgIHJldHVybiBgJHtuYW1lfSgpYDtcbiAgfVxuXG4gIGxldCBzdWdnZXN0aW9uUGFyYW1zID0gcGFyYW1zLm1hcCgocGFyYW0pID0+IHtcblxuICAgIHBhcmFtID0gcGFyYW0ucmVwbGFjZSgnfScsICdcXFxcfScpO1xuICAgIHBhcmFtID0gcGFyYW0ucmVwbGFjZSgvJ1wiL2csICcnKTtcblxuICAgIHJldHVybiBwYXJhbTtcbiAgfSk7XG5cbiAgcmV0dXJuIGAke25hbWV9KCR7c3VnZ2VzdGlvblBhcmFtcy5qb2luKCcsJyl9KWA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFNuaXBwZXQocGFyYW1zLCBuYW1lKSB7XG5cbiAgaWYgKHBhcmFtcy5sZW5ndGggPT09IDApIHtcblxuICAgIHJldHVybiBgJHtuYW1lfSgpYDtcbiAgfVxuXG4gIGxldCBzdWdnZXN0aW9uUGFyYW1zID0gcGFyYW1zLm1hcCgocGFyYW0sIGkpID0+IHtcblxuICAgIHBhcmFtID0gcGFyYW0ucmVwbGFjZSgnfScsICdcXFxcfScpO1xuXG4gICAgcmV0dXJuIGBcXCR7JHtpICsgMX06JHtwYXJhbX19YDtcbiAgfSk7XG5cbiAgcmV0dXJuIGAke25hbWV9KCR7c3VnZ2VzdGlvblBhcmFtcy5qb2luKCcsJyl9KWA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0UGFyYW1zKHR5cGUpIHtcblxuICBpZiAoIXR5cGUpIHtcblxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGxldCBzdGFydCA9IHR5cGUuaW5kZXhPZignKCcpICsgMTtcbiAgbGV0IHBhcmFtcyA9IFtdO1xuICBsZXQgaW5zaWRlID0gMDtcblxuICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCB0eXBlLmxlbmd0aDsgaSsrKSB7XG5cbiAgICBpZiAodHlwZVtpXSA9PT0gJzonICYmIGluc2lkZSA9PT0gLTEpIHtcblxuICAgICAgcGFyYW1zLnB1c2godHlwZS5zdWJzdHJpbmcoc3RhcnQsIGkgLSAyKSk7XG5cbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChpID09PSB0eXBlLmxlbmd0aCAtIDEpIHtcblxuICAgICAgY29uc3QgcGFyYW0gPSB0eXBlLnN1YnN0cmluZyhzdGFydCwgaSk7XG5cbiAgICAgIGlmIChwYXJhbS5sZW5ndGgpIHtcblxuICAgICAgICBwYXJhbXMucHVzaChwYXJhbSk7XG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmICh0eXBlW2ldID09PSAnLCcgJiYgaW5zaWRlID09PSAwKSB7XG5cbiAgICAgIHBhcmFtcy5wdXNoKHR5cGUuc3Vic3RyaW5nKHN0YXJ0LCBpKSk7XG4gICAgICBzdGFydCA9IGkgKyAxO1xuXG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAodHlwZVtpXS5tYXRjaCgvW3tcXFtcXChdLykpIHtcblxuICAgICAgaW5zaWRlKys7XG5cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmICh0eXBlW2ldLm1hdGNoKC9bfVxcXVxcKV0vKSkge1xuXG4gICAgICBpbnNpZGUtLTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcGFyYW1zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0VHlwZUNvbXBsZXRpb24ob2JqLCBpc1Byb3BlcnR5LCBpc09iamVjdEtleSwgaXNJbkZ1bkRlZikge1xuXG4gIGlmIChvYmouaXNLZXl3b3JkKSB7XG5cbiAgICBvYmouX3R5cGVTZWxmID0gJ2tleXdvcmQnO1xuICB9XG5cbiAgaWYgKG9iai50eXBlID09PSAnc3RyaW5nJykge1xuXG4gICAgb2JqLm5hbWUgPSBvYmoubmFtZSA/IG9iai5uYW1lLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCAnJykgOiBudWxsO1xuXG4gIH0gZWxzZSB7XG5cbiAgICBvYmoubmFtZSA9IG9iai5uYW1lID8gb2JqLm5hbWUucmVwbGFjZSgvW1wiJ10vZywgJycpIDogbnVsbDtcbiAgICBvYmoubmFtZSA9IG9iai5uYW1lID8gb2JqLm5hbWUucmVwbGFjZSgvXi4uXFwvLywgJycpIDogbnVsbDtcbiAgfVxuXG4gIGlmICghb2JqLnR5cGUpIHtcblxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICBpZiAoIW9iai50eXBlLnN0YXJ0c1dpdGgoJ2ZuJykpIHtcblxuICAgIGlmIChpc1Byb3BlcnR5KSB7XG5cbiAgICAgIG9iai5fdHlwZVNlbGYgPSAncHJvcGVydHknO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgb2JqLl90eXBlU2VsZiA9ICd2YXJpYWJsZSc7XG4gICAgfVxuICB9XG5cbiAgb2JqLnR5cGUgPSBvYmoucmlnaHRMYWJlbCA9IHByZXBhcmVUeXBlKG9iaik7XG5cbiAgaWYgKG9iai50eXBlLnJlcGxhY2UoL2ZuXFwoLitcXCkvLCAnJykubGVuZ3RoID09PSAwKSB7XG5cbiAgICBvYmoubGVmdExhYmVsID0gJyc7XG5cbiAgfSBlbHNlIHtcblxuICAgIGlmIChvYmoudHlwZS5pbmRleE9mKCdmbicpID09PSAtMSkge1xuXG4gICAgICBvYmoubGVmdExhYmVsID0gb2JqLnR5cGU7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICBvYmoubGVmdExhYmVsID0gb2JqLnR5cGUucmVwbGFjZSgvZm5cXCguezAsfVxcKS8sICcnKS5yZXBsYWNlKCcgOiAnLCAnJyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKG9iai5yaWdodExhYmVsLnN0YXJ0c1dpdGgoJ2ZuJykpIHtcblxuICAgIGxldCBwYXJhbXMgPSBleHRyYWN0UGFyYW1zKG9iai5yaWdodExhYmVsKTtcblxuICAgIGlmIChcbiAgICAgIHBhY2thZ2VDb25maWcub3B0aW9ucy51c2VTbmlwcGV0cyB8fFxuICAgICAgcGFja2FnZUNvbmZpZy5vcHRpb25zLnVzZVNuaXBwZXRzQW5kRnVuY3Rpb25cbiAgICApIHtcblxuICAgICAgaWYgKCFpc0luRnVuRGVmKSB7XG5cbiAgICAgICAgb2JqLl9zbmlwcGV0ID0gYnVpbGRTbmlwcGV0KHBhcmFtcywgb2JqLm5hbWUpO1xuICAgICAgfVxuXG4gICAgICBvYmouX2hhc1BhcmFtcyA9IHBhcmFtcy5sZW5ndGggPyB0cnVlIDogZmFsc2U7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICBpZiAoIWlzSW5GdW5EZWYpIHtcblxuICAgICAgICBvYmouX3NuaXBwZXQgPSBwYXJhbXMubGVuZ3RoID8gYCR7b2JqLm5hbWV9KFxcJHskezB9OlxcJHt9fSlgIDogYCR7b2JqLm5hbWV9KClgO1xuICAgICAgfVxuXG4gICAgICBvYmouX2Rpc3BsYXlUZXh0ID0gYnVpbGREaXNwbGF5VGV4dChwYXJhbXMsIG9iai5uYW1lKTtcbiAgICB9XG5cbiAgICBvYmouX3R5cGVTZWxmID0gJ2Z1bmN0aW9uJztcbiAgfVxuXG4gIGlmIChvYmoubmFtZSkge1xuXG4gICAgaWYgKG9iai5sZWZ0TGFiZWwgPT09IG9iai5uYW1lKSB7XG5cbiAgICAgIG9iai5sZWZ0TGFiZWwgPSBudWxsO1xuICAgICAgb2JqLnJpZ2h0TGFiZWwgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGlmIChvYmoubGVmdExhYmVsID09PSBvYmoucmlnaHRMYWJlbCkge1xuXG4gICAgb2JqLnJpZ2h0TGFiZWwgPSBudWxsO1xuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3Bvc2VBbGwoZGlzcG9zYWJsZXMpIHtcblxuICBmb3IgKGNvbnN0IGRpc3Bvc2FibGUgb2YgZGlzcG9zYWJsZXMpIHtcblxuICAgIGlmICghZGlzcG9zYWJsZSkge1xuXG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBkaXNwb3NhYmxlLmRpc3Bvc2UoKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gb3BlbkZpbGVBbmRHb1RvUG9zaXRpb24ocG9zaXRpb24sIGZpbGUpIHtcblxuICBhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGUpLnRoZW4oKHRleHRFZGl0b3IpID0+IHtcblxuICAgIGNvbnN0IGN1cnNvciA9IHRleHRFZGl0b3IuZ2V0TGFzdEN1cnNvcigpO1xuXG4gICAgaWYgKCFjdXJzb3IpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGN1cnNvci5zZXRCdWZmZXJQb3NpdGlvbihwb3NpdGlvbik7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb3BlbkZpbGVBbmRHb1RvKHN0YXJ0LCBmaWxlKSB7XG5cbiAgYXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlKS50aGVuKCh0ZXh0RWRpdG9yKSA9PiB7XG5cbiAgICBjb25zdCBidWZmZXIgPSB0ZXh0RWRpdG9yLmdldEJ1ZmZlcigpO1xuICAgIGNvbnN0IGN1cnNvciA9IHRleHRFZGl0b3IuZ2V0TGFzdEN1cnNvcigpO1xuXG4gICAgaWYgKFxuICAgICAgIWJ1ZmZlciB8fFxuICAgICAgIWN1cnNvclxuICAgICkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKGJ1ZmZlci5wb3NpdGlvbkZvckNoYXJhY3RlckluZGV4KHN0YXJ0KSk7XG4gICAgbWFya0RlZmluaXRpb25CdWZmZXJSYW5nZShjdXJzb3IsIHRleHRFZGl0b3IpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVRlcm5GaWxlKGNvbnRlbnQsIHJlc3RhcnRTZXJ2ZXIpIHtcblxuICBjb25zdCBwcm9qZWN0Um9vdCA9IG1hbmFnZXIuc2VydmVyICYmIG1hbmFnZXIuc2VydmVyLnByb2plY3REaXI7XG5cbiAgaWYgKCFwcm9qZWN0Um9vdCkge1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgd3JpdGVGaWxlKHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIHByb2plY3RSb290ICsgJy8udGVybi1wcm9qZWN0JyksIGNvbnRlbnQsIHJlc3RhcnRTZXJ2ZXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVGaWxlKGZpbGVQYXRoLCBjb250ZW50LCByZXN0YXJ0U2VydmVyKSB7XG5cbiAgZnMud3JpdGVGaWxlKGZpbGVQYXRoLCBjb250ZW50LCAoZXJyb3IpID0+IHtcblxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZVBhdGgpO1xuXG4gICAgaWYgKCFlcnJvciAmJiByZXN0YXJ0U2VydmVyKSB7XG5cbiAgICAgIG1hbmFnZXIucmVzdGFydFNlcnZlcigpO1xuICAgIH1cblxuICAgIGlmICghZXJyb3IpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG1lc3NhZ2UgPSAnQ291bGQgbm90IGNyZWF0ZS91cGRhdGUgLnRlcm4tcHJvamVjdCBmaWxlLiBVc2UgdGhlIFJFQURNRSB0byBtYW51YWxseSBjcmVhdGUgYSAudGVybi1wcm9qZWN0IGZpbGUuJztcblxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKG1lc3NhZ2UsIHtcblxuICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICB9KTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RpcmVjdG9yeShkaXIpIHtcblxuICB0cnkge1xuXG4gICAgcmV0dXJuIGZzLnN0YXRTeW5jKGRpcikuaXNEaXJlY3RvcnkoKTtcblxuICB9IGNhdGNoIChlcnJvcikge1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWxlRXhpc3RzKHBhdGgpIHtcblxuICB0cnkge1xuXG4gICAgZnMuYWNjZXNzU3luYyhwYXRoLCBmcy5GX09LLCAoZXJyb3IpID0+IHtcblxuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgfSk7XG5cbiAgfSBjYXRjaCAoZXJyb3IpIHtcblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmlsZUNvbnRlbnQoZmlsZVBhdGgsIHJvb3QpIHtcblxuICBjb25zdCBfZmlsZVBhdGggPSByb290ICsgZmlsZVBhdGg7XG4gIGNvbnN0IHJlc29sdmVkUGF0aCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIF9maWxlUGF0aCk7XG5cbiAgaWYgKGZpbGVFeGlzdHMocmVzb2x2ZWRQYXRoKSAhPT0gdW5kZWZpbmVkKSB7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gcmVhZEZpbGUocmVzb2x2ZWRQYXRoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlYWRGaWxlKHBhdGgpIHtcblxuICByZXR1cm4gZnMucmVhZEZpbGVTeW5jKHBhdGgsICd1dGY4Jyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRNYXJrZXJDaGVja3BvaW50KCkge1xuXG4gIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgY29uc3QgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpO1xuICBjb25zdCBjdXJzb3IgPSBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpO1xuXG4gIGlmICghY3Vyc29yKSB7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBtYXJrZXIgPSBidWZmZXIubWFya1Bvc2l0aW9uKGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpLCB7fSk7XG5cbiAgY2hlY2twb2ludHNEZWZpbml0aW9uLnB1c2goe1xuXG4gICAgbWFya2VyOiBtYXJrZXIsXG4gICAgZWRpdG9yOiBlZGl0b3JcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXJrZXJDaGVja3BvaW50QmFjaygpIHtcblxuICBpZiAoIWNoZWNrcG9pbnRzRGVmaW5pdGlvbi5sZW5ndGgpIHtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGNoZWNrcG9pbnQgPSBjaGVja3BvaW50c0RlZmluaXRpb24ucG9wKCk7XG5cbiAgb3BlbkZpbGVBbmRHb1RvUG9zaXRpb24oY2hlY2twb2ludC5tYXJrZXIuZ2V0UmFuZ2UoKS5zdGFydCwgY2hlY2twb2ludC5lZGl0b3IuZ2V0VVJJKCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFya0RlZmluaXRpb25CdWZmZXJSYW5nZShjdXJzb3IsIGVkaXRvcikge1xuXG4gIGNvbnN0IHJhbmdlID0gY3Vyc29yLmdldEN1cnJlbnRXb3JkQnVmZmVyUmFuZ2UoKTtcbiAgY29uc3QgbWFya2VyID0gZWRpdG9yLm1hcmtCdWZmZXJSYW5nZShyYW5nZSwge2ludmFsaWRhdGU6ICd0b3VjaCd9KTtcblxuICBjb25zdCBkZWNvcmF0aW9uID0gZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwge1xuXG4gICAgdHlwZTogJ2hpZ2hsaWdodCcsXG4gICAgY2xhc3M6ICdhdG9tLXRlcm5qcy1kZWZpbml0aW9uLW1hcmtlcicsXG4gICAgaW52YWxpZGF0ZTogJ3RvdWNoJ1xuICB9KTtcblxuICBpZiAoIWRlY29yYXRpb24pIHtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuXG4gICAgZGVjb3JhdGlvbi5zZXRQcm9wZXJ0aWVzKHtcblxuICAgICAgdHlwZTogJ2hpZ2hsaWdodCcsXG4gICAgICBjbGFzczogJ2F0b20tdGVybmpzLWRlZmluaXRpb24tbWFya2VyIGFjdGl2ZScsXG4gICAgICBpbnZhbGlkYXRlOiAndG91Y2gnXG4gICAgfSk7XG5cbiAgfSwgMSk7XG5cbiAgc2V0VGltZW91dCgoKSA9PiB7XG5cbiAgICBkZWNvcmF0aW9uLnNldFByb3BlcnRpZXMoe1xuXG4gICAgICB0eXBlOiAnaGlnaGxpZ2h0JyxcbiAgICAgIGNsYXNzOiAnYXRvbS10ZXJuanMtZGVmaW5pdGlvbi1tYXJrZXInLFxuICAgICAgaW52YWxpZGF0ZTogJ3RvdWNoJ1xuICAgIH0pO1xuXG4gIH0sIDE1MDEpO1xuXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuXG4gICAgbWFya2VyLmRlc3Ryb3koKTtcblxuICB9LCAyNTAwKTtcbn1cbiJdfQ==
//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/atom-ternjs/lib/atom-ternjs-helper.js
