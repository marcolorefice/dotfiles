Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _resolveFrom = require('resolve-from');

var _resolveFrom2 = _interopRequireDefault(_resolveFrom);

var _atomTernjsPackageConfig = require('./atom-ternjs-package-config');

var _atomTernjsPackageConfig2 = _interopRequireDefault(_atomTernjsPackageConfig);

'use babel';

var Server = (function () {
  function Server(projectRoot, client) {
    _classCallCheck(this, Server);

    this.client = client;

    this.child = null;

    this.resolves = {};
    this.rejects = {};

    this.projectDir = projectRoot;
    this.distDir = _path2['default'].resolve(__dirname, '../node_modules/tern');

    this.defaultConfig = {

      libs: [],
      loadEagerly: false,
      plugins: {

        doc_comment: true
      },
      ecmaScript: true,
      ecmaVersion: 6,
      dependencyBudget: 20000
    };

    var homeDir = process.env.HOME || process.env.USERPROFILE;

    if (homeDir && _fs2['default'].existsSync(_path2['default'].resolve(homeDir, '.tern-config'))) {

      this.defaultConfig = this.readProjectFile(_path2['default'].resolve(homeDir, '.tern-config'));
    }

    this.projectFileName = '.tern-project';
    this.disableLoadingLocal = false;

    this.init();
  }

  _createClass(Server, [{
    key: 'init',
    value: function init() {
      var _this = this;

      if (!this.projectDir) {

        return;
      }

      this.config = this.readProjectFile(_path2['default'].resolve(this.projectDir, this.projectFileName));

      if (!this.config) {

        this.config = this.defaultConfig;
      }

      this.config.async = _atomTernjsPackageConfig2['default'].options.ternServerGetFileAsync;
      this.config.dependencyBudget = _atomTernjsPackageConfig2['default'].options.ternServerDependencyBudget;

      if (!this.config.plugins['doc_comment']) {

        this.config.plugins['doc_comment'] = true;
      }

      var defs = this.findDefs(this.projectDir, this.config);
      var plugins = this.loadPlugins(this.projectDir, this.config);
      var files = [];

      if (this.config.loadEagerly) {

        this.config.loadEagerly.forEach(function (pat) {

          _glob2['default'].sync(pat, { cwd: _this.projectDir }).forEach(function (file) {

            files.push(file);
          });
        });
      }

      this.child = _child_process2['default'].fork(_path2['default'].resolve(__dirname, './atom-ternjs-server-worker.js'));
      this.child.on('message', this.onWorkerMessage.bind(this));
      this.child.on('error', this.onError);
      this.child.on('disconnect', this.onDisconnect);
      this.child.send({

        type: 'init',
        dir: this.projectDir,
        config: this.config,
        defs: defs,
        plugins: plugins,
        files: files
      });
    }
  }, {
    key: 'onError',
    value: function onError(e) {

      atom.notifications.addError('Child process error: ' + e, {

        dismissable: true
      });
    }
  }, {
    key: 'onDisconnect',
    value: function onDisconnect(e) {

      console.warn(e);
    }
  }, {
    key: 'request',
    value: function request(type, data) {
      var _this2 = this;

      var requestID = _nodeUuid2['default'].v1();

      return new Promise(function (resolve, reject) {

        _this2.resolves[requestID] = resolve;
        _this2.rejects[requestID] = reject;

        _this2.child.send({

          type: type,
          id: requestID,
          data: data
        });
      });
    }
  }, {
    key: 'flush',
    value: function flush() {

      this.request('flush', {}).then(function () {

        atom.notifications.addInfo('All files fetched and analyzed.');
      });
    }
  }, {
    key: 'dontLoad',
    value: function dontLoad(file) {

      if (!this.config.dontLoad) {

        return;
      }

      return this.config.dontLoad.some(function (pat) {

        return (0, _minimatch2['default'])(file, pat);
      });
    }
  }, {
    key: 'onWorkerMessage',
    value: function onWorkerMessage(e) {

      if (e.error && e.error.isUncaughtException) {

        atom.notifications.addError('UncaughtException: ' + e.error.message + '. Restarting Server...', {

          dismissable: false
        });

        for (var key in this.rejects) {

          this.rejects[key]({});
        }

        this.resolves = {};
        this.rejects = {};

        _atomTernjsManager2['default'].restartServer();

        return;
      }

      var isError = e.error !== 'null' && e.error !== 'undefined';

      if (isError) {

        console.error(e);
      }

      if (!e.type && this.resolves[e.id]) {

        if (isError) {

          this.rejects[e.id](e.error);
        } else {

          this.resolves[e.id](e.data);
        }

        delete this.resolves[e.id];
        delete this.rejects[e.id];
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      if (!this.child) {

        return;
      }

      this.child.disconnect();
      this.child = undefined;
    }
  }, {
    key: 'readJSON',
    value: function readJSON(fileName) {

      if ((0, _atomTernjsHelper.fileExists)(fileName) !== undefined) {

        return false;
      }

      var file = _fs2['default'].readFileSync(fileName, 'utf8');

      try {

        return JSON.parse(file);
      } catch (e) {

        atom.notifications.addError('Bad JSON in ' + fileName + ': ' + e.message, {

          dismissable: true
        });
        this.destroy();
      }
    }
  }, {
    key: 'mergeObjects',
    value: function mergeObjects(base, value) {

      if (!base) {

        return value;
      }

      if (!value) {

        return base;
      }

      var result = {};

      for (var prop in base) {

        result[prop] = base[prop];
      }

      for (var prop in value) {

        result[prop] = value[prop];
      }

      return result;
    }
  }, {
    key: 'readProjectFile',
    value: function readProjectFile(fileName) {

      var data = this.readJSON(fileName);

      if (!data) {

        return false;
      }

      for (var option in this.defaultConfig) {

        if (!data.hasOwnProperty(option)) {

          data[option] = this.defaultConfig[option];
        } else if (option === 'plugins') {

          data[option] = this.mergeObjects(this.defaultConfig[option], data[option]);
        }
      }

      return data;
    }
  }, {
    key: 'findFile',
    value: function findFile(file, projectDir, fallbackDir) {

      var local = _path2['default'].resolve(projectDir, file);

      if (!this.disableLoadingLocal && _fs2['default'].existsSync(local)) {

        return local;
      }

      var shared = _path2['default'].resolve(fallbackDir, file);

      if (_fs2['default'].existsSync(shared)) {

        return shared;
      }
    }
  }, {
    key: 'findDefs',
    value: function findDefs(projectDir, config) {

      var defs = [];
      var src = config.libs.slice();

      if (config.ecmaScript && src.indexOf('ecmascript') === -1) {

        src.unshift('ecmascript');
      }

      for (var i = 0; i < src.length; ++i) {

        var file = src[i];

        if (!/\.json$/.test(file)) {

          file = file + '.json';
        }

        var found = this.findFile(file, projectDir, _path2['default'].resolve(this.distDir, 'defs')) || (0, _resolveFrom2['default'])(projectDir, 'tern-' + src[i]);

        if (!found) {

          try {

            found = require.resolve('tern-' + src[i]);
          } catch (e) {

            atom.notifications.addError('Failed to find library ' + src[i] + '\n', {

              dismissable: true
            });
            continue;
          }
        }

        if (found) {

          defs.push(this.readJSON(found));
        }
      }

      return defs;
    }
  }, {
    key: 'loadPlugins',
    value: function loadPlugins(projectDir, config) {

      var plugins = config.plugins;
      var options = {};
      this.config.pluginImports = [];

      for (var plugin in plugins) {

        var val = plugins[plugin];

        if (!val) {

          continue;
        }

        var found = this.findFile(plugin + '.js', projectDir, _path2['default'].resolve(this.distDir, 'plugin')) || (0, _resolveFrom2['default'])(projectDir, 'tern-' + plugin);

        if (!found) {

          try {

            found = require.resolve('tern-' + plugin);
          } catch (e) {

            console.warn(e);
          }
        }

        if (!found) {

          try {

            found = require.resolve(this.projectDir + '/node_modules/tern-' + plugin);
          } catch (e) {

            atom.notifications.addError('Failed to find plugin ' + plugin + '\n', {

              dismissable: true
            });
            continue;
          }
        }

        this.config.pluginImports.push(found);
        options[_path2['default'].basename(plugin)] = val;
      }

      return options;
    }
  }]);

  return Server;
})();

exports['default'] = Server;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdGVmYW5vLmNvcmFsbG8vLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtc2VydmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7aUNBRW9CLHVCQUF1Qjs7OztnQ0FDbEIsc0JBQXNCOztrQkFDaEMsSUFBSTs7OztvQkFDRixNQUFNOzs7O29CQUNOLE1BQU07Ozs7NkJBQ1IsZUFBZTs7Ozt5QkFDUixXQUFXOzs7O3dCQUNoQixXQUFXOzs7OzJCQUNKLGNBQWM7Ozs7dUNBQ1osOEJBQThCOzs7O0FBWHhELFdBQVcsQ0FBQzs7SUFhUyxNQUFNO0FBRWQsV0FGUSxNQUFNLENBRWIsV0FBVyxFQUFFLE1BQU0sRUFBRTswQkFGZCxNQUFNOztBQUl2QixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7QUFFckIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWxCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ25CLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDOztBQUVsQixRQUFJLENBQUMsVUFBVSxHQUFHLFdBQVcsQ0FBQztBQUM5QixRQUFJLENBQUMsT0FBTyxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxTQUFTLEVBQUUsc0JBQXNCLENBQUMsQ0FBQzs7QUFFL0QsUUFBSSxDQUFDLGFBQWEsR0FBRzs7QUFFbkIsVUFBSSxFQUFFLEVBQUU7QUFDUixpQkFBVyxFQUFFLEtBQUs7QUFDbEIsYUFBTyxFQUFFOztBQUVQLG1CQUFXLEVBQUUsSUFBSTtPQUNsQjtBQUNELGdCQUFVLEVBQUUsSUFBSTtBQUNoQixpQkFBVyxFQUFFLENBQUM7QUFDZCxzQkFBZ0IsRUFBRSxLQUFLO0tBQ3hCLENBQUM7O0FBRUYsUUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENB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O1dBRTNFLENBQUMsT0FBTyxDQUFDLEVBQUU7O0FBRVYsZ0JBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSw0QkFBMEIsTUFBTSxTQUFNOztBQUUvRCx5QkFBVyxFQUFFLElBQUk7YUFDbEIsQ0FBQyxDQUFDO0FBQ0gscUJBQVM7V0FDVjtTQUNGOztBQUVELFlBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0QyxlQUFPLENBQUMsa0JBQUssUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO09BQ3RDOztBQUVELGFBQU8sT0FBTyxDQUFDO0tBQ2hCOzs7U0F6WWtCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6Ii9Vc2Vycy9zdGVmYW5vLmNvcmFsbG8vLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtc2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBtYW5hZ2VyIGZyb20gJy4vYXRvbS10ZXJuanMtbWFuYWdlcic7XG5pbXBvcnQge2ZpbGVFeGlzdHN9IGZyb20gJy4vYXRvbS10ZXJuanMtaGVscGVyJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBnbG9iIGZyb20gJ2dsb2InO1xuaW1wb3J0IGNwIGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0IG1pbmltYXRjaCBmcm9tICdtaW5pbWF0Y2gnO1xuaW1wb3J0IHV1aWQgZnJvbSAnbm9kZS11dWlkJztcbmltcG9ydCByZXNvbHZlRnJvbSBmcm9tICdyZXNvbHZlLWZyb20nO1xuaW1wb3J0IHBhY2thZ2VDb25maWcgZnJvbSAnLi9hdG9tLXRlcm5qcy1wYWNrYWdlLWNvbmZpZyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZlciB7XG5cbiAgY29uc3RydWN0b3IocHJvamVjdFJvb3QsIGNsaWVudCkge1xuXG4gICAgdGhpcy5jbGllbnQgPSBjbGllbnQ7XG5cbiAgICB0aGlzLmNoaWxkID0gbnVsbDtcblxuICAgIHRoaXMucmVzb2x2ZXMgPSB7fTtcbiAgICB0aGlzLnJlamVjdHMgPSB7fTtcblxuICAgIHRoaXMucHJvamVjdERpciA9IHByb2plY3RSb290O1xuICAgIHRoaXMuZGlzdERpciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9ub2RlX21vZHVsZXMvdGVybicpO1xuXG4gICAgdGhpcy5kZWZhdWx0Q29uZmlnID0ge1xuXG4gICAgICBsaWJzOiBbXSxcbiAgICAgIGxvYWRFYWdlcmx5OiBmYWxzZSxcbiAgICAgIHBsdWdpbnM6IHtcblxuICAgICAgICBkb2NfY29tbWVudDogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGVjbWFTY3JpcHQ6IHRydWUsXG4gICAgICBlY21hVmVyc2lvbjogNixcbiAgICAgIGRlcGVuZGVuY3lCdWRnZXQ6IDIwMDAwXG4gICAgfTtcblxuICAgIGNvbnN0IGhvbWVEaXIgPSBwcm9jZXNzLmVudi5IT01FIHx8IHByb2Nlc3MuZW52LlVTRVJQUk9GSUxFO1xuXG4gICAgaWYgKGhvbWVEaXIgJiYgZnMuZXhpc3RzU3luYyhwYXRoLnJlc29sdmUoaG9tZURpciwgJy50ZXJuLWNvbmZpZycpKSkge1xuXG4gICAgICB0aGlzLmRlZmF1bHRDb25maWcgPSB0aGlzLnJlYWRQcm9qZWN0RmlsZShwYXRoLnJlc29sdmUoaG9tZURpciwgJy50ZXJuLWNvbmZpZycpKTtcbiAgICB9XG5cbiAgICB0aGlzLnByb2plY3RGaWxlTmFtZSA9ICcudGVybi1wcm9qZWN0JztcbiAgICB0aGlzLmRpc2FibGVMb2FkaW5nTG9jYWwgPSBmYWxzZTtcblxuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgaW5pdCgpIHtcblxuICAgIGlmICghdGhpcy5wcm9qZWN0RGlyKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZyA9IHRoaXMucmVhZFByb2plY3RGaWxlKHBhdGgucmVzb2x2ZSh0aGlzLnByb2plY3REaXIsIHRoaXMucHJvamVjdEZpbGVOYW1lKSk7XG5cbiAgICBpZiAoIXRoaXMuY29uZmlnKSB7XG5cbiAgICAgIHRoaXMuY29uZmlnID0gdGhpcy5kZWZhdWx0Q29uZmlnO1xuICAgIH1cblxuICAgIHRoaXMuY29uZmlnLmFzeW5jID0gcGFja2FnZUNvbmZpZy5vcHRpb25zLnRlcm5TZXJ2ZXJHZXRGaWxlQXN5bmM7XG4gICAgdGhpcy5jb25maWcuZGVwZW5kZW5jeUJ1ZGdldCA9IHBhY2thZ2VDb25maWcub3B0aW9ucy50ZXJuU2VydmVyRGVwZW5kZW5jeUJ1ZGdldDtcblxuICAgIGlmICghdGhpcy5jb25maWcucGx1Z2luc1snZG9jX2NvbW1lbnQnXSkge1xuXG4gICAgICB0aGlzLmNvbmZpZy5wbHVnaW5zWydkb2NfY29tbWVudCddID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBsZXQgZGVmcyA9IHRoaXMuZmluZERlZnModGhpcy5wcm9qZWN0RGlyLCB0aGlzLmNvbmZpZyk7XG4gICAgbGV0IHBsdWdpbnMgPSB0aGlzLmxvYWRQbHVnaW5zKHRoaXMucHJvamVjdERpciwgdGhpcy5jb25maWcpO1xuICAgIGxldCBmaWxlcyA9IFtdO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLmxvYWRFYWdlcmx5KSB7XG5cbiAgICAgIHRoaXMuY29uZmlnLmxvYWRFYWdlcmx5LmZvckVhY2goKHBhdCkgPT4ge1xuXG4gICAgICAgIGdsb2Iuc3luYyhwYXQsIHsgY3dkOiB0aGlzLnByb2plY3REaXIgfSkuZm9yRWFjaChmdW5jdGlvbihmaWxlKSB7XG5cbiAgICAgICAgICBmaWxlcy5wdXNoKGZpbGUpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuY2hpbGQgPSBjcC5mb3JrKHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL2F0b20tdGVybmpzLXNlcnZlci13b3JrZXIuanMnKSk7XG4gICAgdGhpcy5jaGlsZC5vbignbWVzc2FnZScsIHRoaXMub25Xb3JrZXJNZXNzYWdlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuY2hpbGQub24oJ2Vycm9yJywgdGhpcy5vbkVycm9yKTtcbiAgICB0aGlzLmNoaWxkLm9uKCdkaXNjb25uZWN0JywgdGhpcy5vbkRpc2Nvbm5lY3QpO1xuICAgIHRoaXMuY2hpbGQuc2VuZCh7XG5cbiAgICAgIHR5cGU6ICdpbml0JyxcbiAgICAgIGRpcjogdGhpcy5wcm9qZWN0RGlyLFxuICAgICAgY29uZmlnOiB0aGlzLmNvbmZpZyxcbiAgICAgIGRlZnM6IGRlZnMsXG4gICAgICBwbHVnaW5zOiBwbHVnaW5zLFxuICAgICAgZmlsZXM6IGZpbGVzXG4gICAgfSk7XG4gIH1cblxuICBvbkVycm9yKGUpIHtcblxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgQ2hpbGQgcHJvY2VzcyBlcnJvcjogJHtlfWAsIHtcblxuICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIG9uRGlzY29ubmVjdChlKSB7XG5cbiAgICBjb25zb2xlLndhcm4oZSk7XG4gIH1cblxuICByZXF1ZXN0KHR5cGUsIGRhdGEpIHtcblxuICAgIGxldCByZXF1ZXN0SUQgPSB1dWlkLnYxKCk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICB0aGlzLnJlc29sdmVzW3JlcXVlc3RJRF0gPSByZXNvbHZlO1xuICAgICAgdGhpcy5yZWplY3RzW3JlcXVlc3RJRF0gPSByZWplY3Q7XG5cbiAgICAgIHRoaXMuY2hpbGQuc2VuZCh7XG5cbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgaWQ6IHJlcXVlc3RJRCxcbiAgICAgICAgZGF0YTogZGF0YVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBmbHVzaCgpIHtcblxuICAgIHRoaXMucmVxdWVzdCgnZmx1c2gnLCB7fSkudGhlbigoKSA9PiB7XG5cbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKCdBbGwgZmlsZXMgZmV0Y2hlZCBhbmQgYW5hbHl6ZWQuJyk7XG4gICAgfSk7XG4gIH1cblxuICBkb250TG9hZChmaWxlKSB7XG5cbiAgICBpZiAoIXRoaXMuY29uZmlnLmRvbnRMb2FkKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jb25maWcuZG9udExvYWQuc29tZSgocGF0KSA9PiB7XG5cbiAgICAgIHJldHVybiBtaW5pbWF0Y2goZmlsZSwgcGF0KTtcbiAgICB9KTtcbiAgfVxuXG4gIG9uV29ya2VyTWVzc2FnZShlKSB7XG5cbiAgICBpZiAoZS5lcnJvciAmJiBlLmVycm9yLmlzVW5jYXVnaHRFeGNlcHRpb24pIHtcblxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGBVbmNhdWdodEV4Y2VwdGlvbjogJHtlLmVycm9yLm1lc3NhZ2V9LiBSZXN0YXJ0aW5nIFNlcnZlci4uLmAsIHtcblxuICAgICAgICBkaXNtaXNzYWJsZTogZmFsc2VcbiAgICAgIH0pO1xuXG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLnJlamVjdHMpIHtcblxuICAgICAgICB0aGlzLnJlamVjdHNba2V5XSh7fSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVzb2x2ZXMgPSB7fTtcbiAgICAgIHRoaXMucmVqZWN0cyA9IHt9O1xuXG4gICAgICBtYW5hZ2VyLnJlc3RhcnRTZXJ2ZXIoKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGlzRXJyb3IgPSBlLmVycm9yICE9PSAnbnVsbCcgJiYgZS5lcnJvciAhPT0gJ3VuZGVmaW5lZCc7XG5cbiAgICBpZiAoaXNFcnJvcikge1xuXG4gICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgIH1cblxuICAgIGlmICghZS50eXBlICYmIHRoaXMucmVzb2x2ZXNbZS5pZF0pIHtcblxuICAgICAgaWYgKGlzRXJyb3IpIHtcblxuICAgICAgICB0aGlzLnJlamVjdHNbZS5pZF0oZS5lcnJvcik7XG5cbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgdGhpcy5yZXNvbHZlc1tlLmlkXShlLmRhdGEpO1xuICAgICAgfVxuXG4gICAgICBkZWxldGUgdGhpcy5yZXNvbHZlc1tlLmlkXTtcbiAgICAgIGRlbGV0ZSB0aGlzLnJlamVjdHNbZS5pZF07XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveSgpIHtcblxuICAgIGlmICghdGhpcy5jaGlsZCkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jaGlsZC5kaXNjb25uZWN0KCk7XG4gICAgdGhpcy5jaGlsZCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJlYWRKU09OKGZpbGVOYW1lKSB7XG5cbiAgICBpZiAoZmlsZUV4aXN0cyhmaWxlTmFtZSkgIT09IHVuZGVmaW5lZCkge1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbGV0IGZpbGUgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZU5hbWUsICd1dGY4Jyk7XG5cbiAgICB0cnkge1xuXG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShmaWxlKTtcblxuICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGBCYWQgSlNPTiBpbiAke2ZpbGVOYW1lfTogJHtlLm1lc3NhZ2V9YCwge1xuXG4gICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgIH1cbiAgfVxuXG4gIG1lcmdlT2JqZWN0cyhiYXNlLCB2YWx1ZSkge1xuXG4gICAgaWYgKCFiYXNlKSB7XG5cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAoIXZhbHVlKSB7XG5cbiAgICAgIHJldHVybiBiYXNlO1xuICAgIH1cblxuICAgIGxldCByZXN1bHQgPSB7fTtcblxuICAgIGZvciAoY29uc3QgcHJvcCBpbiBiYXNlKSB7XG5cbiAgICAgIHJlc3VsdFtwcm9wXSA9IGJhc2VbcHJvcF07XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBwcm9wIGluIHZhbHVlKSB7XG5cbiAgICAgIHJlc3VsdFtwcm9wXSA9IHZhbHVlW3Byb3BdO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICByZWFkUHJvamVjdEZpbGUoZmlsZU5hbWUpIHtcblxuICAgIGxldCBkYXRhID0gdGhpcy5yZWFkSlNPTihmaWxlTmFtZSk7XG5cbiAgICBpZiAoIWRhdGEpIHtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGZvciAodmFyIG9wdGlvbiBpbiB0aGlzLmRlZmF1bHRDb25maWcpIHtcblxuICAgICAgaWYgKCFkYXRhLmhhc093blByb3BlcnR5KG9wdGlvbikpIHtcblxuICAgICAgICBkYXRhW29wdGlvbl0gPSB0aGlzLmRlZmF1bHRDb25maWdbb3B0aW9uXTtcblxuICAgICAgfSBlbHNlIGlmIChvcHRpb24gPT09ICdwbHVnaW5zJykge1xuXG4gICAgICAgIGRhdGFbb3B0aW9uXSA9IHRoaXMubWVyZ2VPYmplY3RzKHRoaXMuZGVmYXVsdENvbmZpZ1tvcHRpb25dLCBkYXRhW29wdGlvbl0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgZmluZEZpbGUoZmlsZSwgcHJvamVjdERpciwgZmFsbGJhY2tEaXIpIHtcblxuICAgIGxldCBsb2NhbCA9IHBhdGgucmVzb2x2ZShwcm9qZWN0RGlyLCBmaWxlKTtcblxuICAgIGlmICghdGhpcy5kaXNhYmxlTG9hZGluZ0xvY2FsICYmIGZzLmV4aXN0c1N5bmMobG9jYWwpKSB7XG5cbiAgICAgIHJldHVybiBsb2NhbDtcbiAgICB9XG5cbiAgICBsZXQgc2hhcmVkID0gcGF0aC5yZXNvbHZlKGZhbGxiYWNrRGlyLCBmaWxlKTtcblxuICAgIGlmIChmcy5leGlzdHNTeW5jKHNoYXJlZCkpIHtcblxuICAgICAgcmV0dXJuIHNoYXJlZDtcbiAgICB9XG4gIH1cblxuICBmaW5kRGVmcyhwcm9qZWN0RGlyLCBjb25maWcpIHtcblxuICAgIGxldCBkZWZzID0gW107XG4gICAgbGV0IHNyYyA9IGNvbmZpZy5saWJzLnNsaWNlKCk7XG5cbiAgICBpZiAoY29uZmlnLmVjbWFTY3JpcHQgJiYgc3JjLmluZGV4T2YoJ2VjbWFzY3JpcHQnKSA9PT0gLTEpIHtcblxuICAgICAgc3JjLnVuc2hpZnQoJ2VjbWFzY3JpcHQnKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNyYy5sZW5ndGg7ICsraSkge1xuXG4gICAgICBsZXQgZmlsZSA9IHNyY1tpXTtcblxuICAgICAgaWYgKCEvXFwuanNvbiQvLnRlc3QoZmlsZSkpIHtcblxuICAgICAgICBmaWxlID0gYCR7ZmlsZX0uanNvbmA7XG4gICAgICB9XG5cbiAgICAgIGxldCBmb3VuZCA9XG4gICAgICAgIHRoaXMuZmluZEZpbGUoZmlsZSwgcHJvamVjdERpciwgcGF0aC5yZXNvbHZlKHRoaXMuZGlzdERpciwgJ2RlZnMnKSkgfHxcbiAgICAgICAgcmVzb2x2ZUZyb20ocHJvamVjdERpciwgYHRlcm4tJHtzcmNbaV19YClcbiAgICAgICAgO1xuXG4gICAgICBpZiAoIWZvdW5kKSB7XG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgIGZvdW5kID0gcmVxdWlyZS5yZXNvbHZlKGB0ZXJuLSR7c3JjW2ldfWApO1xuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgRmFpbGVkIHRvIGZpbmQgbGlicmFyeSAke3NyY1tpXX1cXG5gLCB7XG5cbiAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGZvdW5kKSB7XG5cbiAgICAgICAgZGVmcy5wdXNoKHRoaXMucmVhZEpTT04oZm91bmQpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVmcztcbiAgfVxuXG4gIGxvYWRQbHVnaW5zKHByb2plY3REaXIsIGNvbmZpZykge1xuXG4gICAgbGV0IHBsdWdpbnMgPSBjb25maWcucGx1Z2lucztcbiAgICBsZXQgb3B0aW9ucyA9IHt9O1xuICAgIHRoaXMuY29uZmlnLnBsdWdpbkltcG9ydHMgPSBbXTtcblxuICAgIGZvciAobGV0IHBsdWdpbiBpbiBwbHVnaW5zKSB7XG5cbiAgICAgIGxldCB2YWwgPSBwbHVnaW5zW3BsdWdpbl07XG5cbiAgICAgIGlmICghdmFsKSB7XG5cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxldCBmb3VuZCA9XG4gICAgICAgIHRoaXMuZmluZEZpbGUoYCR7cGx1Z2lufS5qc2AsIHByb2plY3REaXIsIHBhdGgucmVzb2x2ZSh0aGlzLmRpc3REaXIsICdwbHVnaW4nKSkgfHxcbiAgICAgICAgcmVzb2x2ZUZyb20ocHJvamVjdERpciwgYHRlcm4tJHtwbHVnaW59YClcbiAgICAgICAgO1xuXG4gICAgICBpZiAoIWZvdW5kKSB7XG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgIGZvdW5kID0gcmVxdWlyZS5yZXNvbHZlKGB0ZXJuLSR7cGx1Z2lufWApO1xuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgICAgIGNvbnNvbGUud2FybihlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIWZvdW5kKSB7XG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgIGZvdW5kID0gcmVxdWlyZS5yZXNvbHZlKGAke3RoaXMucHJvamVjdERpcn0vbm9kZV9tb2R1bGVzL3Rlcm4tJHtwbHVnaW59YCk7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGBGYWlsZWQgdG8gZmluZCBwbHVnaW4gJHtwbHVnaW59XFxuYCwge1xuXG4gICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY29uZmlnLnBsdWdpbkltcG9ydHMucHVzaChmb3VuZCk7XG4gICAgICBvcHRpb25zW3BhdGguYmFzZW5hbWUocGx1Z2luKV0gPSB2YWw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGlvbnM7XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/atom-ternjs/lib/atom-ternjs-server.js
