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

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _atomTernjsHelper2 = require('././atom-ternjs-helper');

'use babel';

var DocumentationView = require('./atom-ternjs-documentation-view');

var Documentation = (function () {
  function Documentation() {
    _classCallCheck(this, Documentation);

    this.disposables = [];

    this.view = new DocumentationView();
    this.view.initialize(this);

    atom.views.getView(atom.workspace).appendChild(this.view);

    this.destroyDocumenationHandler = this.destroyOverlay.bind(this);
    _atomTernjsEvents2['default'].on('documentation-destroy-overlay', this.destroyDocumenationHandler);

    this.registerCommands();
  }

  _createClass(Documentation, [{
    key: 'registerCommands',
    value: function registerCommands() {

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:documentation', this.request.bind(this)));
    }
  }, {
    key: 'request',
    value: function request() {
      var _this = this;

      var editor = atom.workspace.getActiveTextEditor();

      if (!editor) {

        return;
      }

      var cursor = editor.getLastCursor();
      var position = cursor.getBufferPosition();

      _atomTernjsManager2['default'].client.update(editor).then(function (data) {

        _atomTernjsManager2['default'].client.documentation(atom.project.relativizePath(editor.getURI())[1], {

          line: position.row,
          ch: position.column

        }).then(function (data) {

          if (!data) {

            return;
          }

          _this.view.setData({

            doc: (0, _atomTernjsHelper2.replaceTags)(data.doc),
            origin: data.origin,
            type: (0, _atomTernjsHelper2.formatType)(data),
            url: data.url || ''
          });

          _this.show();
        });
      });
    }
  }, {
    key: 'show',
    value: function show() {

      if (!this.marker) {

        var editor = atom.workspace.getActiveTextEditor();
        var cursor = editor.getLastCursor();

        if (!editor || !cursor) {

          return;
        }

        this.marker = cursor.getMarker();

        if (!this.marker) {

          return;
        }

        this.overlayDecoration = editor.decorateMarker(this.marker, {

          type: 'overlay',
          item: this.view,
          'class': 'atom-ternjs-documentation',
          position: 'tale',
          invalidate: 'touch'
        });
      } else {

        this.marker.setProperties({

          type: 'overlay',
          item: this.view,
          'class': 'atom-ternjs-documentation',
          position: 'tale',
          invalidate: 'touch'
        });
      }
    }
  }, {
    key: 'destroyOverlay',
    value: function destroyOverlay() {

      if (this.overlayDecoration) {

        this.overlayDecoration.destroy();
      }

      this.overlayDecoration = null;
      this.marker = null;
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      (0, _atomTernjsHelper.disposeAll)(this.disposables);

      this.destroyOverlay();

      if (this.view) {

        this.view.destroy();
        this.view = undefined;
      }
    }
  }]);

  return Documentation;
})();

