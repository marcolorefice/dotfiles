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

var _underscorePlus = require('underscore-plus');

'use babel';

var ConfigView = require('./atom-ternjs-config-view');

var Config = (function () {
  function Config() {
    _classCallCheck(this, Config);

    this.disposables = [];

    this.config = undefined;
    this.projectConfig = undefined;
    this.editors = [];

    this.configClearHandler = this.clear.bind(this);
    _atomTernjsEvents2['default'].on('config-clear', this.configClearHandler);

    this.registerCommands();
  }

  _createClass(Config, [{
    key: 'registerCommands',
    value: function registerCommands() {

      this.disposables.push(atom.commands.add('atom-workspace', 'atom-ternjs:openConfig', this.show.bind(this)));
    }
  }, {
    key: 'getContent',
    value: function getContent(filePath, projectRoot) {

      var root = undefined;

      if (projectRoot) {

        root = _atomTernjsManager2['default'].server && _atomTernjsManager2['default'].server.projectDir;
      } else {

        root = '';
      }

      var content = (0, _atomTernjsHelper.getFileContent)(filePath, root);

      if (!content) {

        return;
      }

      try {

        content = JSON.parse(content);
      } catch (e) {

        atom.notifications.addInfo('Error parsing .tern-project. Please check if it is a valid JSON file.', {

          dismissable: true
        });
        return;
      }

      return content;
    }
  }, {
    key: 'prepareLibs',
    value: function prepareLibs(configDefault) {

      var libs = {};

      for (var index in configDefault.libs) {

        if (this.projectConfig.libs && this.projectConfig.libs.indexOf(configDefault.libs[index]) > -1) {

          libs[configDefault.libs[index]] = {

            _active: true
          };
        } else {

          libs[configDefault.libs[index]] = {

            _active: false
          };
        }
      }

      this.config.libs = libs;
    }
  }, {
    key: 'prepareEcma',
    value: function prepareEcma(configDefault) {

      var ecmaVersions = {};

      for (var lib of Object.keys(configDefault.ecmaVersions)) {

        ecmaVersions[lib] = configDefault.ecmaVersions[lib];
      }

      this.config.ecmaVersions = ecmaVersions;

      if (this.config.ecmaVersion) {

        for (var lib of Object.keys(this.config.ecmaVersions)) {

          if (lib === 'ecmaVersion' + this.config.ecmaVersion) {

            this.config.ecmaVersions[lib] = true;
          } else {

            this.config.ecmaVersions[lib] = false;
          }
        }
      }
    }
  }, {
    key: 'preparePlugins',
    value: function preparePlugins(availablePlugins) {

      if (!this.config.plugins) {

        this.config.plugins = {};
      }

      // check if there are unknown plugins in .tern-config
      for (var plugin of Object.keys(this.config.plugins)) {

        if (!availablePlugins[plugin]) {

          availablePlugins[plugin] = plugin;
        }
      }

      for (var plugin of Object.keys(availablePlugins)) {

        if (this.config.plugins[plugin]) {

          this.config.plugins[plugin] = this.mergeConfigObjects(availablePlugins[plugin], this.config.plugins[plugin]);
          this.config.plugins[plugin]._active = true;
        } else {

          this.config.plugins[plugin] = availablePlugins[plugin];
          this.config.plugins[plugin]._active = false;
        }
      }
    }
  }, {
    key: 'registerEvents',
    value: function registerEvents() {
      var _this = this;

      var close = this.configView.getClose();
      var cancel = this.configView.getCancel();

      close.addEventListener('click', function (e) {

        _this.updateConfig();
        _this.hide();

        (0, _atomTernjsHelper.focusEditor)();
      });

      cancel.addEventListener('click', function (e) {

        _this.destroyEditors();
        _this.hide();

        (0, _atomTernjsHelper.focusEditor)();
      });
    }
  }, {
    key: 'mergeConfigObjects',
    value: function mergeConfigObjects(obj1, obj2) {

      return (0, _underscorePlus.deepExtend)({}, obj1, obj2);
    }
  }, {
    key: 'hide',
    value: function hide() {

      if (!this.configPanel) {

        return;
      }

      this.configPanel.hide();
    }
  }, {
    key: 'clear',
    value: function clear() {

      this.hide();
      this.destroyEditors();
      this.config = undefined;
      this.projectConfig = undefined;

      if (!this.configView) {

        return;
      }

      this.configView.removeContent();
    }
  }, {
    key: 'gatherData',
    value: function gatherData() {

      var configDefault = this.getContent('../config/tern-config.json', false);
      var pluginsTern = this.getContent('../config/tern-plugins.json', false);

      if (!configDefault) {

        console.error('Could not load: tern-config.json');
        return;
      }

      this.projectConfig = this.getContent('/.tern-project', true);
      this.config = this.projectConfig || {};

      if (!this.projectConfig) {

        this.projectConfig = {};
        this.config = (0, _underscorePlus.clone)(configDefault);
      }

      this.prepareEcma(configDefault);
      this.prepareLibs(configDefault);
      this.preparePlugins(pluginsTern);

      if (!this.config.loadEagerly) {

        this.config.loadEagerly = [];
      }

      if (!this.config.dontLoad) {

        this.config.dontLoad = [];
      }

      return true;
    }
  }, {
    key: 'removeEditor',
    value: function removeEditor(editor) {

      if (!editor) {

        return;
      }

      var idx = this.editors.indexOf(editor);

      if (idx === -1) {

        return;
      }

      this.editors.splice(idx, 1);
    }
  }, {
    key: 'destroyEditors',
    value: function destroyEditors() {

      for (var editor of this.editors) {

        var buffer = editor.getModel().getBuffer();
        buffer.destroy();
      }

      this.editors = [];
    }
  }, {
    key: 'updateConfig',
    value: function updateConfig() {

      this.config.loadEagerly = [];
      this.config.dontLoad = [];

      for (var editor of this.editors) {

        var buffer = editor.getModel().getBuffer();
        var text = buffer.getText().trim();

        if (text === '') {

          continue;
        }

        this.config[editor.__ternjs_section].push(text);
      }

      this.destroyEditors();

      var newConfig = this.buildNewConfig();
      var newConfigJSON = JSON.stringify(newConfig, null, 2);

      (0, _atomTernjsHelper.updateTernFile)(newConfigJSON, true);
    }
  }, {
    key: 'buildNewConfig',
    value: function buildNewConfig() {

      var newConfig = {};

      for (var key of Object.keys(this.config.ecmaVersions)) {

        if (this.config.ecmaVersions[key]) {

          newConfig.ecmaVersion = Number(key[key.length - 1]);
          break;
        }
      }

      if (!(0, _underscorePlus.isEmpty)(this.config.libs)) {

        newConfig.libs = [];

        for (var key of Object.keys(this.config.libs)) {

          if (this.config.libs[key]._active) {

            newConfig.libs.push(key);
          }
        }
      }

      if (this.config.loadEagerly.length !== 0) {

        newConfig.loadEagerly = this.config.loadEagerly;
      }

      if (this.config.dontLoad.length !== 0) {

        newConfig.dontLoad = this.config.dontLoad;
      }

      if (!(0, _underscorePlus.isEmpty)(this.config.plugins)) {

        newConfig.plugins = {};

        for (var key of Object.keys(this.config.plugins)) {

          if (this.config.plugins[key]._active) {

            delete this.config.plugins[key]._active;
            newConfig.plugins[key] = this.config.plugins[key];
          }
        }
      }

      return newConfig;
    }
  }, {
    key: 'initConfigView',
    value: function initConfigView() {

      this.configView = new ConfigView();
      this.configView.initialize(this);

      this.configPanel = atom.workspace.addRightPanel({

        item: this.configView,
        priority: 0
      });
      this.configPanel.hide();

      this.registerEvents();
    }
  }, {
    key: 'show',
    value: function show() {

      if (!this.configView) {

        this.initConfigView();
      }

      this.clear();

      if (!this.gatherData()) {

        return;
      }

      atom.views.getView(this.configPanel).classList.add('atom-ternjs-config-panel');

      this.configView.buildOptionsMarkup();
      this.configPanel.show();
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      (0, _atomTernjsHelper.disposeAll)(this.disposables);

      if (this.configView) {

        this.configView.destroy();
      }
      this.configView = undefined;

      if (this.configPanel) {

        this.configPanel.destroy();
      }
      this.configPanel = undefined;
    }
  }]);

  return Config;
})();

