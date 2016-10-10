Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _atomTernjsProvider = require('./atom-ternjs-provider');

var _atomTernjsProvider2 = _interopRequireDefault(_atomTernjsProvider);

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

'use babel';

var AtomTernjs = (function () {
  function AtomTernjs() {
    _classCallCheck(this, AtomTernjs);

    this.config = _config2['default'];
  }

  _createClass(AtomTernjs, [{
    key: 'activate',
    value: function activate() {

      _atomTernjsManager2['default'].init();
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {

      _atomTernjsManager2['default'].destroy();
    }
  }, {
    key: 'provide',
    value: function provide() {

      return _atomTernjsProvider2['default'];
    }
  }]);

  return AtomTernjs;
})();

exports['default'] = new AtomTernjs();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdGVmYW5vLmNvcmFsbG8vLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFFeUIsVUFBVTs7OztrQ0FDZCx3QkFBd0I7Ozs7aUNBQ3pCLHVCQUF1Qjs7OztBQUozQyxXQUFXLENBQUM7O0lBTU4sVUFBVTtBQUVILFdBRlAsVUFBVSxHQUVBOzBCQUZWLFVBQVU7O0FBSVosUUFBSSxDQUFDLE1BQU0sc0JBQWUsQ0FBQztHQUM1Qjs7ZUFMRyxVQUFVOztXQU9OLG9CQUFHOztBQUVULHFDQUFRLElBQUksRUFBRSxDQUFDO0tBQ2hCOzs7V0FFUyxzQkFBRzs7QUFFWCxxQ0FBUSxPQUFPLEVBQUUsQ0FBQztLQUNuQjs7O1dBRU0sbUJBQUc7O0FBRVIsNkNBQWdCO0tBQ2pCOzs7U0FwQkcsVUFBVTs7O3FCQXVCRCxJQUFJLFVBQVUsRUFBRSIsImZpbGUiOiIvVXNlcnMvc3RlZmFuby5jb3JhbGxvLy5kb3RmaWxlcy9hdG9tLnN5bWxpbmsvcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBkZWZhdWxDb25maWcgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHByb3ZpZGVyIGZyb20gJy4vYXRvbS10ZXJuanMtcHJvdmlkZXInO1xuaW1wb3J0IG1hbmFnZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1tYW5hZ2VyJztcblxuY2xhc3MgQXRvbVRlcm5qcyB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB0aGlzLmNvbmZpZyA9IGRlZmF1bENvbmZpZztcbiAgfVxuXG4gIGFjdGl2YXRlKCkge1xuXG4gICAgbWFuYWdlci5pbml0KCk7XG4gIH1cblxuICBkZWFjdGl2YXRlKCkge1xuXG4gICAgbWFuYWdlci5kZXN0cm95KCk7XG4gIH1cblxuICBwcm92aWRlKCkge1xuXG4gICAgcmV0dXJuIHByb3ZpZGVyO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBBdG9tVGVybmpzKCk7XG4iXX0=
//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/atom-ternjs/lib/atom-ternjs.js
