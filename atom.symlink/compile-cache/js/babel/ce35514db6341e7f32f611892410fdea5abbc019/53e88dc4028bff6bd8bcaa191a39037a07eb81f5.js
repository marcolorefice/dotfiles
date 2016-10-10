Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsEvents = require('./atom-ternjs-events');

var _atomTernjsEvents2 = _interopRequireDefault(_atomTernjsEvents);

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atom = require('atom');

var _underscorePlus = require('underscore-plus');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atomTernjsHelper = require('./atom-ternjs-helper');

'use babel';

var RenameView = require('./atom-ternjs-rename-view');

var Rename = (function () {
  function Rename() {
    _classCallCheck(this, Rename);

    this.disposables = [];

    this.renameView = new RenameView();
    this.renameView.initialize(this);

    this.renamePanel = atom.workspace.addBottomPanel({

      item: this.renameView,
      priority: 0
    });

    this.renamePanel.hide();

    atom.views.getView(this.renamePanel).classList.add('atom-ternjs-rename-panel', 'panel-bottom');

    this.hideHandler = this.hide.bind(this);
    _atomTernjsEvents2['default'].on('rename-hide', this.hideHandler);

    this.registerCommands();
  }

  _createClass(Rename, [{
    key: 'registerCommands',
    value: function registerCommands() {

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:rename', this.show.bind(this)));
    }
  }, {
    key: 'hide',
    value: function hide() {

      if (!this.renamePanel) {

        return;
      }

      this.renamePanel.hide();

      (0, _atomTernjsHelper.focusEditor)();
    }
  }, {
    key: 'show',
    value: function show() {

      var codeEditor = atom.workspace.getActiveTextEditor();
      var currentNameRange = codeEditor.getLastCursor().getCurrentWordBufferRange({ includeNonWordCharacters: false });
      var currentName = codeEditor.getTextInBufferRange(currentNameRange);

      this.renameView.nameEditor.getModel().setText(currentName);
      this.renameView.nameEditor.getModel().selectAll();

      this.renamePanel.show();
      this.renameView.nameEditor.focus();
    }
  }, {
    key: 'updateAllAndRename',
    value: function updateAllAndRename(newName) {
      var _this = this;

      if (!_atomTernjsManager2['default'].client) {

        this.hide();

        return;
      }

      var idx = 0;
      var editors = atom.workspace.getTextEditors();

      for (var editor of editors) {

        if (!_atomTernjsManager2['default'].isValidEditor(editor) || atom.project.relativizePath(editor.getURI())[0] !== _atomTernjsManager2['default'].client.projectDir) {

          idx++;

          continue;
        }

        _atomTernjsManager2['default'].client.update(editor).then(function (data) {

          if (++idx === editors.length) {

            var activeEditor = atom.workspace.getActiveTextEditor();
            var cursor = activeEditor.getLastCursor();

            if (!cursor) {

              return;
            }

            var position = cursor.getBufferPosition();

            _atomTernjsManager2['default'].client.rename(atom.project.relativizePath(activeEditor.getURI())[1], { line: position.row, ch: position.column }, newName).then(function (data) {

              if (!data) {

                return;
              }

              _this.rename(data);
            })['catch'](function (error) {

              atom.notifications.addError(error, {

                dismissable: false
              });
            });
          }
        });
      }
    }
  }, {
    key: 'rename',
    value: function rename(data) {

      var dir = _atomTernjsManager2['default'].server.projectDir;

      if (!dir) {

        return;
      }

      var translateColumnBy = data.changes[0].text.length - data.name.length;

      for (var change of data.changes) {

        change.file = change.file.replace(/^.\//, '');
        change.file = _path2['default'].resolve(atom.project.relativizePath(dir)[0], change.file);
      }

      var changes = (0, _underscorePlus.uniq)(data.changes, function (item) {

        return JSON.stringify(item);
      });

      var currentFile = false;
      var arr = [];
      var idx = 0;

      for (var change of changes) {

        if (currentFile !== change.file) {

          currentFile = change.file;
          idx = arr.push([]) - 1;
        }

        arr[idx].push(change);
      }

      for (var arrObj of arr) {

        this.openFilesAndRename(arrObj, translateColumnBy);
      }

      this.hide();
    }
  }, {
    key: 'openFilesAndRename',
    value: function openFilesAndRename(obj, translateColumnBy) {
      var _this2 = this;

      atom.workspace.open(obj[0].file).then(function (textEditor) {

        var currentColumnOffset = 0;
        var idx = 0;
        var buffer = textEditor.getBuffer();
        var checkpoint = buffer.createCheckpoint();

        for (var change of obj) {

          _this2.setTextInRange(buffer, change, currentColumnOffset, idx === obj.length - 1, textEditor);
          currentColumnOffset += translateColumnBy;

          idx++;
        }

        buffer.groupChangesSinceCheckpoint(checkpoint);
      });
    }
  }, {
    key: 'setTextInRange',
    value: function setTextInRange(buffer, change, offset, moveCursor, textEditor) {

      change.start += offset;
      change.end += offset;
      var position = buffer.positionForCharacterIndex(change.start);
      length = change.end - change.start;
      var end = position.translate(new _atom.Point(0, length));
      var range = new _atom.Range(position, end);
      buffer.setTextInRange(range, change.text);

      if (!moveCursor) {

        return;
      }

      var cursor = textEditor.getLastCursor();

      cursor && cursor.setBufferPosition(position);
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      (0, _atomTernjsHelper.disposeAll)(this.disposables);

      this.renameView && this.renameView.destroy();
      this.renameView = null;

      this.renamePanel && this.renamePanel.destroy();
      this.renamePanel = null;
    }
  }]);

  return Rename;
})();

exports['default'] = new Rename();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdGVmYW5vLmNvcmFsbG8vLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtcmVuYW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Z0NBSW9CLHNCQUFzQjs7OztpQ0FDdEIsdUJBQXVCOzs7O29CQUlwQyxNQUFNOzs4QkFDTSxpQkFBaUI7O29CQUNuQixNQUFNOzs7O2dDQUloQixzQkFBc0I7O0FBZjdCLFdBQVcsQ0FBQzs7QUFFWixJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQzs7SUFlbEQsTUFBTTtBQUVDLFdBRlAsTUFBTSxHQUVJOzBCQUZWLE1BQU07O0FBSVIsUUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7O0FBRXRCLFFBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztBQUNuQyxRQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFakMsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQzs7QUFFL0MsVUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVO0FBQ3JCLGNBQVEsRUFBRSxDQUFDO0tBQ1osQ0FBQyxDQUFDOztBQUVILFFBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRXhCLFFBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLDBCQUEwQixFQUFFLGNBQWMsQ0FBQyxDQUFDOztBQUUvRixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hDLGtDQUFRLEVBQUUsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUU1QyxRQUFJ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O0tBQ3pCOzs7U0FqTkcsTUFBTTs7O3FCQW9ORyxJQUFJLE1BQU0sRUFBRSIsImZpbGUiOiIvVXNlcnMvc3RlZmFuby5jb3JhbGxvLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXJlbmFtZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5jb25zdCBSZW5hbWVWaWV3ID0gcmVxdWlyZSgnLi9hdG9tLXRlcm5qcy1yZW5hbWUtdmlldycpO1xuXG5pbXBvcnQgZW1pdHRlciBmcm9tICcuL2F0b20tdGVybmpzLWV2ZW50cyc7XG5pbXBvcnQgbWFuYWdlciBmcm9tICcuL2F0b20tdGVybmpzLW1hbmFnZXInO1xuaW1wb3J0IHtcbiAgUG9pbnQsXG4gIFJhbmdlXG59IGZyb20gJ2F0b20nO1xuaW1wb3J0IHt1bmlxfSBmcm9tICd1bmRlcnNjb3JlLXBsdXMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQge1xuICBkaXNwb3NlQWxsLFxuICBmb2N1c0VkaXRvclxufSBmcm9tICcuL2F0b20tdGVybmpzLWhlbHBlcic7XG5cbmNsYXNzIFJlbmFtZSB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gW107XG5cbiAgICB0aGlzLnJlbmFtZVZpZXcgPSBuZXcgUmVuYW1lVmlldygpO1xuICAgIHRoaXMucmVuYW1lVmlldy5pbml0aWFsaXplKHRoaXMpO1xuXG4gICAgdGhpcy5yZW5hbWVQYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZEJvdHRvbVBhbmVsKHtcblxuICAgICAgaXRlbTogdGhpcy5yZW5hbWVWaWV3LFxuICAgICAgcHJpb3JpdHk6IDBcbiAgICB9KTtcblxuICAgIHRoaXMucmVuYW1lUGFuZWwuaGlkZSgpO1xuXG4gICAgYXRvbS52aWV3cy5nZXRWaWV3KHRoaXMucmVuYW1lUGFuZWwpLmNsYXNzTGlzdC5hZGQoJ2F0b20tdGVybmpzLXJlbmFtZS1wYW5lbCcsICdwYW5lbC1ib3R0b20nKTtcblxuICAgIHRoaXMuaGlkZUhhbmRsZXIgPSB0aGlzLmhpZGUuYmluZCh0aGlzKTtcbiAgICBlbWl0dGVyLm9uKCdyZW5hbWUtaGlkZScsIHRoaXMuaGlkZUhhbmRsZXIpO1xuXG4gICAgdGhpcy5yZWdpc3RlckNvbW1hbmRzKCk7XG4gIH1cblxuICByZWdpc3RlckNvbW1hbmRzKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ2F0b20tdGVybmpzOnJlbmFtZScsIHRoaXMuc2hvdy5iaW5kKHRoaXMpKSk7XG4gIH1cblxuICBoaWRlKCkge1xuXG4gICAgaWYgKCF0aGlzLnJlbmFtZVBhbmVsKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnJlbmFtZVBhbmVsLmhpZGUoKTtcblxuICAgIGZvY3VzRWRpdG9yKCk7XG4gIH1cblxuICBzaG93KCkge1xuXG4gICAgY29uc3QgY29kZUVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICBjb25zdCBjdXJyZW50TmFtZVJhbmdlID0gY29kZUVkaXRvci5nZXRMYXN0Q3Vyc29yKCkuZ2V0Q3VycmVudFdvcmRCdWZmZXJSYW5nZSh7aW5jbHVkZU5vbldvcmRDaGFyYWN0ZXJzOiBmYWxzZX0pO1xuICAgIGNvbnN0IGN1cnJlbnROYW1lID0gY29kZUVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShjdXJyZW50TmFtZVJhbmdlKTtcblxuICAgIHRoaXMucmVuYW1lVmlldy5uYW1lRWRpdG9yLmdldE1vZGVsKCkuc2V0VGV4dChjdXJyZW50TmFtZSk7XG4gICAgdGhpcy5yZW5hbWVWaWV3Lm5hbWVFZGl0b3IuZ2V0TW9kZWwoKS5zZWxlY3RBbGwoKTtcblxuICAgIHRoaXMucmVuYW1lUGFuZWwuc2hvdygpO1xuICAgIHRoaXMucmVuYW1lVmlldy5uYW1lRWRpdG9yLmZvY3VzKCk7XG4gIH1cblxuICB1cGRhdGVBbGxBbmRSZW5hbWUobmV3TmFtZSkge1xuXG4gICAgaWYgKCFtYW5hZ2VyLmNsaWVudCkge1xuXG4gICAgICB0aGlzLmhpZGUoKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBpZHggPSAwO1xuICAgIGNvbnN0IGVkaXRvcnMgPSBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpO1xuXG4gICAgZm9yIChjb25zdCBlZGl0b3Igb2YgZWRpdG9ycykge1xuXG4gICAgICBpZiAoXG4gICAgICAgICFtYW5hZ2VyLmlzVmFsaWRFZGl0b3IoZWRpdG9yKSB8fFxuICAgICAgICBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZWRpdG9yLmdldFVSSSgpKVswXSAhPT0gbWFuYWdlci5jbGllbnQucHJvamVjdERpclxuICAgICAgKSB7XG5cbiAgICAgICAgaWR4Kys7XG5cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIG1hbmFnZXIuY2xpZW50LnVwZGF0ZShlZGl0b3IpLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICBpZiAoKytpZHggPT09IGVkaXRvcnMubGVuZ3RoKSB7XG5cbiAgICAgICAgICBjb25zdCBhY3RpdmVFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgICAgICAgY29uc3QgY3Vyc29yID0gYWN0aXZlRWRpdG9yLmdldExhc3RDdXJzb3IoKTtcblxuICAgICAgICAgIGlmICghY3Vyc29yKSB7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpO1xuXG4gICAgICAgICAgbWFuYWdlci5jbGllbnQucmVuYW1lKGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChhY3RpdmVFZGl0b3IuZ2V0VVJJKCkpWzFdLCB7bGluZTogcG9zaXRpb24ucm93LCBjaDogcG9zaXRpb24uY29sdW1ufSwgbmV3TmFtZSkudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgICBpZiAoIWRhdGEpIHtcblxuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucmVuYW1lKGRhdGEpO1xuXG4gICAgICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7XG5cbiAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihlcnJvciwge1xuXG4gICAgICAgICAgICAgIGRpc21pc3NhYmxlOiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJlbmFtZShkYXRhKSB7XG5cbiAgICBjb25zdCBkaXIgPSBtYW5hZ2VyLnNlcnZlci5wcm9qZWN0RGlyO1xuXG4gICAgaWYgKCFkaXIpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRyYW5zbGF0ZUNvbHVtbkJ5ID0gZGF0YS5jaGFuZ2VzWzBdLnRleHQubGVuZ3RoIC0gZGF0YS5uYW1lLmxlbmd0aDtcblxuICAgIGZvciAobGV0IGNoYW5nZSBvZiBkYXRhLmNoYW5nZXMpIHtcblxuICAgICAgY2hhbmdlLmZpbGUgPSBjaGFuZ2UuZmlsZS5yZXBsYWNlKC9eLlxcLy8sICcnKTtcbiAgICAgIGNoYW5nZS5maWxlID0gcGF0aC5yZXNvbHZlKGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChkaXIpWzBdLCBjaGFuZ2UuZmlsZSk7XG4gICAgfVxuXG4gICAgbGV0IGNoYW5nZXMgPSB1bmlxKGRhdGEuY2hhbmdlcywgKGl0ZW0pID0+IHtcblxuICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGl0ZW0pO1xuICAgIH0pO1xuXG4gICAgbGV0IGN1cnJlbnRGaWxlID0gZmFsc2U7XG4gICAgbGV0IGFyciA9IFtdO1xuICAgIGxldCBpZHggPSAwO1xuXG4gICAgZm9yIChjb25zdCBjaGFuZ2Ugb2YgY2hhbmdlcykge1xuXG4gICAgICBpZiAoY3VycmVudEZpbGUgIT09IGNoYW5nZS5maWxlKSB7XG5cbiAgICAgICAgY3VycmVudEZpbGUgPSBjaGFuZ2UuZmlsZTtcbiAgICAgICAgaWR4ID0gYXJyLnB1c2goW10pIC0gMTtcbiAgICAgIH1cblxuICAgICAgYXJyW2lkeF0ucHVzaChjaGFuZ2UpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgYXJyT2JqIG9mIGFycikge1xuXG4gICAgICB0aGlzLm9wZW5GaWxlc0FuZFJlbmFtZShhcnJPYmosIHRyYW5zbGF0ZUNvbHVtbkJ5KTtcbiAgICB9XG5cbiAgICB0aGlzLmhpZGUoKTtcbiAgfVxuXG4gIG9wZW5GaWxlc0FuZFJlbmFtZShvYmosIHRyYW5zbGF0ZUNvbHVtbkJ5KSB7XG5cbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuKG9ialswXS5maWxlKS50aGVuKCh0ZXh0RWRpdG9yKSA9PiB7XG5cbiAgICAgIGxldCBjdXJyZW50Q29sdW1uT2Zmc2V0ID0gMDtcbiAgICAgIGxldCBpZHggPSAwO1xuICAgICAgY29uc3QgYnVmZmVyID0gdGV4dEVkaXRvci5nZXRCdWZmZXIoKTtcbiAgICAgIGNvbnN0IGNoZWNrcG9pbnQgPSBidWZmZXIuY3JlYXRlQ2hlY2twb2ludCgpO1xuXG4gICAgICBmb3IgKGNvbnN0IGNoYW5nZSBvZiBvYmopIHtcblxuICAgICAgICB0aGlzLnNldFRleHRJblJhbmdlKGJ1ZmZlciwgY2hhbmdlLCBjdXJyZW50Q29sdW1uT2Zmc2V0LCBpZHggPT09IG9iai5sZW5ndGggLSAxLCB0ZXh0RWRpdG9yKTtcbiAgICAgICAgY3VycmVudENvbHVtbk9mZnNldCArPSB0cmFuc2xhdGVDb2x1bW5CeTtcblxuICAgICAgICBpZHgrKztcbiAgICAgIH1cblxuICAgICAgYnVmZmVyLmdyb3VwQ2hhbmdlc1NpbmNlQ2hlY2twb2ludChjaGVja3BvaW50KTtcbiAgICB9KTtcbiAgfVxuXG4gIHNldFRleHRJblJhbmdlKGJ1ZmZlciwgY2hhbmdlLCBvZmZzZXQsIG1vdmVDdXJzb3IsIHRleHRFZGl0b3IpIHtcblxuICAgIGNoYW5nZS5zdGFydCArPSBvZmZzZXQ7XG4gICAgY2hhbmdlLmVuZCArPSBvZmZzZXQ7XG4gICAgY29uc3QgcG9zaXRpb24gPSBidWZmZXIucG9zaXRpb25Gb3JDaGFyYWN0ZXJJbmRleChjaGFuZ2Uuc3RhcnQpO1xuICAgIGxlbmd0aCA9IGNoYW5nZS5lbmQgLSBjaGFuZ2Uuc3RhcnQ7XG4gICAgY29uc3QgZW5kID0gcG9zaXRpb24udHJhbnNsYXRlKG5ldyBQb2ludCgwLCBsZW5ndGgpKTtcbiAgICBjb25zdCByYW5nZSA9IG5ldyBSYW5nZShwb3NpdGlvbiwgZW5kKTtcbiAgICBidWZmZXIuc2V0VGV4dEluUmFuZ2UocmFuZ2UsIGNoYW5nZS50ZXh0KTtcblxuICAgIGlmICghbW92ZUN1cnNvcikge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY3Vyc29yID0gdGV4dEVkaXRvci5nZXRMYXN0Q3Vyc29yKCk7XG5cbiAgICBjdXJzb3IgJiYgY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG5cbiAgICBkaXNwb3NlQWxsKHRoaXMuZGlzcG9zYWJsZXMpO1xuXG4gICAgdGhpcy5yZW5hbWVWaWV3ICYmIHRoaXMucmVuYW1lVmlldy5kZXN0cm95KCk7XG4gICAgdGhpcy5yZW5hbWVWaWV3ID0gbnVsbDtcblxuICAgIHRoaXMucmVuYW1lUGFuZWwgJiYgdGhpcy5yZW5hbWVQYW5lbC5kZXN0cm95KCk7XG4gICAgdGhpcy5yZW5hbWVQYW5lbCA9IG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IFJlbmFtZSgpO1xuIl19
//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/atom-ternjs/lib/atom-ternjs-rename.js