exports['default'] = new Config();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdGVmYW5vLmNvcmFsbG8vLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtY29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7aUNBSW9CLHVCQUF1Qjs7OztnQ0FDdkIsc0JBQXNCOzs7O2dDQU1uQyxzQkFBc0I7OzhCQU10QixpQkFBaUI7O0FBakJ4QixXQUFXLENBQUM7O0FBRVosSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7O0lBaUJsRCxNQUFNO0FBRUMsV0FGUCxNQUFNLEdBRUk7MEJBRlYsTUFBTTs7QUFJUixRQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQzs7QUFFdEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7QUFDeEIsUUFBSSxDQUFDLGFBQWEsR0FBRyxTQUFTLENBQUM7QUFDL0IsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7O0FBRWxCLFFBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoRCxrQ0FBUSxFQUFFLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOztBQUVwRCxRQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztHQUN6Qjs7ZUFkRyxNQUFNOztXQWdCTSw0QkFBRzs7QUFFakIsVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzVHOzs7V0FFUyxvQkFBQyxRQUFRLEVBQUUsV0FBVyxFQUFFOztBQUVoQyxVQUFJLElBQUksWUFBQSxDQUFDOztBQUVULFVBQUksV0FBVyxFQUFF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VSxHQUFHLFNBQVMsQ0FBQzs7QUFFNUIsVUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFOztBQUVwQixZQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDO09BQzVCO0FBQ0QsVUFBSSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7S0FDOUI7OztTQW5ZRyxNQUFNOzs7cUJBc1lHLElBQUksTUFBTSxFQUFFIiwiZmlsZSI6Ii9Vc2Vycy9zdGVmYW5vLmNvcmFsbG8vLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmNvbnN0IENvbmZpZ1ZpZXcgPSByZXF1aXJlKCcuL2F0b20tdGVybmpzLWNvbmZpZy12aWV3Jyk7XG5cbmltcG9ydCBtYW5hZ2VyIGZyb20gJy4vYXRvbS10ZXJuanMtbWFuYWdlcic7XG5pbXBvcnQgZW1pdHRlciBmcm9tICcuL2F0b20tdGVybmpzLWV2ZW50cyc7XG5pbXBvcnQge1xuICBnZXRGaWxlQ29udGVudCxcbiAgZm9jdXNFZGl0b3IsXG4gIHVwZGF0ZVRlcm5GaWxlLFxuICBkaXNwb3NlQWxsXG59IGZyb20gJy4vYXRvbS10ZXJuanMtaGVscGVyJztcblxuaW1wb3J0IHtcbiAgZGVlcEV4dGVuZCxcbiAgY2xvbmUsXG4gIGlzRW1wdHlcbn0gZnJvbSAndW5kZXJzY29yZS1wbHVzJztcblxuY2xhc3MgQ29uZmlnIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBbXTtcblxuICAgIHRoaXMuY29uZmlnID0gdW5kZWZpbmVkO1xuICAgIHRoaXMucHJvamVjdENvbmZpZyA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmVkaXRvcnMgPSBbXTtcblxuICAgIHRoaXMuY29uZmlnQ2xlYXJIYW5kbGVyID0gdGhpcy5jbGVhci5iaW5kKHRoaXMpO1xuICAgIGVtaXR0ZXIub24oJ2NvbmZpZy1jbGVhcicsIHRoaXMuY29uZmlnQ2xlYXJIYW5kbGVyKTtcblxuICAgIHRoaXMucmVnaXN0ZXJDb21tYW5kcygpO1xuICB9XG5cbiAgcmVnaXN0ZXJDb21tYW5kcygpIHtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnYXRvbS10ZXJuanM6b3BlbkNvbmZpZycsIHRoaXMuc2hvdy5iaW5kKHRoaXMpKSk7XG4gIH1cblxuICBnZXRDb250ZW50KGZpbGVQYXRoLCBwcm9qZWN0Um9vdCkge1xuXG4gICAgbGV0IHJvb3Q7XG5cbiAgICBpZiAocHJvamVjdFJvb3QpIHtcblxuICAgICAgcm9vdCA9IG1hbmFnZXIuc2VydmVyICYmIG1hbmFnZXIuc2VydmVyLnByb2plY3REaXI7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICByb290ID0gJyc7XG4gICAgfVxuXG4gICAgbGV0IGNvbnRlbnQgPSBnZXRGaWxlQ29udGVudChmaWxlUGF0aCwgcm9vdCk7XG5cbiAgICBpZiAoIWNvbnRlbnQpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG5cbiAgICAgIGNvbnRlbnQgPSBKU09OLnBhcnNlKGNvbnRlbnQpO1xuXG4gICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnRXJyb3IgcGFyc2luZyAudGVybi1wcm9qZWN0LiBQbGVhc2UgY2hlY2sgaWYgaXQgaXMgYSB2YWxpZCBKU09OIGZpbGUuJywge1xuXG4gICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuXG4gIHByZXBhcmVMaWJzKGNvbmZpZ0RlZmF1bHQpIHtcblxuICAgIGxldCBsaWJzID0ge307XG5cbiAgICBmb3IgKGNvbnN0IGluZGV4IGluIGNvbmZpZ0RlZmF1bHQubGlicykge1xuXG4gICAgICBpZiAodGhpcy5wcm9qZWN0Q29uZmlnLmxpYnMgJiYgdGhpcy5wcm9qZWN0Q29uZmlnLmxpYnMuaW5kZXhPZihjb25maWdEZWZhdWx0LmxpYnNbaW5kZXhdKSA+IC0xKSB7XG5cbiAgICAgICAgbGlic1tjb25maWdEZWZhdWx0LmxpYnNbaW5kZXhdXSA9IHtcblxuICAgICAgICAgIF9hY3RpdmU6IHRydWVcbiAgICAgICAgfTtcblxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICBsaWJzW2NvbmZpZ0RlZmF1bHQubGlic1tpbmRleF1dID0ge1xuXG4gICAgICAgICAgX2FjdGl2ZTogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZy5saWJzID0gbGlicztcbiAgfVxuXG4gIHByZXBhcmVFY21hKGNvbmZpZ0RlZmF1bHQpIHtcblxuICAgIGxldCBlY21hVmVyc2lvbnMgPSB7fTtcblxuICAgIGZvciAobGV0IGxpYiBvZiBPYmplY3Qua2V5cyhjb25maWdEZWZhdWx0LmVjbWFWZXJzaW9ucykpIHtcblxuICAgICAgZWNtYVZlcnNpb25zW2xpYl0gPSBjb25maWdEZWZhdWx0LmVjbWFWZXJzaW9uc1tsaWJdO1xuICAgIH1cblxuICAgIHRoaXMuY29uZmlnLmVjbWFWZXJzaW9ucyA9IGVjbWFWZXJzaW9ucztcblxuICAgIGlmICh0aGlzLmNvbmZpZy5lY21hVmVyc2lvbikge1xuXG4gICAgICBmb3IgKGxldCBsaWIgb2YgT2JqZWN0LmtleXModGhpcy5jb25maWcuZWNtYVZlcnNpb25zKSkge1xuXG4gICAgICAgIGlmIChsaWIgPT09ICdlY21hVmVyc2lvbicgKyB0aGlzLmNvbmZpZy5lY21hVmVyc2lvbikge1xuXG4gICAgICAgICAgdGhpcy5jb25maWcuZWNtYVZlcnNpb25zW2xpYl0gPSB0cnVlO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICB0aGlzLmNvbmZpZy5lY21hVmVyc2lvbnNbbGliXSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJlcGFyZVBsdWdpbnMoYXZhaWxhYmxlUGx1Z2lucykge1xuXG4gICAgaWYgKCF0aGlzLmNvbmZpZy5wbHVnaW5zKSB7XG5cbiAgICAgIHRoaXMuY29uZmlnLnBsdWdpbnMgPSB7fTtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBpZiB0aGVyZSBhcmUgdW5rbm93biBwbHVnaW5zIGluIC50ZXJuLWNvbmZpZ1xuICAgIGZvciAoY29uc3QgcGx1Z2luIG9mIE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLnBsdWdpbnMpKSB7XG5cbiAgICAgIGlmICghYXZhaWxhYmxlUGx1Z2luc1twbHVnaW5dKSB7XG5cbiAgICAgICAgYXZhaWxhYmxlUGx1Z2luc1twbHVnaW5dID0gcGx1Z2luO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgcGx1Z2luIG9mIE9iamVjdC5rZXlzKGF2YWlsYWJsZVBsdWdpbnMpKSB7XG5cbiAgICAgIGlmICh0aGlzLmNvbmZpZy5wbHVnaW5zW3BsdWdpbl0pIHtcblxuICAgICAgICB0aGlzLmNvbmZpZy5wbHVnaW5zW3BsdWdpbl0gPSB0aGlzLm1lcmdlQ29uZmlnT2JqZWN0cyhhdmFpbGFibGVQbHVnaW5zW3BsdWdpbl0sIHRoaXMuY29uZmlnLnBsdWdpbnNbcGx1Z2luXSk7XG4gICAgICAgIHRoaXMuY29uZmlnLnBsdWdpbnNbcGx1Z2luXS5fYWN0aXZlID0gdHJ1ZTtcblxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICB0aGlzLmNvbmZpZy5wbHVnaW5zW3BsdWdpbl0gPSBhdmFpbGFibGVQbHVnaW5zW3BsdWdpbl07XG4gICAgICAgIHRoaXMuY29uZmlnLnBsdWdpbnNbcGx1Z2luXS5fYWN0aXZlID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJFdmVudHMoKSB7XG5cbiAgICBsZXQgY2xvc2UgPSB0aGlzLmNvbmZpZ1ZpZXcuZ2V0Q2xvc2UoKTtcbiAgICBsZXQgY2FuY2VsID0gdGhpcy5jb25maWdWaWV3LmdldENhbmNlbCgpO1xuXG4gICAgY2xvc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXG4gICAgICB0aGlzLnVwZGF0ZUNvbmZpZygpO1xuICAgICAgdGhpcy5oaWRlKCk7XG5cbiAgICAgIGZvY3VzRWRpdG9yKCk7XG4gICAgfSk7XG5cbiAgICBjYW5jZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXG4gICAgICB0aGlzLmRlc3Ryb3lFZGl0b3JzKCk7XG4gICAgICB0aGlzLmhpZGUoKTtcblxuICAgICAgZm9jdXNFZGl0b3IoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG1lcmdlQ29uZmlnT2JqZWN0cyhvYmoxLCBvYmoyKSB7XG5cbiAgICByZXR1cm4gZGVlcEV4dGVuZCh7fSwgb2JqMSwgb2JqMik7XG4gIH1cblxuICBoaWRlKCkge1xuXG4gICAgaWYgKCF0aGlzLmNvbmZpZ1BhbmVsKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZ1BhbmVsLmhpZGUoKTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuXG4gICAgdGhpcy5oaWRlKCk7XG4gICAgdGhpcy5kZXN0cm95RWRpdG9ycygpO1xuICAgIHRoaXMuY29uZmlnID0gdW5kZWZpbmVkO1xuICAgIHRoaXMucHJvamVjdENvbmZpZyA9IHVuZGVmaW5lZDtcblxuICAgIGlmICghdGhpcy5jb25maWdWaWV3KSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZ1ZpZXcucmVtb3ZlQ29udGVudCgpO1xuICB9XG5cbiAgZ2F0aGVyRGF0YSgpIHtcblxuICAgIGNvbnN0IGNvbmZpZ0RlZmF1bHQgPSB0aGlzLmdldENvbnRlbnQoJy4uL2NvbmZpZy90ZXJuLWNvbmZpZy5qc29uJywgZmFsc2UpO1xuICAgIGNvbnN0IHBsdWdpbnNUZXJuID0gdGhpcy5nZXRDb250ZW50KCcuLi9jb25maWcvdGVybi1wbHVnaW5zLmpzb24nLCBmYWxzZSk7XG5cbiAgICBpZiAoIWNvbmZpZ0RlZmF1bHQpIHtcblxuICAgICAgY29uc29sZS5lcnJvcignQ291bGQgbm90IGxvYWQ6IHRlcm4tY29uZmlnLmpzb24nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnByb2plY3RDb25maWcgPSB0aGlzLmdldENvbnRlbnQoJy8udGVybi1wcm9qZWN0JywgdHJ1ZSk7XG4gICAgdGhpcy5jb25maWcgPSB0aGlzLnByb2plY3RDb25maWcgfHwge307XG5cbiAgICBpZiAoIXRoaXMucHJvamVjdENvbmZpZykge1xuXG4gICAgICB0aGlzLnByb2plY3RDb25maWcgPSB7fTtcbiAgICAgIHRoaXMuY29uZmlnID0gY2xvbmUoY29uZmlnRGVmYXVsdCk7XG4gICAgfVxuXG4gICAgdGhpcy5wcmVwYXJlRWNtYShjb25maWdEZWZhdWx0KTtcbiAgICB0aGlzLnByZXBhcmVMaWJzKGNvbmZpZ0RlZmF1bHQpO1xuICAgIHRoaXMucHJlcGFyZVBsdWdpbnMocGx1Z2luc1Rlcm4pO1xuXG4gICAgaWYgKCF0aGlzLmNvbmZpZy5sb2FkRWFnZXJseSkge1xuXG4gICAgICB0aGlzLmNvbmZpZy5sb2FkRWFnZXJseSA9IFtdO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5jb25maWcuZG9udExvYWQpIHtcblxuICAgICAgdGhpcy5jb25maWcuZG9udExvYWQgPSBbXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJlbW92ZUVkaXRvcihlZGl0b3IpIHtcblxuICAgIGlmICghZWRpdG9yKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgaWR4ID0gdGhpcy5lZGl0b3JzLmluZGV4T2YoZWRpdG9yKTtcblxuICAgIGlmIChpZHggPT09IC0xKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmVkaXRvcnMuc3BsaWNlKGlkeCwgMSk7XG4gIH1cblxuXG4gIGRlc3Ryb3lFZGl0b3JzKCkge1xuXG4gICAgZm9yIChsZXQgZWRpdG9yIG9mIHRoaXMuZWRpdG9ycykge1xuXG4gICAgICBsZXQgYnVmZmVyID0gZWRpdG9yLmdldE1vZGVsKCkuZ2V0QnVmZmVyKCk7XG4gICAgICBidWZmZXIuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHRoaXMuZWRpdG9ycyA9IFtdO1xuICB9XG5cbiAgdXBkYXRlQ29uZmlnKCkge1xuXG4gICAgdGhpcy5jb25maWcubG9hZEVhZ2VybHkgPSBbXTtcbiAgICB0aGlzLmNvbmZpZy5kb250TG9hZCA9IFtdO1xuXG4gICAgZm9yIChsZXQgZWRpdG9yIG9mIHRoaXMuZWRpdG9ycykge1xuXG4gICAgICBsZXQgYnVmZmVyID0gZWRpdG9yLmdldE1vZGVsKCkuZ2V0QnVmZmVyKCk7XG4gICAgICBsZXQgdGV4dCA9IGJ1ZmZlci5nZXRUZXh0KCkudHJpbSgpO1xuXG4gICAgICBpZiAodGV4dCA9PT0gJycpIHtcblxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jb25maWdbZWRpdG9yLl9fdGVybmpzX3NlY3Rpb25dLnB1c2godGV4dCk7XG4gICAgfVxuXG4gICAgdGhpcy5kZXN0cm95RWRpdG9ycygpO1xuXG4gICAgbGV0IG5ld0NvbmZpZyA9IHRoaXMuYnVpbGROZXdDb25maWcoKTtcbiAgICBsZXQgbmV3Q29uZmlnSlNPTiA9IEpTT04uc3RyaW5naWZ5KG5ld0NvbmZpZywgbnVsbCwgMik7XG5cbiAgICB1cGRhdGVUZXJuRmlsZShuZXdDb25maWdKU09OLCB0cnVlKTtcbiAgfVxuXG4gIGJ1aWxkTmV3Q29uZmlnKCkge1xuXG4gICAgbGV0IG5ld0NvbmZpZyA9IHt9O1xuXG4gICAgZm9yIChsZXQga2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLmVjbWFWZXJzaW9ucykpIHtcblxuICAgICAgaWYgKHRoaXMuY29uZmlnLmVjbWFWZXJzaW9uc1trZXldKSB7XG5cbiAgICAgICAgbmV3Q29uZmlnLmVjbWFWZXJzaW9uID0gTnVtYmVyKGtleVtrZXkubGVuZ3RoIC0gMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWlzRW1wdHkodGhpcy5jb25maWcubGlicykpIHtcblxuICAgICAgbmV3Q29uZmlnLmxpYnMgPSBbXTtcblxuICAgICAgZm9yIChsZXQga2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLmxpYnMpKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmxpYnNba2V5XS5fYWN0aXZlKSB7XG5cbiAgICAgICAgICBuZXdDb25maWcubGlicy5wdXNoKGtleSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb25maWcubG9hZEVhZ2VybHkubGVuZ3RoICE9PSAwKSB7XG5cbiAgICAgIG5ld0NvbmZpZy5sb2FkRWFnZXJseSA9IHRoaXMuY29uZmlnLmxvYWRFYWdlcmx5O1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbmZpZy5kb250TG9hZC5sZW5ndGggIT09IDApIHtcblxuICAgICAgbmV3Q29uZmlnLmRvbnRMb2FkID0gdGhpcy5jb25maWcuZG9udExvYWQ7XG4gICAgfVxuXG4gICAgaWYgKCFpc0VtcHR5KHRoaXMuY29uZmlnLnBsdWdpbnMpKSB7XG5cbiAgICAgIG5ld0NvbmZpZy5wbHVnaW5zID0ge307XG5cbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLnBsdWdpbnMpKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnBsdWdpbnNba2V5XS5fYWN0aXZlKSB7XG5cbiAgICAgICAgICBkZWxldGUgdGhpcy5jb25maWcucGx1Z2luc1trZXldLl9hY3RpdmU7XG4gICAgICAgICAgbmV3Q29uZmlnLnBsdWdpbnNba2V5XSA9IHRoaXMuY29uZmlnLnBsdWdpbnNba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXdDb25maWc7XG4gIH1cblxuICBpbml0Q29uZmlnVmlldygpIHtcblxuICAgIHRoaXMuY29uZmlnVmlldyA9IG5ldyBDb25maWdWaWV3KCk7XG4gICAgdGhpcy5jb25maWdWaWV3LmluaXRpYWxpemUodGhpcyk7XG5cbiAgICB0aGlzLmNvbmZpZ1BhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkUmlnaHRQYW5lbCh7XG5cbiAgICAgIGl0ZW06IHRoaXMuY29uZmlnVmlldyxcbiAgICAgIHByaW9yaXR5OiAwXG4gICAgfSk7XG4gICAgdGhpcy5jb25maWdQYW5lbC5oaWRlKCk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnRzKCk7XG4gIH1cblxuICBzaG93KCkge1xuXG4gICAgaWYgKCF0aGlzLmNvbmZpZ1ZpZXcpIHtcblxuICAgICAgdGhpcy5pbml0Q29uZmlnVmlldygpO1xuICAgIH1cblxuICAgIHRoaXMuY2xlYXIoKTtcblxuICAgIGlmICghdGhpcy5nYXRoZXJEYXRhKCkpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGF0b20udmlld3MuZ2V0Vmlldyh0aGlzLmNvbmZpZ1BhbmVsKS5jbGFzc0xpc3QuYWRkKCdhdG9tLXRlcm5qcy1jb25maWctcGFuZWwnKTtcblxuICAgIHRoaXMuY29uZmlnVmlldy5idWlsZE9wdGlvbnNNYXJrdXAoKTtcbiAgICB0aGlzLmNvbmZpZ1BhbmVsLnNob3coKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG5cbiAgICBkaXNwb3NlQWxsKHRoaXMuZGlzcG9zYWJsZXMpO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnVmlldykge1xuXG4gICAgICB0aGlzLmNvbmZpZ1ZpZXcuZGVzdHJveSgpO1xuICAgIH1cbiAgICB0aGlzLmNvbmZpZ1ZpZXcgPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAodGhpcy5jb25maWdQYW5lbCkge1xuXG4gICAgICB0aGlzLmNvbmZpZ1BhbmVsLmRlc3Ryb3koKTtcbiAgICB9XG4gICAgdGhpcy5jb25maWdQYW5lbCA9IHVuZGVmaW5lZDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgQ29uZmlnKCk7XG4iXX0=
//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/atom-ternjs/lib/atom-ternjs-config.js
