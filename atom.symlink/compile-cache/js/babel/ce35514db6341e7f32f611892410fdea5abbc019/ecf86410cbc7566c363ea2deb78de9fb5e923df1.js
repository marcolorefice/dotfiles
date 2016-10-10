Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsEvents = require('./atom-ternjs-events');

var _atomTernjsEvents2 = _interopRequireDefault(_atomTernjsEvents);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _underscorePlus = require('underscore-plus');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atom = require('atom');

var _atomTernjsHelper = require('./atom-ternjs-helper');

'use babel';

var ReferenceView = require('./atom-ternjs-reference-view');

var Reference = (function () {
  function Reference() {
    _classCallCheck(this, Reference);

    this.disposables = [];
    this.references = [];

    this.referenceView = new ReferenceView();
    this.referenceView.initialize(this);

    this.referencePanel = atom.workspace.addBottomPanel({

      item: this.referenceView,
      priority: 0
    });

    this.referencePanel.hide();

    atom.views.getView(this.referencePanel).classList.add('atom-ternjs-reference-panel', 'panel-bottom');

    this.hideHandler = this.hide.bind(this);
    _atomTernjsEvents2['default'].on('reference-hide', this.hideHandler);

    this.registerCommands();
  }

  _createClass(Reference, [{
    key: 'registerCommands',
    value: function registerCommands() {

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:references', this.findReference.bind(this)));
    }
  }, {
    key: 'goToReference',
    value: function goToReference(idx) {

      var ref = this.references.refs[idx];

      (0, _atomTernjsHelper.openFileAndGoTo)(ref.start, ref.file);
    }
  }, {
    key: 'findReference',
    value: function findReference() {
      var _this = this;

      var editor = atom.workspace.getActiveTextEditor();
      var cursor = editor.getLastCursor();

      if (!_atomTernjsManager2['default'].client || !editor || !cursor) {

        return;
      }

      var position = cursor.getBufferPosition();

      _atomTernjsManager2['default'].client.update(editor).then(function (data) {
        _atomTernjsManager2['default'].client.refs(atom.project.relativizePath(editor.getURI())[1], { line: position.row, ch: position.column }).then(function (data) {

          if (!data) {

            atom.notifications.addInfo('No references found.', { dismissable: false });

            return;
          }

          _this.references = data;

          for (var reference of data.refs) {

            reference.file = reference.file.replace(/^.\//, '');
            reference.file = _path2['default'].resolve(atom.project.relativizePath(_atomTernjsManager2['default'].server.projectDir)[0], reference.file);
          }

          data.refs = (0, _underscorePlus.uniq)(data.refs, function (item) {

            return JSON.stringify(item);
          });

          data = _this.gatherMeta(data);
          _this.referenceView.buildItems(data);
          _this.referencePanel.show();
        });
      });
    }
  }, {
    key: 'gatherMeta',
    value: function gatherMeta(data) {

      for (var item of data.refs) {

        var content = _fs2['default'].readFileSync(item.file, 'utf8');
        var buffer = new _atom.TextBuffer({ text: content });

        item.position = buffer.positionForCharacterIndex(item.start);
        item.lineText = buffer.lineForRow(item.position.row);

        buffer.destroy();
      }

      return data;
    }
  }, {
    key: 'hide',
    value: function hide() {

      if (!this.referencePanel) {

        return;
      }

      this.referencePanel.hide();

      (0, _atomTernjsHelper.focusEditor)();
    }
  }, {
    key: 'show',
    value: function show() {

      this.referencePanel.show();
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      this.referenceView && this.referenceView.destroy();
      this.referenceView = null;

      this.referencePanel && this.referencePanel.destroy();
      this.referencePanel = null;
    }
  }]);

  return Reference;
})();

exports['default'] = new Reference();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdGVmYW5vLmNvcmFsbG8vLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtcmVmZXJlbmNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7aUNBSW9CLHVCQUF1Qjs7OztnQ0FDdkIsc0JBQXNCOzs7O2tCQUMzQixJQUFJOzs7OzhCQUNBLGlCQUFpQjs7b0JBQ25CLE1BQU07Ozs7b0JBQ0UsTUFBTTs7Z0NBSXhCLHNCQUFzQjs7QUFiN0IsV0FBVyxDQUFDOztBQUVaLElBQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDOztJQWF4RCxTQUFTO0FBRUYsV0FGUCxTQUFTLEdBRUM7MEJBRlYsU0FBUzs7QUFJWCxRQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUN0QixRQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQzs7QUFFckIsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO0FBQ3pDLFFBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVwQyxRQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDOztBQUVsRCxVQUFJLEVBQUUsSUFBSSxDQUFDLGFBQWE7QUFDeEIsY0FBUSxFQUFFLENBQUM7S0FDWixDQUFDLENBQUM7O0FBRUgsUUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFM0IsUUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUUsY0FBYyxDQUFDLENBQUM7O0FBRXJHLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEMsa0NBQVEsRUFBRSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFL0MsUUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7R0FDekI7O2VBeEJHLFNBQVM7O1dBMEJHLDRCQUFHOztBQUVqQixVQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSx3QkFBd0IsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDdkg7OztXQUVZLHVCQUFDLEdBQUcsRUFBRTs7QUFFakIsVUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRXRDLDZDQUFnQixHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN0Qzs7O1dBRVkseUJBQUc7OztBQUVkLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztBQUNwRCxVQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7O0FBRXRDLFVBQ0UsQ0FBQywrQkFBUSxNQUFNLElBQ2YsQ0FBQyxNQUFNLElBQ1AsQ0FBQyxNQUFNLEVBQ1A7O0FBRUEsZUFBTztPQUNSOztBQUVELFVBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDOztBQUU1QyxxQ0FBUSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksRUFBSztBQUMzQyx1Q0FBUSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLFFBQVEsQ0FBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLElBQUksRUFBSzs7QUFFN0gsY0FBSSxDQUFDLElBQUksRUFBRTs7QUFFVCxnQkFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLEVBQUUsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQzs7QUFFM0UsbUJBQU87V0FDUjs7QUFFRCxnQkFBSyxVQUFVLEdBQUcsSUFBSSxDQUFDOztBQUV2QixlQUFLLElBQUksU0FBUyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7O0FBRS9CLHFCQUFTLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNwRCxxQkFBUyxDQUFDLElBQUksR0FBRyxrQkFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsK0JBQVEsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztXQUMxRzs7QUFFRCxjQUFJLENBQUMsSUFBSSxHQUFHLDBCQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsVUFBQyxJQUFJLEVBQUs7O0FBRXBDLG1CQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7V0FDN0IsQ0FBQyxDQUFDOztBQUVILGNBQUksR0FBRyxNQUFLLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QixnQkFBSyxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BDLGdCQUFLLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUM1QixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSjs7O1dBRVMsb0JBQUMsSUFBSSxFQUFFOztBQUVmLFdBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTs7QUFFMUIsWUFBTSxPQUFPLEdBQUcsZ0JBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDbkQsWUFBTSxNQUFNLEdBQUcscUJBQWUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQzs7QUFFakQsWUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzdELFlBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVyRCxjQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7T0FDbEI7O0FBRUQsYUFBTyxJQUFJLENBQUM7S0FDYjs7O1dBRUcsZ0JBQUc7O0FBRUwsVUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7O0FBRXhCLGVBQU87T0FDUjs7QUFFRCxVQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDOztBQUUzQiwwQ0FBYSxDQUFDO0tBQ2Y7OztXQUVHLGdCQUFHOztBQUVMLFVBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDNUI7OztXQUVNLG1CQUFHOztBQUVSLFVBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNuRCxVQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQzs7QUFFMUIsVUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3JELFVBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO0tBQzVCOzs7U0E1SEcsU0FBUzs7O3FCQStIQSxJQUFJLFNBQVMsRUFBRSIsImZpbGUiOiIvVXNlcnMvc3RlZmFuby5jb3JhbGxvLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXJlZmVyZW5jZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5jb25zdCBSZWZlcmVuY2VWaWV3ID0gcmVxdWlyZSgnLi9hdG9tLXRlcm5qcy1yZWZlcmVuY2UtdmlldycpO1xuXG5pbXBvcnQgbWFuYWdlciBmcm9tICcuL2F0b20tdGVybmpzLW1hbmFnZXInO1xuaW1wb3J0IGVtaXR0ZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1ldmVudHMnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCB7dW5pcX0gZnJvbSAndW5kZXJzY29yZS1wbHVzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtUZXh0QnVmZmVyfSBmcm9tICdhdG9tJztcbmltcG9ydCB7XG4gIG9wZW5GaWxlQW5kR29UbyxcbiAgZm9jdXNFZGl0b3Jcbn0gZnJvbSAnLi9hdG9tLXRlcm5qcy1oZWxwZXInO1xuXG5jbGFzcyBSZWZlcmVuY2Uge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IFtdO1xuICAgIHRoaXMucmVmZXJlbmNlcyA9IFtdO1xuXG4gICAgdGhpcy5yZWZlcmVuY2VWaWV3ID0gbmV3IFJlZmVyZW5jZVZpZXcoKTtcbiAgICB0aGlzLnJlZmVyZW5jZVZpZXcuaW5pdGlhbGl6ZSh0aGlzKTtcblxuICAgIHRoaXMucmVmZXJlbmNlUGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRCb3R0b21QYW5lbCh7XG5cbiAgICAgIGl0ZW06IHRoaXMucmVmZXJlbmNlVmlldyxcbiAgICAgIHByaW9yaXR5OiAwXG4gICAgfSk7XG5cbiAgICB0aGlzLnJlZmVyZW5jZVBhbmVsLmhpZGUoKTtcblxuICAgIGF0b20udmlld3MuZ2V0Vmlldyh0aGlzLnJlZmVyZW5jZVBhbmVsKS5jbGFzc0xpc3QuYWRkKCdhdG9tLXRlcm5qcy1yZWZlcmVuY2UtcGFuZWwnLCAncGFuZWwtYm90dG9tJyk7XG5cbiAgICB0aGlzLmhpZGVIYW5kbGVyID0gdGhpcy5oaWRlLmJpbmQodGhpcyk7XG4gICAgZW1pdHRlci5vbigncmVmZXJlbmNlLWhpZGUnLCB0aGlzLmhpZGVIYW5kbGVyKTtcblxuICAgIHRoaXMucmVnaXN0ZXJDb21tYW5kcygpO1xuICB9XG5cbiAgcmVnaXN0ZXJDb21tYW5kcygpIHtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdhdG9tLXRlcm5qczpyZWZlcmVuY2VzJywgdGhpcy5maW5kUmVmZXJlbmNlLmJpbmQodGhpcykpKTtcbiAgfVxuXG4gIGdvVG9SZWZlcmVuY2UoaWR4KSB7XG5cbiAgICBjb25zdCByZWYgPSB0aGlzLnJlZmVyZW5jZXMucmVmc1tpZHhdO1xuXG4gICAgb3BlbkZpbGVBbmRHb1RvKHJlZi5zdGFydCwgcmVmLmZpbGUpO1xuICB9XG5cbiAgZmluZFJlZmVyZW5jZSgpIHtcblxuICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICBjb25zdCBjdXJzb3IgPSBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpO1xuXG4gICAgaWYgKFxuICAgICAgIW1hbmFnZXIuY2xpZW50IHx8XG4gICAgICAhZWRpdG9yIHx8XG4gICAgICAhY3Vyc29yXG4gICAgKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwb3NpdGlvbiA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpO1xuXG4gICAgbWFuYWdlci5jbGllbnQudXBkYXRlKGVkaXRvcikudGhlbigoZGF0YSkgPT4ge1xuICAgICAgbWFuYWdlci5jbGllbnQucmVmcyhhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZWRpdG9yLmdldFVSSSgpKVsxXSwge2xpbmU6IHBvc2l0aW9uLnJvdywgY2g6IHBvc2l0aW9uLmNvbHVtbn0pLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICBpZiAoIWRhdGEpIHtcblxuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKCdObyByZWZlcmVuY2VzIGZvdW5kLicsIHsgZGlzbWlzc2FibGU6IGZhbHNlIH0pO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZWZlcmVuY2VzID0gZGF0YTtcblxuICAgICAgICBmb3IgKGxldCByZWZlcmVuY2Ugb2YgZGF0YS5yZWZzKSB7XG5cbiAgICAgICAgICByZWZlcmVuY2UuZmlsZSA9IHJlZmVyZW5jZS5maWxlLnJlcGxhY2UoL14uXFwvLywgJycpO1xuICAgICAgICAgIHJlZmVyZW5jZS5maWxlID0gcGF0aC5yZXNvbHZlKGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChtYW5hZ2VyLnNlcnZlci5wcm9qZWN0RGlyKVswXSwgcmVmZXJlbmNlLmZpbGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgZGF0YS5yZWZzID0gdW5pcShkYXRhLnJlZnMsIChpdGVtKSA9PiB7XG5cbiAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoaXRlbSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRhdGEgPSB0aGlzLmdhdGhlck1ldGEoZGF0YSk7XG4gICAgICAgIHRoaXMucmVmZXJlbmNlVmlldy5idWlsZEl0ZW1zKGRhdGEpO1xuICAgICAgICB0aGlzLnJlZmVyZW5jZVBhbmVsLnNob3coKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZ2F0aGVyTWV0YShkYXRhKSB7XG5cbiAgICBmb3IgKGxldCBpdGVtIG9mIGRhdGEucmVmcykge1xuXG4gICAgICBjb25zdCBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKGl0ZW0uZmlsZSwgJ3V0ZjgnKTtcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBUZXh0QnVmZmVyKHsgdGV4dDogY29udGVudCB9KTtcblxuICAgICAgaXRlbS5wb3NpdGlvbiA9IGJ1ZmZlci5wb3NpdGlvbkZvckNoYXJhY3RlckluZGV4KGl0ZW0uc3RhcnQpO1xuICAgICAgaXRlbS5saW5lVGV4dCA9IGJ1ZmZlci5saW5lRm9yUm93KGl0ZW0ucG9zaXRpb24ucm93KTtcblxuICAgICAgYnVmZmVyLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIGhpZGUoKSB7XG5cbiAgICBpZiAoIXRoaXMucmVmZXJlbmNlUGFuZWwpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucmVmZXJlbmNlUGFuZWwuaGlkZSgpO1xuXG4gICAgZm9jdXNFZGl0b3IoKTtcbiAgfVxuXG4gIHNob3coKSB7XG5cbiAgICB0aGlzLnJlZmVyZW5jZVBhbmVsLnNob3coKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG5cbiAgICB0aGlzLnJlZmVyZW5jZVZpZXcgJiYgdGhpcy5yZWZlcmVuY2VWaWV3LmRlc3Ryb3koKTtcbiAgICB0aGlzLnJlZmVyZW5jZVZpZXcgPSBudWxsO1xuXG4gICAgdGhpcy5yZWZlcmVuY2VQYW5lbCAmJiB0aGlzLnJlZmVyZW5jZVBhbmVsLmRlc3Ryb3koKTtcbiAgICB0aGlzLnJlZmVyZW5jZVBhbmVsID0gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgUmVmZXJlbmNlKCk7XG4iXX0=
//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/atom-ternjs/lib/atom-ternjs-reference.js
