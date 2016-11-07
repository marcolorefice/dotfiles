(function() {
  var CompositeDisposable, changeCase, chokidar, fs, path, treeIsInstalled, treeMatch;

  path = require('path');

  fs = require('fs-plus');

  chokidar = require('chokidar');

  treeMatch = require('tree-match-sync');

  CompositeDisposable = require('atom').CompositeDisposable;

  treeIsInstalled = treeMatch.treeIsInstalled();

  changeCase = require('change-case');

  module.exports = {
    toolBar: null,
    configFilePath: null,
    currentGrammar: null,
    currentProject: null,
    buttonTypes: [],
    watchList: [],
    config: {
      toolBarConfigurationFilePath: {
        type: 'string',
        "default": ''
      },
      reloadToolBarWhenEditConfigFile: {
        type: 'boolean',
        "default": true
      },
      useBrowserPlusWhenItIsActive: {
        type: 'boolean',
        "default": false
      }
    },
    activate: function() {
      require('atom-package-deps').install('flex-tool-bar');
      if (!this.resolveConfigPath()) {
        return;
      }
      this.subscriptions = new CompositeDisposable;
      this.watcherList = [];
      this.resolveProjectConfigPath();
      this.storeProject();
      this.storeGrammar();
      this.registerTypes();
      this.registerCommand();
      this.registerEvent();
      this.registerWatch();
      this.registerProjectWatch();
      return this.reloadToolbar(false);
    },
    resolveConfigPath: function() {
      var defaultConfig, err;
      this.configFilePath = atom.config.get('flex-tool-bar.toolBarConfigurationFilePath');
      if (!this.configFilePath) {
        this.configFilePath = process.env.ATOM_HOME;
      }
      if (!fs.isFileSync(this.configFilePath)) {
        this.configFilePath = fs.resolve(this.configFilePath, 'toolbar', ['cson', 'json5', 'json']);
      }
      if (this.configFilePath) {
        return true;
      }
      if (!this.configFilePath) {
        this.configFilePath = path.join(process.env.ATOM_HOME, 'toolbar.cson');
        defaultConfig = '# This file is used by Flex Tool Bar to create buttons on your Tool Bar.\n# For more information how to use this package and create your own buttons,\n#   read the documentation on https://atom.io/packages/flex-tool-bar\n\n[\n  {\n    type: "button"\n    icon: "gear"\n    callback: "flex-tool-bar:edit-config-file"\n    tooltip: "Edit Tool Bar"\n  }\n  {\n    type: "spacer"\n  }\n]';
        try {
          fs.writeFileSync(this.configFilePath, defaultConfig);
          atom.notifications.addInfo('We created a Tool Bar config file for you...', {
            detail: this.configFilePath
          });
          return true;
        } catch (_error) {
          err = _error;
          this.configFilePath = null;
          atom.notifications.addError('Something went wrong creating the Tool Bar config file! Please restart Atom to try again.');
          console.error(err);
          return false;
        }
      }
    },
    resolveProjectConfigPath: function() {
      var count, editor, pathToCheck, projectCount, _ref, _ref1, _ref2;
      this.projectToolbarConfigPath = null;
      editor = atom.workspace.getActiveTextEditor();
      if ((editor != null ? (_ref = editor.buffer) != null ? (_ref1 = _ref.file) != null ? (_ref2 = _ref1.getParent()) != null ? _ref2.path : void 0 : void 0 : void 0 : void 0) != null) {
        projectCount = atom.project.getPaths().length;
        count = 0;
        while (count < projectCount) {
          pathToCheck = atom.project.getPaths()[count];
          if (editor.buffer.file.getParent().path.includes(pathToCheck)) {
            this.projectToolbarConfigPath = fs.resolve(pathToCheck, 'toolbar', ['cson', 'json5', 'json']);
          }
          count++;
        }
      }
      if (this.projectToolbarConfigPath === this.configFilePath) {
        this.projectToolbarConfigPath = null;
      }
      if (this.projectToolbarConfigPath) {
        return true;
      }
    },
    registerCommand: function() {
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'flex-tool-bar:edit-config-file': (function(_this) {
          return function() {
            if (_this.configFilePath) {
              return atom.workspace.open(_this.configFilePath);
            }
          };
        })(this)
      }));
    },
    registerEvent: function() {
      return this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(item) {
          if (_this.didChangeGrammar()) {
            _this.storeGrammar();
            _this.reloadToolbar();
            return;
          }
          if (_this.storeProject()) {
            _this.switchProject();
          }
        };
      })(this)));
    },
    registerWatch: function() {
      var watcher;
      if (atom.config.get('flex-tool-bar.reloadToolBarWhenEditConfigFile')) {
        watcher = chokidar.watch(this.configFilePath).on('change', (function(_this) {
          return function() {
            return _this.reloadToolbar(true);
          };
        })(this));
        return this.watcherList.push(watcher);
      }
    },
    registerProjectWatch: function() {
      var watcher;
      if (this.projectToolbarConfigPath && this.watchList.indexOf(this.projectToolbarConfigPath) < 0) {
        this.watchList.push(this.projectToolbarConfigPath);
        watcher = chokidar.watch(this.projectToolbarConfigPath).on('change', (function(_this) {
          return function(event, filename) {
            return _this.reloadToolbar(true);
          };
        })(this));
        return this.watcherList.push(watcher);
      }
    },
    switchProject: function() {
      this.resolveProjectConfigPath();
      this.registerProjectWatch();
      return this.reloadToolbar(false);
    },
    registerTypes: function() {
      var typeFiles;
      typeFiles = fs.listSync(path.join(__dirname, '../types'));
      return typeFiles.forEach((function(_this) {
        return function(typeFile) {
          var typeName;
          typeName = path.basename(typeFile, '.coffee');
          return _this.buttonTypes[typeName] = require(typeFile);
        };
      })(this));
    },
    consumeToolBar: function(toolBar) {
      this.toolBar = toolBar('flex-toolBar');
      return this.reloadToolbar(false);
    },
    reloadToolbar: function(withNotification) {
      var error, toolBarButtons;
      if (withNotification == null) {
        withNotification = false;
      }
      if (this.toolBar == null) {
        return;
      }
      try {
        this.fixToolBarHeight();
        toolBarButtons = this.loadConfig();
        this.removeButtons();
        this.addButtons(toolBarButtons);
        if (withNotification) {
          atom.notifications.addSuccess('The tool-bar was successfully updated.');
        }
        return this.unfixToolBarHeight();
      } catch (_error) {
        error = _error;
        this.unfixToolBarHeight();
        atom.notifications.addError('Your `toolbar.json` is **not valid JSON**!');
        return console.error(error);
      }
    },
    fixToolBarHeight: function() {
      return this.toolBar.toolBar.element.style.height = "" + this.toolBar.toolBar.element.offsetHeight + "px";
    },
    unfixToolBarHeight: function() {
      return this.toolBar.toolBar.element.style.height = null;
    },
    addButtons: function(toolBarButtons) {
      var btn, button, devMode, propName, v, _i, _len, _ref, _results;
      if (toolBarButtons != null) {
        devMode = atom.inDevMode();
        _results = [];
        for (_i = 0, _len = toolBarButtons.length; _i < _len; _i++) {
          btn = toolBarButtons[_i];
          if (((btn.hide != null) && this.grammarCondition(btn.hide)) || ((btn.show != null) && !this.grammarCondition(btn.show))) {
            continue;
          }
          if (btn.mode && btn.mode === 'dev' && !devMode) {
            continue;
          }
          if (this.buttonTypes[btn.type]) {
            button = this.buttonTypes[btn.type](this.toolBar, btn);
          }
          if (btn.mode) {
            button.element.classList.add("tool-bar-mode-" + btn.mode);
          }
          if (btn.style != null) {
            _ref = btn.style;
            for (propName in _ref) {
              v = _ref[propName];
              button.element.style[changeCase.camelCase(propName)] = v;
            }
          }
          if (((btn.disable != null) && this.grammarCondition(btn.disable)) || ((btn.enable != null) && !this.grammarCondition(btn.enable))) {
            _results.push(button.setEnabled(false));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    },
    loadConfig: function() {
      var CSON, config, ext, i, projConfig;
      ext = path.extname(this.configFilePath);
      switch (ext) {
        case '.json':
          config = require(this.configFilePath);
          delete require.cache[this.configFilePath];
          break;
        case '.json5':
          require('json5/lib/require');
          config = require(this.configFilePath);
          delete require.cache[this.configFilePath];
          break;
        case '.cson':
          CSON = require('cson');
          config = CSON.requireCSONFile(this.configFilePath);
      }
      if (this.projectToolbarConfigPath) {
        ext = path.extname(this.projectToolbarConfigPath);
        switch (ext) {
          case '.json':
            projConfig = require(this.projectToolbarConfigPath);
            delete require.cache[this.projectToolbarConfigPath];
            break;
          case '.json5':
            require('json5/lib/require');
            projConfig = require(this.projectToolbarConfigPath);
            delete require.cache[this.projectToolbarConfigPath];
            break;
          case '.cson':
            CSON = require('cson');
            projConfig = CSON.requireCSONFile(this.projectToolbarConfigPath);
        }
        for (i in projConfig) {
          config.push(projConfig[i]);
        }
      }
      return config;
    },
    getActiveProject: function() {
      var activePanePath, projectPath, projectsPath, _i, _len;
      activePanePath = atom.workspace.getActiveTextEditor().getPath();
      projectsPath = atom.project.getPaths();
      for (_i = 0, _len = projectsPath.length; _i < _len; _i++) {
        projectPath = projectsPath[_i];
        if (activePanePath.replace(projectPath, '') !== activePanePath) {
          return projectPath;
        }
      }
      return activePanePath.replace(/[^\/]+\.(.*?)$/, '');
    },
    grammarCondition: function(grammars) {
      var activePath, filePath, grammar, grammarType, options, result, reverse, tree, _i, _len, _ref, _ref1;
      result = false;
      grammarType = Object.prototype.toString.call(grammars);
      if (grammarType === '[object String]' || grammarType === '[object Object]') {
        grammars = [grammars];
      }
      filePath = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0;
      for (_i = 0, _len = grammars.length; _i < _len; _i++) {
        grammar = grammars[_i];
        reverse = false;
        if (Object.prototype.toString.call(grammar) === '[object Object]') {
          if (!treeIsInstalled) {
            atom.notifications.addError('[Tree](http://mama.indstate.edu/users/ice/tree/) is not installed, please install it.');
            continue;
          }
          if (filePath === void 0) {
            continue;
          }
          activePath = this.getActiveProject();
          options = grammar.options ? grammar.options : {};
          tree = treeMatch(activePath, grammar.pattern, options);
          if (Object.prototype.toString.call(tree) === '[object Array]' && tree.length > 0) {
            return true;
          }
        } else {
          if (/^!/.test(grammar)) {
            grammar = grammar.replace('!', '');
            reverse = true;
          }
          if (/^[^\/]+\.(.*?)$/.test(grammar)) {
            if (filePath !== void 0 && ((_ref1 = filePath.match(grammar)) != null ? _ref1.length : void 0) > 0) {
              result = true;
            }
          } else {
            if ((this.currentGrammar != null) && this.currentGrammar.includes(grammar.toLowerCase())) {
              result = true;
            }
          }
        }
        if (reverse) {
          result = !result;
        }
        if (result === true) {
          return true;
        }
      }
      return false;
    },
    storeProject: function() {
      var editor, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
      editor = atom.workspace.getActiveTextEditor();
      if (editor && ((editor != null ? (_ref = editor.buffer) != null ? (_ref1 = _ref.file) != null ? (_ref2 = _ref1.getParent()) != null ? _ref2.path : void 0 : void 0 : void 0 : void 0) != null) !== this.currentProject) {
        if ((editor != null ? (_ref3 = editor.buffer) != null ? (_ref4 = _ref3.file) != null ? (_ref5 = _ref4.getParent()) != null ? _ref5.path : void 0 : void 0 : void 0 : void 0) != null) {
          this.currentProject = editor.buffer.file.getParent().path;
        }
        return true;
      } else {
        return false;
      }
    },
    storeGrammar: function() {
      var editor, _ref;
      editor = atom.workspace.getActiveTextEditor();
      return this.currentGrammar = editor != null ? (_ref = editor.getGrammar()) != null ? _ref.name.toLowerCase() : void 0 : void 0;
    },
    didChangeGrammar: function() {
      var editor;
      editor = atom.workspace.getActiveTextEditor();
      return editor && editor.getGrammar().name.toLowerCase() !== this.currentGrammar;
    },
    removeButtons: function() {
      if (this.toolBar != null) {
        return this.toolBar.removeItems();
      }
    },
    deactivate: function() {
      this.watcherList.forEach(function(watcher) {
        return watcher.close();
      });
      this.watcherList = null;
      this.subscriptions.dispose();
      this.subscriptions = null;
      return this.removeButtons();
    },
    serialize: function() {}
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc3RlZmFuby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2ZsZXgtdG9vbC1iYXIvbGliL2ZsZXgtdG9vbC1iYXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtFQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFVBQVIsQ0FGWCxDQUFBOztBQUFBLEVBR0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxpQkFBUixDQUhaLENBQUE7O0FBQUEsRUFJRSxzQkFBd0IsT0FBQSxDQUFRLE1BQVIsRUFBeEIsbUJBSkYsQ0FBQTs7QUFBQSxFQUtBLGVBQUEsR0FBa0IsU0FBUyxDQUFDLGVBQVYsQ0FBQSxDQUxsQixDQUFBOztBQUFBLEVBTUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxhQUFSLENBTmIsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE9BQUEsRUFBUyxJQUFUO0FBQUEsSUFDQSxjQUFBLEVBQWdCLElBRGhCO0FBQUEsSUFFQSxjQUFBLEVBQWdCLElBRmhCO0FBQUEsSUFHQSxjQUFBLEVBQWdCLElBSGhCO0FBQUEsSUFJQSxXQUFBLEVBQWEsRUFKYjtBQUFBLElBS0EsU0FBQSxFQUFXLEVBTFg7QUFBQSxJQU9BLE1BQUEsRUFDRTtBQUFBLE1BQUEsNEJBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxFQURUO09BREY7QUFBQSxNQUdBLCtCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFE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

//# sourceURL=/home/stefano/.dotfiles/atom.symlink/packages/flex-tool-bar/lib/flex-tool-bar.coffee
