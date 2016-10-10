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

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _underscorePlus = require('underscore-plus');

'use babel';

var Function = require('loophole').Function;
var REGEXP_LINE = /(([\$\w]+[\w-]*)|([.:;'"[{( ]+))$/g;

var Provider = (function () {
  function Provider() {
    _classCallCheck(this, Provider);

    this.disposables = [];

    this.force = false;

    // automcomplete-plus
    this.selector = '.source.js';
    this.disableForSelector = '.source.js .comment';
    this.inclusionPriority = 1;
    this.suggestionPriority = _atomTernjsPackageConfig2['default'].options.snippetsFirst ? null : 2;
    this.excludeLowerPriority = _atomTernjsPackageConfig2['default'].options.excludeLowerPriorityProviders;

    this.line = undefined;
    this.lineMatchResult = undefined;
    this.tempPrefix = undefined;
    this.suggestionsArr = undefined;
    this.suggestion = undefined;
    this.suggestionClone = undefined;

    this.registerCommands();
  }

  _createClass(Provider, [{
    key: 'registerCommands',
    value: function registerCommands() {

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:startCompletion', this.forceCompletion.bind(this)));
    }
  }, {
    key: 'isValidPrefix',
    value: function isValidPrefix(prefix, prefixLast) {

      if (prefixLast === undefined) {

        return false;
      }

      if (prefixLast === '\.') {

        return true;
      }

      if (prefixLast.match(/;|\s/)) {

        return false;
      }

      if (prefix.length > 1) {

        prefix = '_' + prefix;
      }

      try {

        new Function('var ' + prefix)();
      } catch (e) {

        return false;
      }

      return true;
    }
  }, {
    key: 'checkPrefix',
    value: function checkPrefix(prefix) {

      if (prefix.match(/(\(|\s|;|\.|\"|\')$/) || prefix.replace(/\s/g, '').length === 0) {

        return '';
      }

      return prefix;
    }
  }, {
    key: 'getPrefix',
    value: function getPrefix(editor, bufferPosition) {

      this.line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      this.lineMatchResult = this.line.match(REGEXP_LINE);

      if (this.lineMatchResult) {

        return this.lineMatchResult[0];
      }
    }
  }, {
    key: 'getSuggestions',
    value: function getSuggestions(_ref) {
      var _this = this;

      var editor = _ref.editor;
      var bufferPosition = _ref.bufferPosition;
      var scopeDescriptor = _ref.scopeDescriptor;
      var prefix = _ref.prefix;
      var activatedManually = _ref.activatedManually;

      return new Promise(function (resolve) {

        if (!_atomTernjsManager2['default'].client) {

          return resolve([]);
        }

        _this.tempPrefix = _this.getPrefix(editor, bufferPosition) || prefix;

        if (!_this.isValidPrefix(_this.tempPrefix, _this.tempPrefix[_this.tempPrefix.length - 1]) && !_this.force && !activatedManually) {

          return resolve([]);
        }

        prefix = _this.checkPrefix(_this.tempPrefix);

        _atomTernjsManager2['default'].client.update(editor).then(function (data) {

          if (!data) {

            return resolve([]);
          }

          _atomTernjsManager2['default'].client.completions(atom.project.relativizePath(editor.getURI())[1], {

            line: bufferPosition.row,
            ch: bufferPosition.column

          }).then(function (data) {

            if (!data) {

              return resolve([]);
            }

            if (!data.completions.length) {

              return resolve([]);
            }

            _this.suggestionsArr = [];

            var scopesPath = scopeDescriptor.getScopesArray();
            var isInFunDef = scopesPath.indexOf('meta.function.js') > -1;

            for (var obj of data.completions) {

              obj = (0, _atomTernjsHelper.formatTypeCompletion)(obj, data.isProperty, data.isObjectKey, isInFunDef);

              _this.suggestion = {

                text: obj.name,
                replacementPrefix: prefix,
                className: null,
                type: obj._typeSelf,
                leftLabel: obj.leftLabel,
                snippet: obj._snippet,
                displayText: obj._displayText,
                description: obj.doc || null,
                descriptionMoreURL: obj.url || null
              };

              if (_atomTernjsPackageConfig2['default'].options.useSnippetsAndFunction && obj._hasParams) {

                _this.suggestionClone = (0, _underscorePlus.clone)(_this.suggestion);
                _this.suggestionClone.type = 'snippet';

                if (obj._hasParams) {

                  _this.suggestion.snippet = obj.name + '(${0:})';
                } else {

                  _this.suggestion.snippet = obj.name + '()';
                }

                _this.suggestionsArr.push(_this.suggestion);
                _this.suggestionsArr.push(_this.suggestionClone);
              } else {

                _this.suggestionsArr.push(_this.suggestion);
              }
            }

            resolve(_this.suggestionsArr);
          })['catch'](function (err) {

            console.error(err);
            resolve([]);
          });
        });
      });
    }
  }, {
    key: 'forceCompletion',
    value: function forceCompletion() {

      this.force = true;
      atom.commands.dispatch(atom.views.getView(atom.workspace.getActiveTextEditor()), 'autocomplete-plus:activate');
      this.force = false;
    }
  }, {
    key: 'destroy',
    value: function destroy() {}
  }]);

  return Provider;
})();

exports['default'] = new Provider();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdGVmYW5vLmNvcmFsbG8vLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtcHJvdmlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztpQ0FLb0IsdUJBQXVCOzs7O3VDQUNqQiw4QkFBOEI7Ozs7Z0NBR2pELHNCQUFzQjs7OEJBR3RCLGlCQUFpQjs7QUFaeEIsV0FBVyxDQUFDOztBQUVaLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFDOUMsSUFBTSxXQUFXLEdBQUcsb0NBQW9DLENBQUM7O0lBV25ELFFBQVE7QUFFRCxXQUZQLFFBQVEsR0FFRTswQkFGVixRQUFROztBQUlWLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDOztBQUV0QixRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzs7O0FBR25CLFFBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxDQUFDO0FBQzdCLFFBQUksQ0FBQyxrQkFBa0IsR0FBRyxxQkFBcUIsQ0FBQztBQUNoRCxRQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLFFBQUksQ0FBQyxrQkFBa0IsR0FBRyxxQ0FBYyxPQUFPLENBQUMsYUFBYSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7QUFDekUsUUFBSSxDQUFDLG9CQUFvQixHQUFHLHFDQUFjLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQzs7QUFFaEYsUUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7QUFDdEIsUUFBSSxDQUFDLGVBQWUsR0FBRyxTQUFTLENBQUM7QUFDakMsUUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7QUFDNUIsUUFBSSxDQUFDLGNBQWMsR0FBRyxTQUFTLENBQUM7QUFDaEMsUUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7QUFDNUIsUUFBSSxDQUFDLGVBQWUsR0FBRyxTQUFTLENB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S0FDSjs7O1dBRWMsMkJBQUc7O0FBRWhCLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFVBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxFQUFFLDRCQUE0QixDQUFDLENBQUM7QUFDL0csVUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDcEI7OztXQUVNLG1CQUFHLEVBR1Q7OztTQXBNRyxRQUFROzs7cUJBdU1DLElBQUksUUFBUSxFQUFFIiwiZmlsZSI6Ii9Vc2Vycy9zdGVmYW5vLmNvcmFsbG8vLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtcHJvdmlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuY29uc3QgRnVuY3Rpb24gPSByZXF1aXJlKCdsb29waG9sZScpLkZ1bmN0aW9uO1xuY29uc3QgUkVHRVhQX0xJTkUgPSAvKChbXFwkXFx3XStbXFx3LV0qKXwoWy46OydcIlt7KCBdKykpJC9nO1xuXG5pbXBvcnQgbWFuYWdlciBmcm9tICcuL2F0b20tdGVybmpzLW1hbmFnZXInO1xuaW1wb3J0IHBhY2thZ2VDb25maWcgZnJvbSAnLi9hdG9tLXRlcm5qcy1wYWNrYWdlLWNvbmZpZyc7XG5pbXBvcnQge1xuICBmb3JtYXRUeXBlQ29tcGxldGlvblxufSBmcm9tICcuL2F0b20tdGVybmpzLWhlbHBlcic7XG5pbXBvcnQge1xuICBjbG9uZVxufSBmcm9tICd1bmRlcnNjb3JlLXBsdXMnO1xuXG5jbGFzcyBQcm92aWRlciB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gW107XG5cbiAgICB0aGlzLmZvcmNlID0gZmFsc2U7XG5cbiAgICAvLyBhdXRvbWNvbXBsZXRlLXBsdXNcbiAgICB0aGlzLnNlbGVjdG9yID0gJy5zb3VyY2UuanMnO1xuICAgIHRoaXMuZGlzYWJsZUZvclNlbGVjdG9yID0gJy5zb3VyY2UuanMgLmNvbW1lbnQnO1xuICAgIHRoaXMuaW5jbHVzaW9uUHJpb3JpdHkgPSAxO1xuICAgIHRoaXMuc3VnZ2VzdGlvblByaW9yaXR5ID0gcGFja2FnZUNvbmZpZy5vcHRpb25zLnNuaXBwZXRzRmlyc3QgPyBudWxsIDogMjtcbiAgICB0aGlzLmV4Y2x1ZGVMb3dlclByaW9yaXR5ID0gcGFja2FnZUNvbmZpZy5vcHRpb25zLmV4Y2x1ZGVMb3dlclByaW9yaXR5UHJvdmlkZXJzO1xuXG4gICAgdGhpcy5saW5lID0gdW5kZWZpbmVkO1xuICAgIHRoaXMubGluZU1hdGNoUmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMudGVtcFByZWZpeCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnN1Z2dlc3Rpb25zQXJyID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuc3VnZ2VzdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnN1Z2dlc3Rpb25DbG9uZSA9IHVuZGVmaW5lZDtcblxuICAgIHRoaXMucmVnaXN0ZXJDb21tYW5kcygpO1xuICB9XG5cbiAgcmVnaXN0ZXJDb21tYW5kcygpIHtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdhdG9tLXRlcm5qczpzdGFydENvbXBsZXRpb24nLCB0aGlzLmZvcmNlQ29tcGxldGlvbi5iaW5kKHRoaXMpKSk7XG4gIH1cblxuICBpc1ZhbGlkUHJlZml4KHByZWZpeCwgcHJlZml4TGFzdCkge1xuXG4gICAgaWYgKHByZWZpeExhc3QgPT09IHVuZGVmaW5lZCkge1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHByZWZpeExhc3QgPT09ICdcXC4nKSB7XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChwcmVmaXhMYXN0Lm1hdGNoKC87fFxccy8pKSB7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAocHJlZml4Lmxlbmd0aCA+IDEpIHtcblxuICAgICAgcHJlZml4ID0gYF8ke3ByZWZpeH1gO1xuICAgIH1cblxuICAgIHRyeSB7XG5cbiAgICAgIChuZXcgRnVuY3Rpb24oYHZhciAke3ByZWZpeH1gKSkoKTtcblxuICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgY2hlY2tQcmVmaXgocHJlZml4KSB7XG5cbiAgICBpZiAoXG4gICAgICBwcmVmaXgubWF0Y2goLyhcXCh8XFxzfDt8XFwufFxcXCJ8XFwnKSQvKSB8fFxuICAgICAgcHJlZml4LnJlcGxhY2UoL1xccy9nLCAnJykubGVuZ3RoID09PSAwXG4gICAgKSB7XG5cbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICByZXR1cm4gcHJlZml4O1xuICB9XG5cbiAgZ2V0UHJlZml4KGVkaXRvciwgYnVmZmVyUG9zaXRpb24pIHtcblxuICAgIHRoaXMubGluZSA9IGVkaXRvci5nZXRUZXh0SW5SYW5nZShbW2J1ZmZlclBvc2l0aW9uLnJvdywgMF0sIGJ1ZmZlclBvc2l0aW9uXSk7XG4gICAgdGhpcy5saW5lTWF0Y2hSZXN1bHQgPSB0aGlzLmxpbmUubWF0Y2goUkVHRVhQX0xJTkUpO1xuXG4gICAgaWYgKHRoaXMubGluZU1hdGNoUmVzdWx0KSB7XG5cbiAgICAgIHJldHVybiB0aGlzLmxpbmVNYXRjaFJlc3VsdFswXTtcbiAgICB9XG4gIH1cblxuICBnZXRTdWdnZXN0aW9ucyh7ZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgc2NvcGVEZXNjcmlwdG9yLCBwcmVmaXgsIGFjdGl2YXRlZE1hbnVhbGx5fSkge1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG5cbiAgICAgIGlmICghbWFuYWdlci5jbGllbnQpIHtcblxuICAgICAgICByZXR1cm4gcmVzb2x2ZShbXSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudGVtcFByZWZpeCA9IHRoaXMuZ2V0UHJlZml4KGVkaXRvciwgYnVmZmVyUG9zaXRpb24pIHx8IHByZWZpeDtcblxuICAgICAgaWYgKCF0aGlzLmlzVmFsaWRQcmVmaXgodGhpcy50ZW1wUHJlZml4LCB0aGlzLnRlbXBQcmVmaXhbdGhpcy50ZW1wUHJlZml4Lmxlbmd0aCAtIDFdKSAmJiAhdGhpcy5mb3JjZSAmJiAhYWN0aXZhdGVkTWFudWFsbHkpIHtcblxuICAgICAgICByZXR1cm4gcmVzb2x2ZShbXSk7XG4gICAgICB9XG5cbiAgICAgIHByZWZpeCA9IHRoaXMuY2hlY2tQcmVmaXgodGhpcy50ZW1wUHJlZml4KTtcblxuICAgICAgbWFuYWdlci5jbGllbnQudXBkYXRlKGVkaXRvcikudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICAgIGlmICghZGF0YSkge1xuXG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUoW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFuYWdlci5jbGllbnQuY29tcGxldGlvbnMoYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGVkaXRvci5nZXRVUkkoKSlbMV0sIHtcblxuICAgICAgICAgIGxpbmU6IGJ1ZmZlclBvc2l0aW9uLnJvdyxcbiAgICAgICAgICBjaDogYnVmZmVyUG9zaXRpb24uY29sdW1uXG5cbiAgICAgICAgfSkudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICAgICAgaWYgKCFkYXRhKSB7XG5cbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKFtdKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIWRhdGEuY29tcGxldGlvbnMubGVuZ3RoKSB7XG5cbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKFtdKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb25zQXJyID0gW107XG5cbiAgICAgICAgICBsZXQgc2NvcGVzUGF0aCA9IHNjb3BlRGVzY3JpcHRvci5nZXRTY29wZXNBcnJheSgpO1xuICAgICAgICAgIGxldCBpc0luRnVuRGVmID0gc2NvcGVzUGF0aC5pbmRleE9mKCdtZXRhLmZ1bmN0aW9uLmpzJykgPiAtMTtcblxuICAgICAgICAgIGZvciAobGV0IG9iaiBvZiBkYXRhLmNvbXBsZXRpb25zKSB7XG5cbiAgICAgICAgICAgIG9iaiA9IGZvcm1hdFR5cGVDb21wbGV0aW9uKG9iaiwgZGF0YS5pc1Byb3BlcnR5LCBkYXRhLmlzT2JqZWN0S2V5LCBpc0luRnVuRGVmKTtcblxuICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9uID0ge1xuXG4gICAgICAgICAgICAgIHRleHQ6IG9iai5uYW1lLFxuICAgICAgICAgICAgICByZXBsYWNlbWVudFByZWZpeDogcHJlZml4LFxuICAgICAgICAgICAgICBjbGFzc05hbWU6IG51bGwsXG4gICAgICAgICAgICAgIHR5cGU6IG9iai5fdHlwZVNlbGYsXG4gICAgICAgICAgICAgIGxlZnRMYWJlbDogb2JqLmxlZnRMYWJlbCxcbiAgICAgICAgICAgICAgc25pcHBldDogb2JqLl9zbmlwcGV0LFxuICAgICAgICAgICAgICBkaXNwbGF5VGV4dDogb2JqLl9kaXNwbGF5VGV4dCxcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb246IG9iai5kb2MgfHwgbnVsbCxcbiAgICAgICAgICAgICAgZGVzY3JpcHRpb25Nb3JlVVJMOiBvYmoudXJsIHx8IG51bGxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChwYWNrYWdlQ29uZmlnLm9wdGlvbnMudXNlU25pcHBldHNBbmRGdW5jdGlvbiAmJiBvYmouX2hhc1BhcmFtcykge1xuXG4gICAgICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbkNsb25lID0gY2xvbmUodGhpcy5zdWdnZXN0aW9uKTtcbiAgICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9uQ2xvbmUudHlwZSA9ICdzbmlwcGV0JztcblxuICAgICAgICAgICAgICBpZiAob2JqLl9oYXNQYXJhbXMpIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbi5zbmlwcGV0ID0gYCR7b2JqLm5hbWV9KCRcXHswOlxcfSlgO1xuXG4gICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb24uc25pcHBldCA9IGAke29iai5uYW1lfSgpYDtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbnNBcnIucHVzaCh0aGlzLnN1Z2dlc3Rpb24pO1xuICAgICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb25zQXJyLnB1c2godGhpcy5zdWdnZXN0aW9uQ2xvbmUpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbnNBcnIucHVzaCh0aGlzLnN1Z2dlc3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc29sdmUodGhpcy5zdWdnZXN0aW9uc0Fycik7XG5cbiAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuXG4gICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICAgIHJlc29sdmUoW10pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZm9yY2VDb21wbGV0aW9uKCkge1xuXG4gICAgdGhpcy5mb3JjZSA9IHRydWU7XG4gICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKSwgJ2F1dG9jb21wbGV0ZS1wbHVzOmFjdGl2YXRlJyk7XG4gICAgdGhpcy5mb3JjZSA9IGZhbHNlO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcblxuXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IFByb3ZpZGVyKCk7XG4iXX0=
//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/atom-ternjs/lib/atom-ternjs-provider.js
