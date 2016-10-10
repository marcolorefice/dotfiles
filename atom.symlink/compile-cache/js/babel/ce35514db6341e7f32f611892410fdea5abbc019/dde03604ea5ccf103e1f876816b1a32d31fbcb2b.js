Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsPackageConfig = require('./atom-ternjs-package-config');

var _atomTernjsPackageConfig2 = _interopRequireDefault(_atomTernjsPackageConfig);

var _atomTernjsEvents = require('./atom-ternjs-events');

var _atomTernjsEvents2 = _interopRequireDefault(_atomTernjsEvents);

var _atom = require('atom');

var _atomTernjsHelper = require('./atom-ternjs-helper');

'use babel';

var TypeView = require('./atom-ternjs-type-view');
var TOLERANCE = 20;

var Type = (function () {
  function Type() {
    _classCallCheck(this, Type);

    this.view = undefined;
    this.overlayDecoration = undefined;
    this.marker = undefined;

    this.view = new TypeView();
    this.view.initialize(this);

    atom.views.getView(atom.workspace).appendChild(this.view);

    this.destroyOverlayHandler = this.destroyOverlay.bind(this);

    _atomTernjsEvents2['default'].on('type-destroy-overlay', this.destroyOverlayHandler);
  }

  _createClass(Type, [{
    key: 'setPosition',
    value: function setPosition() {

      if (!this.marker) {

        var editor = atom.workspace.getActiveTextEditor();

        if (!editor) {

          return;
        }

        this.marker = editor.getLastCursor && editor.getLastCursor().getMarker();

        if (!this.marker) {

          return;
        }

        this.overlayDecoration = editor.decorateMarker(this.marker, {

          type: 'overlay',
          item: this.view,
          'class': 'atom-ternjs-type',
          position: 'tale',
          invalidate: 'touch'
        });
      } else {

        this.marker.setProperties({

          type: 'overlay',
          item: this.view,
          'class': 'atom-ternjs-type',
          position: 'tale',
          invalidate: 'touch'
        });
      }
    }
  }, {
    key: 'queryType',
    value: function queryType(editor, cursor) {
      var _this = this;

      if (!_atomTernjsPackageConfig2['default'].options.inlineFnCompletion || !cursor || cursor.destroyed || !_atomTernjsManager2['default'].client) {

        return;
      }

      var scopeDescriptor = cursor.getScopeDescriptor();

      if (scopeDescriptor.scopes.join().match(/comment/)) {

        this.destroyOverlay();

        return;
      }

      var rowStart = 0;
      var rangeBefore = false;
      var tmp = false;
      var may = 0;
      var may2 = 0;
      var skipCounter = 0;
      var skipCounter2 = 0;
      var paramPosition = 0;
      var position = cursor.getBufferPosition();
      var buffer = editor.getBuffer();

      if (position.row - TOLERANCE < 0) {

        rowStart = 0;
      } else {

        rowStart = position.row - TOLERANCE;
      }

      buffer.backwardsScanInRange(/\]|\[|\(|\)|\,|\{|\}/g, new _atom.Range([rowStart, 0], [position.row, position.column]), function (obj) {

        // return early if we are inside a string
        if (editor.scopeDescriptorForBufferPosition(obj.range.start).scopes.join().match(/string/)) {

          return;
        }

        if (obj.matchText === '}') {

          may++;
          return;
        }

        if (obj.matchText === ']') {

          if (!tmp) {

            skipCounter2++;
          }

          may2++;
          return;
        }

        if (obj.matchText === '{') {

          if (!may) {

            rangeBefore = false;
            obj.stop();

            return;
          }

          may--;
          return;
        }

        if (obj.matchText === '[') {

          if (skipCounter2) {

            skipCounter2--;
          }

          if (!may2) {

            rangeBefore = false;
            obj.stop();
            return;
          }

          may2--;
          return;
        }

        if (obj.matchText === ')' && !tmp) {

          skipCounter++;
          return;
        }

        if (obj.matchText === ',' && !skipCounter && !skipCounter2 && !may && !may2) {

          paramPosition++;
          return;
        }

        if (obj.matchText === ',') {

          return;
        }

        if (obj.matchText === '(' && skipCounter) {

          skipCounter--;
          return;
        }

        if (skipCounter || skipCounter2) {

          return;
        }

        if (obj.matchText === '(' && !tmp) {

          rangeBefore = obj.range;
          obj.stop();

          return;
        }

        tmp = obj.matchText;
      });

      if (!rangeBefore) {

        this.destroyOverlay();
        return;
      }

      _atomTernjsManager2['default'].client.update(editor).then(function (data) {

        _atomTernjsManager2['default'].client.type(editor, rangeBefore.start).then(function (data) {

          if (!data || data.type === '?' || !data.exprName) {

            _this.destroyOverlay();

            return;
          }

          var type = (0, _atomTernjsHelper.prepareType)(data);
          var params = (0, _atomTernjsHelper.extractParams)(type);
          (0, _atomTernjsHelper.formatType)(data);

          if (params && params[paramPosition]) {

            var offsetFix = paramPosition > 0 ? ' ' : '';
            data.type = data.type.replace(params[paramPosition], offsetFix + '<span class="storage type">' + params[paramPosition] + '</span>');
          }

          if (data.doc && _atomTernjsPackageConfig2['default'].options.inlineFnCompletionDocumentation) {

            data.doc = data.doc && data.doc.replace(/(?:\r\n|\r|\n)/g, '<br />');
            data.doc = (0, _atomTernjsHelper.prepareInlineDocs)(data.doc);
          }

          _this.view.setData(data);

          _this.setPosition();
        });
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      _atomTernjsEvents2['default'].off('destroy-type-overlay', this.destroyOverlayHandler);

      this.destroyOverlay();

      if (this.view) {

        this.view.destroy();
        this.view = null;
      }
    }
  }, {
    key: 'destroyOverlay',
    value: function destroyOverlay() {

      this.marker = undefined;

      if (this.overlayDecoration) {

        this.overlayDecoration.destroy();
        this.overlayDecoration = undefined;
      }
    }
  }]);

  return Type;
})();

exports['default'] = new Type();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdGVmYW5vLmNvcmFsbG8vLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtdHlwZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O2lDQUtvQix1QkFBdUI7Ozs7dUNBQ2pCLDhCQUE4Qjs7OztnQ0FDcEMsc0JBQXNCOzs7O29CQUN0QixNQUFNOztnQ0FNbkIsc0JBQXNCOztBQWQ3QixXQUFXLENBQUM7O0FBRVosSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDcEQsSUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDOztJQWFmLElBQUk7QUFFRyxXQUZQLElBQUksR0FFTTswQkFGVixJQUFJOztBQUlOLFFBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxTQUFTLENBQUM7QUFDbkMsUUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7O0FBRXhCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztBQUMzQixRQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFM0IsUUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTFELFFBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFNUQsa0NBQVEsRUFBRSxDQUFDLHNCQUFzQixFQUFFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0dBQ2hFOztlQWhCRyxJQUFJOztXQWtCRyx1QkFBRzs7QUFFWixVQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTs7QUFFaEIsWUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDOztBQUVwRCxZQUFJLENBQUMsTUFBTSxFQUFFOztBQUVYLGlCQUFPO1NBQ1I7O0FBRUQsWUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsYUFBYSxJQUFJLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFekUsWUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7O0FBRWhCLGlCQUFPO1NBQ1I7O0FBRUQsWUFBSSxDQUFDLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTs7QUFFMUQsY0FBSSxFQUFFLFNBQVM7QUFDZixjQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7QUFDZixtQkFBTyxrQkFBa0I7QUFDekIsa0JBQVEsRUFBRSxNQUFNO0FBQ2hCLG9CQUFVLEVBQUUsT0FBTztTQUNwQixDQUFDLENBQUM7T0FFSixNQUFNOztBQUVMLFlBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDOztBQUV4QixjQUFJLEVBQUUsU0FBUztBQUNmLGNBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtBQUNmLG1CQUFPLGtCQUFrQjtBQUN6QixrQkFBUSxFQUFFLE1BQU07QUFDaEIsb0JBQVUsRUFBRSxPQUFPO1NBQ3BCLENBQUMsQ0FBQztPQUNKO0tBQ0Y7OztXQUVRLG1CQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUU7OztBQUV4QixVQUNFLENBQUMscUNBQWMsT0FBTyxDQUFDLGtCQUFrQixJQUN6QyxDQUFDLE1BQU0sSUFDUCxNQUFNLENBQUMsU0FBUyxJQUNoQixDQUFDLCtCQUFRLE1BQU0sRUFDZjs7QUFFQSxlQUFPO09BQ1I7O0FBRUQsVUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7O0FBRXBELFVBQUksZUFBZSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUU7O0FBRWxELFlBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7QUFFdEIsZUFBTztPQUNSOztBQUVELFVBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztBQUNqQixVQUFJLFdBQVcsR0FBRyxLQUFLLENBQUM7QUFDeEIsVUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ2hCLFVBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztBQUNaLFVBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztBQUNiLFVBQUksV0FBVyxHQUFHLENBQUMsQ0FBQztBQUNwQixVQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7QUFDckIsVUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLFVBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0FBQzVDLFVBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7QUFFbEMsVUFBSSxRQUFRLENBQUMsR0FBRyxHQUFHLFNBQVMsR0FBRyxDQUFDLEVBQUU7O0FBRWhDLGdCQUFRLEdBQUcsQ0FBQyxDQUFDO09BRWQsTUFBTTs7QUFFTCxnQkFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDO09BQ3JDOztBQUVELFlBQU0sQ0FBQyxvQkFBb0IsQ0FBQyx1QkFBdUIsRUFBRSxnQkFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsVUFBQyxHQUFHLEVBQUs7OztBQUd2SCxZQUFJLE1BQU0sQ0FBQyxnQ0FBZ0MsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUU7O0FBRTFGLGlCQUFPO1NBQ1I7O0FBRUQsWUFBSSxHQUFHLENBQUMsU0FBUyxLQUFLLEdBQUcsRUFBRTs7QUFFekIsYUFBRyxFQUFFLENBQUM7QUFDTixpQkFBTztTQUNSOztBQUVELFlBQUksR0FBRyxDQUFDLFNBQVMsS0FBSyxHQUFHLEVBQUU7O0FBRXpCLGNBQUksQ0FBQyxHQUFHLEVBQUU7O0FBRVIsd0JBQVksRUFBRSxDQUFDO1dBQ2hCOztBQUVELGNBQUksRUFBRSxDQUFDO0FBQ1AsaUJBQU87U0FDUjs7QUFFRCxZQUFJLEdBQUcsQ0FBQyxTQUFTLEtBQUssR0FBRyxFQUFFOztBQUV6QixjQUFJLENBQUMsR0FBRyxFQUFFOztBQUVSLHVCQUFXLEdBQUcsS0FBSyxDQUFDO0FBQ3BCLGVBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFWCxtQkFBTztXQUNSOztBQUVELGFBQUcsRUFBRSxDQUFDO0FBQ04saUJBQU87U0FDUjs7QUFFRCxZQUFJLEdBQUcsQ0FBQyxTQUFTLEtBQUssR0FBRyxFQUFFOztBQUV6QixjQUFJLFlBQVksRUFBRTs7QUFFaEIsd0JBQVksRUFBRSxDQUFDO1dBQ2hCOztBQUVELGNBQUksQ0FBQyxJQUFJLEVBQUU7O0FBRVQsdUJBQVcsR0FBRyxLQUFLLENBQUM7QUFDcEIsZUFBRyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1gsbUJBQU87V0FDUjs7QUFFRCxjQUFJLEVBQUUsQ0FBQztBQUNQLGlCQUFPO1NBQ1I7O0FBRUQsWUFBSSxHQUFHLENBQUMsU0FBUyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRTs7QUFFakMscUJBQVcsRUFBRSxDQUFDO0FBQ2QsaUJBQU87U0FDUjs7QUFFRCxZQUFJLEdBQUcsQ0FBQyxTQUFTLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFOztBQUUzRSx1QkFBYSxFQUFFLENBQUM7QUFDaEIsaUJBQU87U0FDUjs7QUFFRCxZQUFJLEdBQUcsQ0FBQyxTQUFTLEtBQUssR0FBRyxFQUFFOztBQUV6QixpQkFBTztTQUNSOztBQUVELFlBQUksR0FBRyxDQUFDLFNBQVMsS0FBSyxHQUFHLElBQUksV0FBVyxFQUFFOztBQUV4QyxxQkFBVyxFQUFFLENBQUM7QUFDZCxpQkFBTztTQUNSOztBQUVELFlBQUksV0FBVyxJQUFJLFlBQVksRUFBRTs7QUFFL0IsaUJBQU87U0FDUjs7QUFFRCxZQUFJLEdBQUcsQ0FBQyxTQUFTLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFOztBQUVqQyxxQkFBVyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7QUFDeEIsYUFBRyxDQUFDLElBQUksRUFBRSxDQUFDOztBQUVYLGlCQUFPO1NBQ1I7O0FBRUQsV0FBRyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUM7T0FDckIsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxXQUFXLEVBQUU7O0FBRWhCLFlBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUN0QixlQUFPO09BQ1I7O0FBRUQscUNBQVEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLEVBQUs7O0FBRTNDLHVDQUFRLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxJQUFJLEVBQUs7O0FBRTVELGNBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFOztBQUVoRCxrQkFBSyxjQUFjLEVBQUUsQ0FBQzs7QUFFdEIsbUJBQU87V0FDUjs7QUFFRCxjQUFNLElBQUksR0FBRyxtQ0FBWSxJQUFJLENBQUMsQ0FBQztBQUMvQixjQUFNLE1BQU0sR0FBRyxxQ0FBYyxJQUFJLENBQUMsQ0FBQztBQUNuQyw0Q0FBVyxJQUFJLENBQUMsQ0FBQzs7QUFFakIsY0FBSSxNQUFNLElBQUksTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFOztBQUVuQyxnQkFBTSxTQUFTLEdBQUcsYUFBYSxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQy9DLGdCQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBSyxTQUFTLG1DQUE4QixNQUFNLENBQUMsYUFBYSxDQUFDLGFBQVUsQ0FBQztXQUNoSTs7QUFFRCxjQUNFLElBQUksQ0FBQyxHQUFHLElBQ1IscUNBQWMsT0FBTyxDQUFDLCtCQUErQixFQUNyRDs7QUFFQSxnQkFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3JFLGdCQUFJLENBQUMsR0FBRyxHQUFHLHlDQUFrQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7V0FDeEM7O0FBRUQsZ0JBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFeEIsZ0JBQUssV0FBVyxFQUFFLENBQUM7U0FDcEIsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ0o7OztXQUVNLG1CQUFHOztBQUVSLG9DQUFRLEdBQUcsQ0FBQyxzQkFBc0IsRUFBRSxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQzs7QUFFaEUsVUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDOztBQUV0QixVQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7O0FBRWIsWUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNwQixZQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztPQUNsQjtLQUNGOzs7V0FFYSwwQkFBRzs7QUFFZixVQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQzs7QUFFeEIsVUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7O0FBRTFCLFlBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNqQyxZQUFJLENBQUMsaUJBQWlCLEdBQUcsU0FBUyxDQUFDO09BQ3BDO0tBQ0Y7OztTQXBRRyxJQUFJOzs7cUJBdVFLLElBQUksSUFBSSxFQUFFIiwiZmlsZSI6Ii9Vc2Vycy9zdGVmYW5vLmNvcmFsbG8vLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtdHlwZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5jb25zdCBUeXBlVmlldyA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtdHlwZS12aWV3Jyk7XG5jb25zdCBUT0xFUkFOQ0UgPSAyMDtcblxuaW1wb3J0IG1hbmFnZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1tYW5hZ2VyJztcbmltcG9ydCBwYWNrYWdlQ29uZmlnIGZyb20gJy4vYXRvbS10ZXJuanMtcGFja2FnZS1jb25maWcnO1xuaW1wb3J0IGVtaXR0ZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1ldmVudHMnO1xuaW1wb3J0IHtSYW5nZX0gZnJvbSAnYXRvbSc7XG5pbXBvcnQge1xuICBwcmVwYXJlVHlwZSxcbiAgcHJlcGFyZUlubGluZURvY3MsXG4gIGV4dHJhY3RQYXJhbXMsXG4gIGZvcm1hdFR5cGVcbn0gZnJvbSAnLi9hdG9tLXRlcm5qcy1oZWxwZXInO1xuXG5jbGFzcyBUeXBlIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIHRoaXMudmlldyA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLm92ZXJsYXlEZWNvcmF0aW9uID0gdW5kZWZpbmVkO1xuICAgIHRoaXMubWFya2VyID0gdW5kZWZpbmVkO1xuXG4gICAgdGhpcy52aWV3ID0gbmV3IFR5cGVWaWV3KCk7XG4gICAgdGhpcy52aWV3LmluaXRpYWxpemUodGhpcyk7XG5cbiAgICBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLmFwcGVuZENoaWxkKHRoaXMudmlldyk7XG5cbiAgICB0aGlzLmRlc3Ryb3lPdmVybGF5SGFuZGxlciA9IHRoaXMuZGVzdHJveU92ZXJsYXkuYmluZCh0aGlzKTtcblxuICAgIGVtaXR0ZXIub24oJ3R5cGUtZGVzdHJveS1vdmVybGF5JywgdGhpcy5kZXN0cm95T3ZlcmxheUhhbmRsZXIpO1xuICB9XG5cbiAgc2V0UG9zaXRpb24oKSB7XG5cbiAgICBpZiAoIXRoaXMubWFya2VyKSB7XG5cbiAgICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcblxuICAgICAgaWYgKCFlZGl0b3IpIHtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMubWFya2VyID0gZWRpdG9yLmdldExhc3RDdXJzb3IgJiYgZWRpdG9yLmdldExhc3RDdXJzb3IoKS5nZXRNYXJrZXIoKTtcblxuICAgICAgaWYgKCF0aGlzLm1hcmtlcikge1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5vdmVybGF5RGVjb3JhdGlvbiA9IGVkaXRvci5kZWNvcmF0ZU1hcmtlcih0aGlzLm1hcmtlciwge1xuXG4gICAgICAgIHR5cGU6ICdvdmVybGF5JyxcbiAgICAgICAgaXRlbTogdGhpcy52aWV3LFxuICAgICAgICBjbGFzczogJ2F0b20tdGVybmpzLXR5cGUnLFxuICAgICAgICBwb3NpdGlvbjogJ3RhbGUnLFxuICAgICAgICBpbnZhbGlkYXRlOiAndG91Y2gnXG4gICAgICB9KTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIHRoaXMubWFya2VyLnNldFByb3BlcnRpZXMoe1xuXG4gICAgICAgIHR5cGU6ICdvdmVybGF5JyxcbiAgICAgICAgaXRlbTogdGhpcy52aWV3LFxuICAgICAgICBjbGFzczogJ2F0b20tdGVybmpzLXR5cGUnLFxuICAgICAgICBwb3NpdGlvbjogJ3RhbGUnLFxuICAgICAgICBpbnZhbGlkYXRlOiAndG91Y2gnXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBxdWVyeVR5cGUoZWRpdG9yLCBjdXJzb3IpIHtcblxuICAgIGlmIChcbiAgICAgICFwYWNrYWdlQ29uZmlnLm9wdGlvbnMuaW5saW5lRm5Db21wbGV0aW9uIHx8XG4gICAgICAhY3Vyc29yIHx8XG4gICAgICBjdXJzb3IuZGVzdHJveWVkIHx8XG4gICAgICAhbWFuYWdlci5jbGllbnRcbiAgICApIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNjb3BlRGVzY3JpcHRvciA9IGN1cnNvci5nZXRTY29wZURlc2NyaXB0b3IoKTtcblxuICAgIGlmIChzY29wZURlc2NyaXB0b3Iuc2NvcGVzLmpvaW4oKS5tYXRjaCgvY29tbWVudC8pKSB7XG5cbiAgICAgIHRoaXMuZGVzdHJveU92ZXJsYXkoKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCByb3dTdGFydCA9IDA7XG4gICAgbGV0IHJhbmdlQmVmb3JlID0gZmFsc2U7XG4gICAgbGV0IHRtcCA9IGZhbHNlO1xuICAgIGxldCBtYXkgPSAwO1xuICAgIGxldCBtYXkyID0gMDtcbiAgICBsZXQgc2tpcENvdW50ZXIgPSAwO1xuICAgIGxldCBza2lwQ291bnRlcjIgPSAwO1xuICAgIGxldCBwYXJhbVBvc2l0aW9uID0gMDtcbiAgICBjb25zdCBwb3NpdGlvbiA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpO1xuICAgIGNvbnN0IGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKTtcblxuICAgIGlmIChwb3NpdGlvbi5yb3cgLSBUT0xFUkFOQ0UgPCAwKSB7XG5cbiAgICAgIHJvd1N0YXJ0ID0gMDtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIHJvd1N0YXJ0ID0gcG9zaXRpb24ucm93IC0gVE9MRVJBTkNFO1xuICAgIH1cblxuICAgIGJ1ZmZlci5iYWNrd2FyZHNTY2FuSW5SYW5nZSgvXFxdfFxcW3xcXCh8XFwpfFxcLHxcXHt8XFx9L2csIG5ldyBSYW5nZShbcm93U3RhcnQsIDBdLCBbcG9zaXRpb24ucm93LCBwb3NpdGlvbi5jb2x1bW5dKSwgKG9iaikgPT4ge1xuXG4gICAgICAvLyByZXR1cm4gZWFybHkgaWYgd2UgYXJlIGluc2lkZSBhIHN0cmluZ1xuICAgICAgaWYgKGVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihvYmoucmFuZ2Uuc3RhcnQpLnNjb3Blcy5qb2luKCkubWF0Y2goL3N0cmluZy8pKSB7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAob2JqLm1hdGNoVGV4dCA9PT0gJ30nKSB7XG5cbiAgICAgICAgbWF5Kys7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKG9iai5tYXRjaFRleHQgPT09ICddJykge1xuXG4gICAgICAgIGlmICghdG1wKSB7XG5cbiAgICAgICAgICBza2lwQ291bnRlcjIrKztcbiAgICAgICAgfVxuXG4gICAgICAgIG1heTIrKztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAob2JqLm1hdGNoVGV4dCA9PT0gJ3snKSB7XG5cbiAgICAgICAgaWYgKCFtYXkpIHtcblxuICAgICAgICAgIHJhbmdlQmVmb3JlID0gZmFsc2U7XG4gICAgICAgICAgb2JqLnN0b3AoKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIG1heS0tO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChvYmoubWF0Y2hUZXh0ID09PSAnWycpIHtcblxuICAgICAgICBpZiAoc2tpcENvdW50ZXIyKSB7XG5cbiAgICAgICAgICBza2lwQ291bnRlcjItLTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghbWF5Mikge1xuXG4gICAgICAgICAgcmFuZ2VCZWZvcmUgPSBmYWxzZTtcbiAgICAgICAgICBvYmouc3RvcCgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIG1heTItLTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAob2JqLm1hdGNoVGV4dCA9PT0gJyknICYmICF0bXApIHtcblxuICAgICAgICBza2lwQ291bnRlcisrO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChvYmoubWF0Y2hUZXh0ID09PSAnLCcgJiYgIXNraXBDb3VudGVyICYmICFza2lwQ291bnRlcjIgJiYgIW1heSAmJiAhbWF5Mikge1xuXG4gICAgICAgIHBhcmFtUG9zaXRpb24rKztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAob2JqLm1hdGNoVGV4dCA9PT0gJywnKSB7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAob2JqLm1hdGNoVGV4dCA9PT0gJygnICYmIHNraXBDb3VudGVyKSB7XG5cbiAgICAgICAgc2tpcENvdW50ZXItLTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2tpcENvdW50ZXIgfHwgc2tpcENvdW50ZXIyKSB7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAob2JqLm1hdGNoVGV4dCA9PT0gJygnICYmICF0bXApIHtcblxuICAgICAgICByYW5nZUJlZm9yZSA9IG9iai5yYW5nZTtcbiAgICAgICAgb2JqLnN0b3AoKTtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRtcCA9IG9iai5tYXRjaFRleHQ7XG4gICAgfSk7XG5cbiAgICBpZiAoIXJhbmdlQmVmb3JlKSB7XG5cbiAgICAgIHRoaXMuZGVzdHJveU92ZXJsYXkoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBtYW5hZ2VyLmNsaWVudC51cGRhdGUoZWRpdG9yKS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgIG1hbmFnZXIuY2xpZW50LnR5cGUoZWRpdG9yLCByYW5nZUJlZm9yZS5zdGFydCkudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICAgIGlmICghZGF0YSB8fCBkYXRhLnR5cGUgPT09ICc/JyB8fCAhZGF0YS5leHByTmFtZSkge1xuXG4gICAgICAgICAgdGhpcy5kZXN0cm95T3ZlcmxheSgpO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdHlwZSA9IHByZXBhcmVUeXBlKGRhdGEpO1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBleHRyYWN0UGFyYW1zKHR5cGUpO1xuICAgICAgICBmb3JtYXRUeXBlKGRhdGEpO1xuXG4gICAgICAgIGlmIChwYXJhbXMgJiYgcGFyYW1zW3BhcmFtUG9zaXRpb25dKSB7XG5cbiAgICAgICAgICBjb25zdCBvZmZzZXRGaXggPSBwYXJhbVBvc2l0aW9uID4gMCA/ICcgJyA6ICcnO1xuICAgICAgICAgIGRhdGEudHlwZSA9IGRhdGEudHlwZS5yZXBsYWNlKHBhcmFtc1twYXJhbVBvc2l0aW9uXSwgYCR7b2Zmc2V0Rml4fTxzcGFuIGNsYXNzPVwic3RvcmFnZSB0eXBlXCI+JHtwYXJhbXNbcGFyYW1Qb3NpdGlvbl19PC9zcGFuPmApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIGRhdGEuZG9jICYmXG4gICAgICAgICAgcGFja2FnZUNvbmZpZy5vcHRpb25zLmlubGluZUZuQ29tcGxldGlvbkRvY3VtZW50YXRpb25cbiAgICAgICAgKSB7XG5cbiAgICAgICAgICBkYXRhLmRvYyA9IGRhdGEuZG9jICYmIGRhdGEuZG9jLnJlcGxhY2UoLyg/OlxcclxcbnxcXHJ8XFxuKS9nLCAnPGJyIC8+Jyk7XG4gICAgICAgICAgZGF0YS5kb2MgPSBwcmVwYXJlSW5saW5lRG9jcyhkYXRhLmRvYyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnZpZXcuc2V0RGF0YShkYXRhKTtcblxuICAgICAgICB0aGlzLnNldFBvc2l0aW9uKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG5cbiAgICBlbWl0dGVyLm9mZignZGVzdHJveS10eXBlLW92ZXJsYXknLCB0aGlzLmRlc3Ryb3lPdmVybGF5SGFuZGxlcik7XG5cbiAgICB0aGlzLmRlc3Ryb3lPdmVybGF5KCk7XG5cbiAgICBpZiAodGhpcy52aWV3KSB7XG5cbiAgICAgIHRoaXMudmlldy5kZXN0cm95KCk7XG4gICAgICB0aGlzLnZpZXcgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3lPdmVybGF5KCkge1xuXG4gICAgdGhpcy5tYXJrZXIgPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAodGhpcy5vdmVybGF5RGVjb3JhdGlvbikge1xuXG4gICAgICB0aGlzLm92ZXJsYXlEZWNvcmF0aW9uLmRlc3Ryb3koKTtcbiAgICAgIHRoaXMub3ZlcmxheURlY29yYXRpb24gPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBUeXBlKCk7XG4iXX0=
//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/atom-ternjs/lib/atom-ternjs-type.js
