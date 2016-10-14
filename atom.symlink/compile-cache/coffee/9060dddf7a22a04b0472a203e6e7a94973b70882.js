(function() {
  var CompositeDisposable, Emitter, ListView, TermView, Terminals, capitalize, config, getColors, keypather, path;

  path = require('path');

  TermView = require('./lib/term-view');

  ListView = require('./lib/build/list-view');

  Terminals = require('./lib/terminal-model');

  Emitter = require('event-kit').Emitter;

  keypather = require('keypather')();

  CompositeDisposable = require('event-kit').CompositeDisposable;

  capitalize = function(str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
  };

  getColors = function() {
    var background, brightBlack, brightBlue, brightCyan, brightGreen, brightPurple, brightRed, brightWhite, brightYellow, foreground, normalBlack, normalBlue, normalCyan, normalGreen, normalPurple, normalRed, normalWhite, normalYellow, _ref;
    _ref = (atom.config.getAll('term3.colors'))[0].value, normalBlack = _ref.normalBlack, normalRed = _ref.normalRed, normalGreen = _ref.normalGreen, normalYellow = _ref.normalYellow, normalBlue = _ref.normalBlue, normalPurple = _ref.normalPurple, normalCyan = _ref.normalCyan, normalWhite = _ref.normalWhite, brightBlack = _ref.brightBlack, brightRed = _ref.brightRed, brightGreen = _ref.brightGreen, brightYellow = _ref.brightYellow, brightBlue = _ref.brightBlue, brightPurple = _ref.brightPurple, brightCyan = _ref.brightCyan, brightWhite = _ref.brightWhite, background = _ref.background, foreground = _ref.foreground;
    return [normalBlack, normalRed, normalGreen, normalYellow, normalBlue, normalPurple, normalCyan, normalWhite, brightBlack, brightRed, brightGreen, brightYellow, brightBlue, brightPurple, brightCyan, brightWhite, background, foreground].map(function(color) {
      return color.toHexString();
    });
  };

  config = {
    autoRunCommand: {
      type: 'string',
      "default": ''
    },
    titleTemplate: {
      type: 'string',
      "default": "Terminal ({{ bashName }})"
    },
    fontFamily: {
      type: 'string',
      "default": ''
    },
    fontSize: {
      type: 'string',
      "default": ''
    },
    colors: {
      type: 'object',
      properties: {
        normalBlack: {
          type: 'color',
          "default": '#2e3436'
        },
        normalRed: {
          type: 'color',
          "default": '#cc0000'
        },
        normalGreen: {
          type: 'color',
          "default": '#4e9a06'
        },
        normalYellow: {
          type: 'color',
          "default": '#c4a000'
        },
        normalBlue: {
          type: 'color',
          "default": '#3465a4'
        },
        normalPurple: {
          type: 'color',
          "default": '#75507b'
        },
        normalCyan: {
          type: 'color',
          "default": '#06989a'
        },
        normalWhite: {
          type: 'color',
          "default": '#d3d7cf'
        },
        brightBlack: {
          type: 'color',
          "default": '#555753'
        },
        brightRed: {
          type: 'color',
          "default": '#ef2929'
        },
        brightGreen: {
          type: 'color',
          "default": '#8ae234'
        },
        brightYellow: {
          type: 'color',
          "default": '#fce94f'
        },
        brightBlue: {
          type: 'color',
          "default": '#729fcf'
        },
        brightPurple: {
          type: 'color',
          "default": '#ad7fa8'
        },
        brightCyan: {
          type: 'color',
          "default": '#34e2e2'
        },
        brightWhite: {
          type: 'color',
          "default": '#eeeeec'
        },
        background: {
          type: 'color',
          "default": '#000000'
        },
        foreground: {
          type: 'color',
          "default": '#f0f0f0'
        }
      }
    },
    scrollback: {
      type: 'integer',
      "default": 1000
    },
    cursorBlink: {
      type: 'boolean',
      "default": true
    },
    shellOverride: {
      type: 'string',
      "default": ''
    },
    shellArguments: {
      type: 'string',
      "default": (function(_arg) {
        var HOME, SHELL;
        SHELL = _arg.SHELL, HOME = _arg.HOME;
        switch (path.basename(SHELL && SHELL.toLowerCase())) {
          case 'bash':
            return "--init-file " + (path.join(HOME, '.bash_profile'));
          case 'zsh':
            return "-l";
          default:
            return '';
        }
      })(process.env)
    },
    openPanesInSameSplit: {
      type: 'boolean',
      "default": false
    }
  };

  module.exports = {
    termViews: [],
    focusedTerminal: false,
    emitter: new Emitter(),
    config: config,
    disposables: null,
    activate: function(state) {
      this.state = state;
      this.disposables = new CompositeDisposable();
      if (!process.env.LANG) {
        console.warn("Term3: LANG environment variable is not set. Fancy characters (å, ñ, ó, etc`) may be corrupted. The only work-around is to quit Atom and run `atom` from your shell.");
      }
      ['up', 'right', 'down', 'left'].forEach((function(_this) {
        return function(direction) {
          return _this.disposables.add(atom.commands.add("atom-workspace", "term3:open-split-" + direction, _this.splitTerm.bind(_this, direction)));
        };
      })(this));
      this.disposables.add(atom.commands.add("atom-workspace", "term3:open", this.newTerm.bind(this)));
      this.disposables.add(atom.commands.add("atom-workspace", "term3:pipe-path", this.pipeTerm.bind(this, 'path')));
      this.disposables.add(atom.commands.add("atom-workspace", "term3:pipe-selection", this.pipeTerm.bind(this, 'selection')));
      return atom.packages.activatePackage('tree-view').then((function(_this) {
        return function(treeViewPkg) {
          var node;
          node = new ListView();
          return treeViewPkg.mainModule.treeView.find(".tree-view-scroller").prepend(node);
        };
      })(this));
    },
    service_0_1_3: function() {
      return {
        getTerminals: this.getTerminals.bind(this),
        onTerm: this.onTerm.bind(this),
        newTerm: this.newTerm.bind(this)
      };
    },
    getTerminals: function() {
      return Terminals.map(function(t) {
        return t.term;
      });
    },
    onTerm: function(callback) {
      return this.emitter.on('term', callback);
    },
    attachSubscriptions: function(termView, item, pane) {
      var focusNextTick, subscriptions;
      subscriptions = new CompositeDisposable;
      focusNextTick = function(activeItem) {
        return process.nextTick(function() {
          var atomPane;
          termView.focus();
          atomPane = activeItem.parentsUntil("atom-pane").parent()[0];
          if (termView.term) {
            return termView.term.constructor._textarea = atomPane;
          }
        });
      };
      subscriptions.add(pane.onDidActivate(function() {
        var activeItem;
        activeItem = pane.getActiveItem();
        if (activeItem !== item) {
          return;
        }
        this.focusedTerminal = termView;
        termView.focus();
        return focusNextTick(activeItem);
      }));
      subscriptions.add(pane.onDidChangeActiveItem(function(activeItem) {
        if (activeItem !== termView) {
          if (termView.term) {
            termView.term.constructor._textarea = null;
          }
          return;
        }
        return focusNextTick(activeItem);
      }));
      subscriptions.add(termView.onExit(function() {
        return Terminals.remove(termView.id);
      }));
      subscriptions.add(pane.onWillRemoveItem((function(_this) {
        return function(itemRemoved, index) {
          if (itemRemoved.item === item) {
            item.destroy();
            Terminals.remove(termView.id);
            _this.disposables.remove(subscriptions);
            return subscriptions.dispose();
          }
        };
      })(this)));
      return subscriptions;
    },
    newTerm: function(forkPTY, rows, cols, title) {
      var item, pane, termView;
      if (forkPTY == null) {
        forkPTY = true;
      }
      if (rows == null) {
        rows = 30;
      }
      if (cols == null) {
        cols = 80;
      }
      if (title == null) {
        title = 'tty';
      }
      termView = this.createTermView(forkPTY, rows, cols, title);
      pane = atom.workspace.getActivePane();
      item = pane.addItem(termView);
      this.disposables.add(this.attachSubscriptions(termView, item, pane));
      pane.activateItem(item);
      return termView;
    },
    createTermView: function(forkPTY, rows, cols, title) {
      var editorPath, id, model, opts, termView, _base;
      if (forkPTY == null) {
        forkPTY = true;
      }
      if (rows == null) {
        rows = 30;
      }
      if (cols == null) {
        cols = 80;
      }
      if (title == null) {
        title = 'tty';
      }
      opts = {
        runCommand: atom.config.get('term3.autoRunCommand'),
        shellOverride: atom.config.get('term3.shellOverride'),
        shellArguments: atom.config.get('term3.shellArguments'),
        titleTemplate: atom.config.get('term3.titleTemplate'),
        cursorBlink: atom.config.get('term3.cursorBlink'),
        fontFamily: atom.config.get('term3.fontFamily'),
        fontSize: atom.config.get('term3.fontSize'),
        colors: getColors(),
        forkPTY: forkPTY,
        rows: rows,
        cols: cols
      };
      if (opts.shellOverride) {
        opts.shell = opts.shellOverride;
      } else {
        opts.shell = process.env.SHELL || 'bash';
      }
      editorPath = keypather.get(atom, 'workspace.getEditorViews[0].getEditor().getPath()');
      opts.cwd = opts.cwd || atom.project.getPaths()[0] || editorPath || process.env.HOME;
      termView = new TermView(opts);
      model = Terminals.add({
        local: !!forkPTY,
        term: termView,
        title: title
      });
      id = model.id;
      termView.id = id;
      termView.on('remove', this.handleRemoveTerm.bind(this));
      termView.on('click', (function(_this) {
        return function() {
          termView.term.element.focus();
          termView.term.focus();
          return _this.focusedTerminal = termView;
        };
      })(this));
      termView.onDidChangeTitle(function() {
        if (forkPTY) {
          return model.title = termView.getTitle();
        } else {
          return model.title = title + '-' + termView.getTitle();
        }
      });
      if (typeof (_base = this.termViews).push === "function") {
        _base.push(termView);
      }
      process.nextTick((function(_this) {
        return function() {
          return _this.emitter.emit('term', termView);
        };
      })(this));
      return termView;
    },
    splitTerm: function(direction) {
      var activePane, item, openPanesInSameSplit, pane, splitter, termView;
      openPanesInSameSplit = atom.config.get('term3.openPanesInSameSplit');
      termView = this.createTermView();
      direction = capitalize(direction);
      splitter = (function(_this) {
        return function() {
          var pane;
          pane = activePane["split" + direction]({
            items: [termView]
          });
          activePane.termSplits[direction] = pane;
          _this.focusedTerminal = [pane, pane.items[0]];
          return _this.disposables.add(_this.attachSubscriptions(termView, pane.items[0], pane));
        };
      })(this);
      activePane = atom.workspace.getActivePane();
      activePane.termSplits || (activePane.termSplits = {});
      if (openPanesInSameSplit) {
        if (activePane.termSplits[direction] && activePane.termSplits[direction].items.length > 0) {
          pane = activePane.termSplits[direction];
          item = pane.addItem(termView);
          pane.activateItem(item);
          this.focusedTerminal = [pane, item];
          return this.disposables.add(this.attachSubscriptions(termView, item, pane));
        } else {
          return splitter();
        }
      } else {
        return splitter();
      }
    },
    pipeTerm: function(action) {
      var editor, item, pane, stream, _ref;
      editor = atom.workspace.getActiveTextEditor();
      if (!editor) {
        return;
      }
      stream = (function() {
        switch (action) {
          case 'path':
            return editor.getBuffer().file.path;
          case 'selection':
            return editor.getSelectedText();
        }
      })();
      if (stream && this.focusedTerminal) {
        if (Array.isArray(this.focusedTerminal)) {
          _ref = this.focusedTerminal, pane = _ref[0], item = _ref[1];
          pane.activateItem(item);
        } else {
          item = this.focusedTerminal;
        }
        item.pty.write(stream.trim());
        return item.term.focus();
      }
    },
    handleRemoveTerm: function(termView) {
      return this.termViews.splice(this.termViews.indexOf(termView), 1);
    },
    deactivate: function() {
      this.termViews.forEach(function(view) {
        return view.exit();
      });
      this.termViews = [];
      return this.disposables.dispose;
    },
    serialize: function() {
      var termViewsState;
      termViewsState = this.termViews.map(function(view) {
        return view.serialize();
      });
      return {
        termViews: termViewsState
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL240ejQvLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy90ZXJtMy9pbmRleC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMkdBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxpQkFBUixDQURYLENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsT0FBQSxDQUFRLHVCQUFSLENBRlgsQ0FBQTs7QUFBQSxFQUdBLFNBQUEsR0FBWSxPQUFBLENBQVEsc0JBQVIsQ0FIWixDQUFBOztBQUFBLEVBSUMsVUFBWSxPQUFBLENBQVEsV0FBUixFQUFaLE9BSkQsQ0FBQTs7QUFBQSxFQUtBLFNBQUEsR0FBZ0IsT0FBQSxDQUFRLFdBQVIsQ0FBSCxDQUFBLENBTGIsQ0FBQTs7QUFBQSxFQU1DLHNCQUF1QixPQUFBLENBQVEsV0FBUixFQUF2QixtQkFORCxDQUFBOztBQUFBLEVBUUEsVUFBQSxHQUFhLFNBQUMsR0FBRCxHQUFBO1dBQVEsR0FBSSxDQUFBLENBQUEsQ0FBRSxDQUFDLFdBQVAsQ0FBQSxDQUFBLEdBQXVCLEdBQUksU0FBSSxDQUFDLFdBQVQsQ0FBQSxFQUEvQjtFQUFBLENBUmIsQ0FBQTs7QUFBQSxFQVVBLFNBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixRQUFBLHdPQUFBO0FBQUEsSUFBQSxPQU1JLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFaLENBQW1CLGNBQW5CLENBQUQsQ0FBb0MsQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQU4zQyxFQUNFLG1CQUFBLFdBREYsRUFDZSxpQkFBQSxTQURmLEVBQzBCLG1CQUFBLFdBRDFCLEVBQ3VDLG9CQUFBLFlBRHZDLEVBRUUsa0JBQUEsVUFGRixFQUVjLG9CQUFB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

//# sourceURL=/Users/n4z4/.dotfiles/atom.symlink/packages/term3/index.coffee