exports['default'] = new Documentation();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdGVmYW5vLmNvcmFsbG8vLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtZG9jdW1lbnRhdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O2lDQUlvQix1QkFBdUI7Ozs7Z0NBQ3ZCLHNCQUFzQjs7OztnQ0FDakIsc0JBQXNCOztpQ0FJeEMsd0JBQXdCOztBQVYvQixXQUFXLENBQUM7O0FBRVosSUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsa0NBQWtDLENBQUMsQ0FBQzs7SUFVaEUsYUFBYTtBQUVOLFdBRlAsYUFBYSxHQUVIOzBCQUZWLGFBQWE7O0FBSWYsUUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7O0FBRXRCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxpQkFBaUIsRUFBRSxDQUFDO0FBQ3BDLFFBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUUzQixRQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFMUQsUUFBSSxDQUFDLDBCQUEwQixHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pFLGtDQUFRLEVBQUUsQ0FBQywrQkFBK0IsRUFBRSxJQUFJLENBQUMsMEJBQTBCLENBQUMsQ0FBQzs7QUFFN0UsUUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7R0FDekI7O2VBZkcsYUFBYTs7V0FpQkQsNEJBQUc7O0FBRWpCLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLDJCQUEyQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFD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QUFJLEVBQUU7O0FBRWIsWUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNwQixZQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztPQUN2QjtLQUNGOzs7U0E1SEcsYUFBYTs7O3FCQStISixJQUFJLGFBQWEsRUFBRSIsImZpbGUiOiIvVXNlcnMvc3RlZmFuby5jb3JhbGxvLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLWRvY3VtZW50YXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuY29uc3QgRG9jdW1lbnRhdGlvblZpZXcgPSByZXF1aXJlKCcuL2F0b20tdGVybmpzLWRvY3VtZW50YXRpb24tdmlldycpO1xuXG5pbXBvcnQgbWFuYWdlciBmcm9tICcuL2F0b20tdGVybmpzLW1hbmFnZXInO1xuaW1wb3J0IGVtaXR0ZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1ldmVudHMnO1xuaW1wb3J0IHtkaXNwb3NlQWxsfSBmcm9tICcuL2F0b20tdGVybmpzLWhlbHBlcic7XG5pbXBvcnQge1xuICByZXBsYWNlVGFncyxcbiAgZm9ybWF0VHlwZVxufSBmcm9tICcuLy4vYXRvbS10ZXJuanMtaGVscGVyJztcblxuY2xhc3MgRG9jdW1lbnRhdGlvbiB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gW107XG5cbiAgICB0aGlzLnZpZXcgPSBuZXcgRG9jdW1lbnRhdGlvblZpZXcoKTtcbiAgICB0aGlzLnZpZXcuaW5pdGlhbGl6ZSh0aGlzKTtcblxuICAgIGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSkuYXBwZW5kQ2hpbGQodGhpcy52aWV3KTtcblxuICAgIHRoaXMuZGVzdHJveURvY3VtZW5hdGlvbkhhbmRsZXIgPSB0aGlzLmRlc3Ryb3lPdmVybGF5LmJpbmQodGhpcyk7XG4gICAgZW1pdHRlci5vbignZG9jdW1lbnRhdGlvbi1kZXN0cm95LW92ZXJsYXknLCB0aGlzLmRlc3Ryb3lEb2N1bWVuYXRpb25IYW5kbGVyKTtcblxuICAgIHRoaXMucmVnaXN0ZXJDb21tYW5kcygpO1xuICB9XG5cbiAgcmVnaXN0ZXJDb21tYW5kcygpIHtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdhdG9tLXRlcm5qczpkb2N1bWVudGF0aW9uJywgdGhpcy5yZXF1ZXN0LmJpbmQodGhpcykpKTtcbiAgfVxuXG4gIHJlcXVlc3QoKSB7XG5cbiAgICBsZXQgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuXG4gICAgaWYgKCFlZGl0b3IpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBjdXJzb3IgPSBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpO1xuICAgIGxldCBwb3NpdGlvbiA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpO1xuXG4gICAgbWFuYWdlci5jbGllbnQudXBkYXRlKGVkaXRvcikudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICBtYW5hZ2VyLmNsaWVudC5kb2N1bWVudGF0aW9uKGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChlZGl0b3IuZ2V0VVJJKCkpWzFdLCB7XG5cbiAgICAgICAgbGluZTogcG9zaXRpb24ucm93LFxuICAgICAgICBjaDogcG9zaXRpb24uY29sdW1uXG5cbiAgICAgIH0pLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICBpZiAoIWRhdGEpIHtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudmlldy5zZXREYXRhKHtcblxuICAgICAgICAgIGRvYzogcmVwbGFjZVRhZ3MoZGF0YS5kb2MpLFxuICAgICAgICAgIG9yaWdpbjogZGF0YS5vcmlnaW4sXG4gICAgICAgICAgdHlwZTogZm9ybWF0VHlwZShkYXRhKSxcbiAgICAgICAgICB1cmw6IGRhdGEudXJsIHx8ICcnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzaG93KCkge1xuXG4gICAgaWYgKCF0aGlzLm1hcmtlcikge1xuXG4gICAgICBsZXQgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgICAgbGV0IGN1cnNvciA9IGVkaXRvci5nZXRMYXN0Q3Vyc29yKCk7XG5cbiAgICAgIGlmICghZWRpdG9yIHx8ICFjdXJzb3IpIHtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMubWFya2VyID0gY3Vyc29yLmdldE1hcmtlcigpO1xuXG4gICAgICBpZiAoIXRoaXMubWFya2VyKSB7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm92ZXJsYXlEZWNvcmF0aW9uID0gZWRpdG9yLmRlY29yYXRlTWFya2VyKHRoaXMubWFya2VyLCB7XG5cbiAgICAgICAgdHlwZTogJ292ZXJsYXknLFxuICAgICAgICBpdGVtOiB0aGlzLnZpZXcsXG4gICAgICAgIGNsYXNzOiAnYXRvbS10ZXJuanMtZG9jdW1lbnRhdGlvbicsXG4gICAgICAgIHBvc2l0aW9uOiAndGFsZScsXG4gICAgICAgIGludmFsaWRhdGU6ICd0b3VjaCdcbiAgICAgIH0pO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgdGhpcy5tYXJrZXIuc2V0UHJvcGVydGllcyh7XG5cbiAgICAgICAgdHlwZTogJ292ZXJsYXknLFxuICAgICAgICBpdGVtOiB0aGlzLnZpZXcsXG4gICAgICAgIGNsYXNzOiAnYXRvbS10ZXJuanMtZG9jdW1lbnRhdGlvbicsXG4gICAgICAgIHBvc2l0aW9uOiAndGFsZScsXG4gICAgICAgIGludmFsaWRhdGU6ICd0b3VjaCdcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3lPdmVybGF5KCkge1xuXG4gICAgaWYgKHRoaXMub3ZlcmxheURlY29yYXRpb24pIHtcblxuICAgICAgdGhpcy5vdmVybGF5RGVjb3JhdGlvbi5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgdGhpcy5vdmVybGF5RGVjb3JhdGlvbiA9IG51bGw7XG4gICAgdGhpcy5tYXJrZXIgPSBudWxsO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcblxuICAgIGRpc3Bvc2VBbGwodGhpcy5kaXNwb3NhYmxlcyk7XG5cbiAgICB0aGlzLmRlc3Ryb3lPdmVybGF5KCk7XG5cbiAgICBpZiAodGhpcy52aWV3KSB7XG5cbiAgICAgIHRoaXMudmlldy5kZXN0cm95KCk7XG4gICAgICB0aGlzLnZpZXcgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBEb2N1bWVudGF0aW9uKCk7XG4iXX0=
//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/atom-ternjs/lib/atom-ternjs-documentation.js
