function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _helpers = require('./helpers');

var _fuzzaldrin = require('fuzzaldrin');

var _atom = require('atom');

var _atomLinter = require('atom-linter');

module.exports = { config: { pathToFlowExecutable: { type: 'string',
      'default': 'flow'
    }
  },
  activate: function activate() {
    var _this = this;

    console.log('activating autocomplete-flow');

    // getting custom value
    this.lastConfigError = {};
    this.subscriptions = new _atom.CompositeDisposable();
    this.cmdString = 'flow';
    this.subscriptions.add(atom.config.observe('autocomplete-flow.pathToFlowExecutable', function (pathToFlow) {
      _this.cmdString = pathToFlow || 'flow';
    }));
    if (atom.inDevMode()) {
      console.log('activating... autocomplete-flow');
    }
  },
  deactivate: function deactivate() {
    if (atom.inDevMode()) {
      console.log('deactivating... autocomplete-flow');
    }
    (0, _atomLinter.exec)(this.cmdString, ['stop'], {})['catch'](function () {
      return null;
    });
    this.subscriptions.dispose();
  },
  getCompletionProvider: function getCompletionProvider() {
    var that = this;
    var provider = { selector: '.source.js, .source.js.jsx, .source.jsx',
      disableForSelector: '.source.js .comment, source.js .keyword',
      inclusionPriority: 1,
      excludeLowerPriority: true,
      getSuggestions: _asyncToGenerator(function* (_ref) {
        var editor = _ref.editor;
        var bufferPosition = _ref.bufferPosition;
        var prefix = _ref.prefix;

        if (!prefix) {
          return [];
        }
        var file = editor.getPath();
        var currentContents = editor.getText();
        var cursor = editor.getLastCursor();
        var line = cursor.getBufferRow();
        var col = cursor.getBufferColumn();

        var flowConfig = (0, _atomLinter.find)(file, '.flowconfig');
        if (!flowConfig) {
          if (!that.lastConfigError[file] || that.lastConfigError[file] + 5 * 60 * 1000 < Date.now()) {
            atom.notifications.addWarning('[Autocomplete-Flow] Missing .flowconfig file.', { detail: 'To get started with Flow, run `flow init`.',
              dismissable: true
            });
            that.lastConfigError[file] = Date.now();
          }
          return [];
        }

        var options = {};
        var args = ['autocomplete', '--json', file];

        // const [cwd] = atom.project.relativizePath(file)
        options.cwd = _path2['default'].dirname(file); //cwd

        try {
          var _ret = yield* (function* () {
            var stringWithACToken = (0, _helpers.insertAutocompleteToken)(currentContents, line, col);
            var result = yield (0, _helpers.promisedExec)(that.cmdString, args, options, stringWithACToken);
            if (!result || !result.length) {
              return {
                v: []
              };
            }
            // If it is just whitespace and punctuation, ignore it (this keeps us
            // from eating leading dots).
            var replacementPrefix = /^[\s.]*$/.test(prefix) ? '' : prefix;
            var candidates = result.map(function (item) {
              return (0, _helpers.processAutocompleteItem)(replacementPrefix, item);
            });

            // return candidates
            return {
              v: (0, _fuzzaldrin.filter)(candidates, replacementPrefix, { key: 'displayText' })
            };
          })();

          if (typeof _ret === 'object') return _ret.v;
        } catch (e) {
          var errorM = String(e).toLowerCase();
          if (errorM.includes('rechecking') || errorM.includes('launching') || errorM.includes('processing') || errorM.includes('starting') || errorM.includes('spawned') || errorM.includes('logs') || errorM.includes('initializing')) {
            return [];
          }
          console.log('[autocomplete-flow] ERROR:', e);
          return [];
        }
      })
    };

    return provider;
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3N0ZWZhbm8vLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWZsb3cvc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7b0JBQ2lCLE1BQU07Ozs7NkJBQ0gsZUFBZTs7dUJBQzBDLFdBQVc7OzBCQUNuRSxZQUFZOztvQkFDRyxNQUFNOzswQkFDakIsYUFBYTs7QUFHdEMsTUFBTSxDQUFDLE9BQU8sR0FDWixFQUFFLE1BQU0sRUFDSixFQUFFLG9CQUFvQixFQUNsQixFQUFFLElBQUksRUFBRSxRQUFRO0FBQ2QsaUJBQVMsTUFBTTtLQUNoQjtHQUNKO0FBQ0gsVUFBUSxFQUFBLG9CQUFFOzs7QUFDUixXQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUE7OztBQUczQyxRQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQTtBQUN6QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFFBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFBO0FBQ3ZCLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHdDQUF3QyxFQUFFLFVBQUMsVUFBVSxFQUFLO0FBQ25HLFlBQUssU0FBUyxHQUFHLFVBQVUsSUFBSSxNQUFNLENBQUE7S0FDdEMsQ0FBQyxDQUFDLENBQUE7QUFDSCxRQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBRTtBQUNwQixhQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxDQUFDLENBQUE7S0FDL0M7R0FDRjtBQUNELFlBQVUsRUFBQSxzQkFBRTtBQUNWLFFBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFO0FBQ3BCLGFBQU8sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUMsQ0FBQTtLQUNqRDtBQUNELDBCQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsU0FBTSxDQUFDO2FBQU0s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LENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQzlDLGNBQUssTUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsSUFDN0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFDNUIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsSUFDN0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFDM0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFDMUIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFDdkIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFDbEM7QUFDQSxtQkFBTyxFQUFFLENBQUE7V0FDVjtBQUNELGlCQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQzVDLGlCQUFPLEVBQUUsQ0FBQTtTQUNWO09BQ0YsQ0FBQTtLQUNGLENBQUE7O0FBRUgsV0FBTyxRQUFRLENBQUE7R0FDaEI7Q0FDRixDQUFBIiwiZmlsZSI6Ii9ob21lL3N0ZWZhbm8vLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWZsb3cvc3JjL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQge3NwYXdufSBmcm9tICdjaGlsZF9wcm9jZXNzJ1xuaW1wb3J0IHtpbnNlcnRBdXRvY29tcGxldGVUb2tlbiwgcHJvbWlzZWRFeGVjLCBwcm9jZXNzQXV0b2NvbXBsZXRlSXRlbX0gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHtmaWx0ZXJ9IGZyb20gJ2Z1enphbGRyaW4nXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7ZXhlYywgZmluZH0gZnJvbSAnYXRvbS1saW50ZXInXG5pbXBvcnQgdHlwZSB7QXV0b2NvbXBsZXRlUHJvdmlkZXJ9IGZyb20gJy4vdHlwZXMnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgeyBjb25maWc6XG4gICAgICB7IHBhdGhUb0Zsb3dFeGVjdXRhYmxlOlxuICAgICAgICAgIHsgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICAsIGRlZmF1bHQ6ICdmbG93J1xuICAgICAgICAgIH1cbiAgICAgIH1cbiAgLCBhY3RpdmF0ZSgpe1xuICAgICAgY29uc29sZS5sb2coJ2FjdGl2YXRpbmcgYXV0b2NvbXBsZXRlLWZsb3cnKVxuXG4gICAgICAvLyBnZXR0aW5nIGN1c3RvbSB2YWx1ZVxuICAgICAgdGhpcy5sYXN0Q29uZmlnRXJyb3IgPSB7fVxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgICAgdGhpcy5jbWRTdHJpbmcgPSAnZmxvdydcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnYXV0b2NvbXBsZXRlLWZsb3cucGF0aFRvRmxvd0V4ZWN1dGFibGUnLCAocGF0aFRvRmxvdykgPT4ge1xuICAgICAgICB0aGlzLmNtZFN0cmluZyA9IHBhdGhUb0Zsb3cgfHwgJ2Zsb3cnXG4gICAgICB9KSlcbiAgICAgIGlmIChhdG9tLmluRGV2TW9kZSgpKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdhY3RpdmF0aW5nLi4uIGF1dG9jb21wbGV0ZS1mbG93JylcbiAgICAgIH1cbiAgICB9XG4gICwgZGVhY3RpdmF0ZSgpe1xuICAgICAgaWYgKGF0b20uaW5EZXZNb2RlKCkpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2RlYWN0aXZhdGluZy4uLiBhdXRvY29tcGxldGUtZmxvdycpXG4gICAgICB9XG4gICAgICBleGVjKHRoaXMuY21kU3RyaW5nLCBbJ3N0b3AnXSwge30pLmNhdGNoKCgpID0+IG51bGwpXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgfVxuICAsIGdldENvbXBsZXRpb25Qcm92aWRlcigpOiBBdXRvY29tcGxldGVQcm92aWRlciB7XG4gICAgICBjb25zdCB0aGF0ID0gdGhpc1xuICAgICAgY29uc3QgcHJvdmlkZXIgPVxuICAgICAgICB7IHNlbGVjdG9yOiAnLnNvdXJjZS5qcywgLnNvdXJjZS5qcy5qc3gsIC5zb3VyY2UuanN4J1xuICAgICAgICAsIGRpc2FibGVGb3JTZWxlY3RvcjogJy5zb3VyY2UuanMgLmNvbW1lbnQsIHNvdXJjZS5qcyAua2V5d29yZCdcbiAgICAgICAgLCBpbmNsdXNpb25Qcmlvcml0eTogMVxuICAgICAgICAsIGV4Y2x1ZGVMb3dlclByaW9yaXR5OiB0cnVlXG4gICAgICAgICwgYXN5bmMgZ2V0U3VnZ2VzdGlvbnMoe2VkaXRvciwgYnVmZmVyUG9zaXRpb24sIHByZWZpeH0pe1xuICAgICAgICAgICAgaWYgKCFwcmVmaXgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBmaWxlID0gZWRpdG9yLmdldFBhdGgoKVxuICAgICAgICAgICAgY29uc3QgY3VycmVudENvbnRlbnRzID0gZWRpdG9yLmdldFRleHQoKVxuICAgICAgICAgICAgY29uc3QgY3Vyc29yID0gZWRpdG9yLmdldExhc3RDdXJzb3IoKVxuICAgICAgICAgICAgY29uc3QgbGluZSA9IGN1cnNvci5nZXRCdWZmZXJSb3coKVxuICAgICAgICAgICAgY29uc3QgY29sID0gY3Vyc29yLmdldEJ1ZmZlckNvbHVtbigpXG5cbiAgICAgICAgICAgIGNvbnN0IGZsb3dDb25maWcgPSBmaW5kKGZpbGUsICcuZmxvd2NvbmZpZycpXG4gICAgICAgICAgICBpZiAoIWZsb3dDb25maWcpIHtcbiAgICAgICAgICAgICAgaWYgKCF0aGF0Lmxhc3RDb25maWdFcnJvcltmaWxlXSB8fFxuICAgICAgICAgICAgICAgICAgdGhhdC5sYXN0Q29uZmlnRXJyb3JbZmlsZV0gKyA1ICogNjAgKiAxMDAwIDwgRGF0ZS5ub3coKSkge1xuICAgICAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKFxuICAgICAgICAgICAgICAgICdbQXV0b2NvbXBsZXRlLUZsb3ddIE1pc3NpbmcgLmZsb3djb25maWcgZmlsZS4nXG4gICAgICAgICAgICAgICAgLCB7IGRldGFpbDogJ1RvIGdldCBzdGFydGVkIHdpdGggRmxvdywgcnVuIGBmbG93IGluaXRgLidcbiAgICAgICAgICAgICAgICAgICwgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIHRoYXQubGFzdENvbmZpZ0Vycm9yW2ZpbGVdID0gRGF0ZS5ub3coKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgb3B0aW9ucyA9IHt9XG4gICAgICAgICAgICBjb25zdCBhcmdzID0gWydhdXRvY29tcGxldGUnLCAnLS1qc29uJywgZmlsZV1cblxuICAgICAgICAgICAgLy8gY29uc3QgW2N3ZF0gPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZmlsZSlcbiAgICAgICAgICAgIG9wdGlvbnMuY3dkID0gcGF0aC5kaXJuYW1lKGZpbGUpIC8vY3dkXG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNvbnN0IHN0cmluZ1dpdGhBQ1Rva2VuID0gaW5zZXJ0QXV0b2NvbXBsZXRlVG9rZW4oY3VycmVudENvbnRlbnRzLCBsaW5lLCBjb2wpXG4gICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHByb21pc2VkRXhlYyh0aGF0LmNtZFN0cmluZywgYXJncywgb3B0aW9ucywgc3RyaW5nV2l0aEFDVG9rZW4pXG4gICAgICAgICAgICAgIGlmICghcmVzdWx0IHx8ICFyZXN1bHQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLy8gSWYgaXQgaXMganVzdCB3aGl0ZXNwYWNlIGFuZCBwdW5jdHVhdGlvbiwgaWdub3JlIGl0ICh0aGlzIGtlZXBzIHVzXG4gICAgICAgICAgICAgIC8vIGZyb20gZWF0aW5nIGxlYWRpbmcgZG90cykuXG4gICAgICAgICAgICAgIGNvbnN0IHJlcGxhY2VtZW50UHJlZml4ID0gL15bXFxzLl0qJC8udGVzdChwcmVmaXgpID8gJycgOiBwcmVmaXhcbiAgICAgICAgICAgICAgY29uc3QgY2FuZGlkYXRlcyA9IHJlc3VsdC5tYXAoaXRlbSA9PiBwcm9jZXNzQXV0b2NvbXBsZXRlSXRlbShyZXBsYWNlbWVudFByZWZpeCwgaXRlbSkpXG5cbiAgICAgICAgICAgICAgLy8gcmV0dXJuIGNhbmRpZGF0ZXNcbiAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlcihjYW5kaWRhdGVzLCByZXBsYWNlbWVudFByZWZpeCwgeyBrZXk6ICdkaXNwbGF5VGV4dCcgfSlcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgY29uc3QgZXJyb3JNOiBzdHJpbmcgPSBTdHJpbmcoZSkudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICBpZiAoIGVycm9yTS5pbmNsdWRlcygncmVjaGVja2luZycpXG4gICAgICAgICAgICAgICAgfHwgZXJyb3JNLmluY2x1ZGVzKCdsYXVuY2hpbmcnKVxuICAgICAgICAgICAgICAgIHx8IGVycm9yTS5pbmNsdWRlcygncHJvY2Vzc2luZycpXG4gICAgICAgICAgICAgICAgfHwgZXJyb3JNLmluY2x1ZGVzKCdzdGFydGluZycpXG4gICAgICAgICAgICAgICAgfHwgZXJyb3JNLmluY2x1ZGVzKCdzcGF3bmVkJylcbiAgICAgICAgICAgICAgICB8fCBlcnJvck0uaW5jbHVkZXMoJ2xvZ3MnKVxuICAgICAgICAgICAgICAgIHx8IGVycm9yTS5pbmNsdWRlcygnaW5pdGlhbGl6aW5nJylcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1thdXRvY29tcGxldGUtZmxvd10gRVJST1I6JywgZSlcbiAgICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgIHJldHVybiBwcm92aWRlclxuICAgIH1cbiAgfVxuIl19
//# sourceURL=/home/stefano/.atom/packages/autocomplete-flow/src/index.js
