(function() {
  "use strict";
  var $, Beautifiers, CompositeDisposable, LoadingView, Promise, async, beautifier, beautify, beautifyDirectory, beautifyFile, beautifyFilePath, debug, defaultLanguageOptions, dir, fs, getCursors, getScrollTop, getUnsupportedOptions, handleSaveEvent, loadingView, logger, path, pkg, plugin, setCursors, setScrollTop, showError, strip, yaml, _;

  pkg = require('../package.json');

  plugin = module.exports;

  CompositeDisposable = require('event-kit').CompositeDisposable;

  _ = require("lodash");

  Beautifiers = require("./beautifiers");

  beautifier = new Beautifiers();

  defaultLanguageOptions = beautifier.options;

  logger = require('./logger')(__filename);

  Promise = require('bluebird');

  fs = null;

  path = require("path");

  strip = null;

  yaml = null;

  async = null;

  dir = null;

  LoadingView = null;

  loadingView = null;

  $ = null;

  getScrollTop = function(editor) {
    var view;
    view = atom.views.getView(editor);
    return view != null ? view.getScrollTop() : void 0;
  };

  setScrollTop = function(editor, value) {
    var view;
    view = atom.views.getView(editor);
    return view != null ? view.setScrollTop(value) : void 0;
  };

  getCursors = function(editor) {
    var bufferPosition, cursor, cursors, posArray, _i, _len;
    cursors = editor.getCursors();
    posArray = [];
    for (_i = 0, _len = cursors.length; _i < _len; _i++) {
      cursor = cursors[_i];
      bufferPosition = cursor.getBufferPosition();
      posArray.push([bufferPosition.row, bufferPosition.column]);
    }
    return posArray;
  };

  setCursors = function(editor, posArray) {
    var bufferPosition, i, _i, _len;
    for (i = _i = 0, _len = posArray.length; _i < _len; i = ++_i) {
      bufferPosition = posArray[i];
      if (i === 0) {
        editor.setCursorBufferPosition(bufferPosition);
        continue;
      }
      editor.addCursorAtBufferPosition(bufferPosition);
    }
  };

  beautifier.on('beautify::start', function() {
    if (LoadingView == null) {
      LoadingView = require("./views/loading-view");
    }
    if (loadingView == null) {
      loadingView = new LoadingView();
    }
    return loadingView.show();
  });

  beautifier.on('beautify::end', function() {
    return loadingView != null ? loadingView.hide() : void 0;
  });

  showError = function(error) {
    var detail, stack, _ref;
    if (!atom.config.get("atom-beautify.general.muteAllErrors")) {
      stack = error.stack;
      detail = error.description || error.message;
      return (_ref = atom.notifications) != null ? _ref.addError(error.message, {
        stack: stack,
        detail: detail,
        dismissable: true
      }) : void 0;
    }
  };

  beautify = function(_arg) {
    var editor, onSave;
    editor = _arg.editor, onSave = _arg.onSave;
    return new Promise(function(resolve, reject) {
      var allOptions, beautifyCompleted, e, editedFilePath, forceEntireFile, grammarName, isSelection, oldText, text;
      plugin.checkUnsupportedOptions();
      if (path == null) {
        path = require("path");
      }
      forceEntireFile = onSave && atom.config.get("atom-beautify.general.beautifyEntireFileOnSave");
      beautifyCompleted = function(text) {
        var error, origScrollTop, posArray, selectedBufferRange;
        if (text == null) {

        } else if (text instanceof Error) {
          showError(text);
          return reject(text);
        } else if (typeof text === "string") {
          if (oldText !== text) {
            posArray = getCursors(editor);
            origScrollTop = getScrollTop(editor);
            if (!forceEntireFile && isSelection) {
              selectedBufferRange = editor.getSelectedBufferRange();
              editor.setTextInBufferRange(selectedBufferRange, text);
            } else {
              editor.setText(text);
            }
            setCursors(editor, posArray);
            setTimeout((function() {
              setScrollTop(editor, origScrollTop);
              return resolve(text);
            }), 0);
          }
        } else {
          error = new Error("Unsupported beautification result '" + text + "'.");
          showError(error);
          return reject(error);
        }
      };
      editor = editor != null ? editor : atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return showError(new Error("Active Editor not found. ", "Please select a Text Editor first to beautify."));
      }
      isSelection = !!editor.getSelectedText();
      editedFilePath = editor.getPath();
      allOptions = beautifier.getOptionsForPath(editedFilePath, editor);
      text = void 0;
      if (!forceEntireFile && isSelection) {
        text = editor.getSelectedText();
      } else {
        text = editor.getText();
      }
      oldText = text;
      grammarName = editor.getGrammar().name;
      try {
        beautifier.beautify(text, allOptions, grammarName, editedFilePath, {
          onSave: onSave
        }).then(beautifyCompleted)["catch"](beautifyCompleted);
      } catch (_error) {
        e = _error;
        showError(e);
      }
    });
  };

  beautifyFilePath = function(filePath, callback) {
    var $el, cb;
    logger.verbose('beautifyFilePath', filePath);
    if ($ == null) {
      $ = require("atom-space-pen-views").$;
    }
    $el = $(".icon-file-text[data-path=\"" + filePath + "\"]");
    $el.addClass('beautifying');
    cb = function(err, result) {
      logger.verbose('Cleanup beautifyFilePath', err, result);
      $el = $(".icon-file-text[data-path=\"" + filePath + "\"]");
      $el.removeClass('beautifying');
      return callback(err, result);
    };
    if (fs == null) {
      fs = require("fs");
    }
    logger.verbose('readFile', filePath);
    return fs.readFile(filePath, function(err, data) {
      var allOptions, completionFun, e, grammar, grammarName, input;
      logger.verbose('readFile completed', err, filePath);
      if (err) {
        return cb(err);
      }
      input = data != null ? data.toString() : void 0;
      grammar = atom.grammars.selectGrammar(filePath, input);
      grammarName = grammar.name;
      allOptions = beautifier.getOptionsForPath(filePath);
      logger.verbose('beautifyFilePath allOptions', allOptions);
      completionFun = function(output) {
        logger.verbose('beautifyFilePath completionFun', output);
        if (output instanceof Error) {
          return cb(output, null);
        } else if (typeof output === "string") {
          if (output.trim() === '') {
            logger.verbose('beautifyFilePath, output was empty string!');
            return cb(null, output);
          }
          return fs.writeFile(filePath, output, function(err) {
            if (err) {
              return cb(err);
            }
            return cb(null, output);
          });
        } else {
          return cb(new Error("Unknown beautification result " + output + "."), output);
        }
      };
      try {
        logger.verbose('beautify', input, allOptions, grammarName, filePath);
        return beautifier.beautify(input, allOptions, grammarName, filePath).then(completionFun)["catch"](completionFun);
      } catch (_error) {
        e = _error;
        return cb(e);
      }
    });
  };

  beautifyFile = function(_arg) {
    var filePath, target;
    target = _arg.target;
    filePath = target.dataset.path;
    if (!filePath) {
      return;
    }
    beautifyFilePath(filePath, function(err, result) {
      if (err) {
        return showError(err);
      }
    });
  };

  beautifyDirectory = function(_arg) {
    var $el, dirPath, target;
    target = _arg.target;
    dirPath = target.dataset.path;
    if (!dirPath) {
      return;
    }
    if ((typeof atom !== "undefined" && atom !== null ? atom.confirm({
      message: "This will beautify all of the files found recursively in this directory, '" + dirPath + "'. Do you want to continue?",
      buttons: ['Yes, continue!', 'No, cancel!']
    }) : void 0) !== 0) {
      return;
    }
    if ($ == null) {
      $ = require("atom-space-pen-views").$;
    }
    $el = $(".icon-file-directory[data-path=\"" + dirPath + "\"]");
    $el.addClass('beautifying');
    if (dir == null) {
      dir = require("node-dir");
    }
    if (async == null) {
      async = require("async");
    }
    dir.files(dirPath, function(err, files) {
      if (err) {
        return showError(err);
      }
      return async.each(files, function(filePath, callback) {
        return beautifyFilePath(filePath, function() {
          return callback();
        });
      }, function(err) {
        $el = $(".icon-file-directory[data-path=\"" + dirPath + "\"]");
        return $el.removeClass('beautifying');
      });
    });
  };

  debug = function() {
    var GitHubApi, addHeader, addInfo, allOptions, beautifiers, codeBlockSyntax, debugInfo, detail, editor, error, filePath, github, grammarName, headers, language, linkifyTitle, open, selectedBeautifier, stack, text, tocEl, _ref, _ref1;
    try {
      open = require("open");
      if (fs == null) {
        fs = require("fs");
      }
      GitHubApi = require("github");
      github = new GitHubApi();
      plugin.checkUnsupportedOptions();
      editor = atom.workspace.getActiveTextEditor();
      linkifyTitle = function(title) {
        var p, sep;
        title = title.toLowerCase();
        p = title.split(/[\s,+#;,\/?:@&=+$]+/);
        sep = "-";
        return p.join(sep);
      };
      if (editor == null) {
        return confirm("Active Editor not found.\n" + "Please select a Text Editor first to beautify.");
      }
      if (!confirm('Are you ready to debug Atom Beautify?\n\n' + 'Warning: This will create an anonymous Gist on GitHub (publically accessible and cannot be easily deleted) ' + 'containing the contents of your active Text Editor.\n' + 'Be sure to delete any private text from your active Text Editor before continuing ' + 'to ensure you are not sharing undesirable private information.')) {
        return;
      }
      debugInfo = "";
      headers = [];
      tocEl = "<TABLEOFCONTENTS/>";
      addInfo = function(key, val) {
        if (key != null) {
          return debugInfo += "**" + key + "**: " + val + "\n\n";
        } else {
          return debugInfo += "" + val + "\n\n";
        }
      };
      addHeader = function(level, title) {
        debugInfo += "" + (Array(level + 1).join('#')) + " " + title + "\n\n";
        return headers.push({
          level: level,
          title: title
        });
      };
      addHeader(1, "Atom Beautify - Debugging information");
      debugInfo += "The following debugging information was " + ("generated by `Atom Beautify` on `" + (new Date()) + "`.") + "\n\n---\n\n" + tocEl + "\n\n---\n\n";
      addInfo('Platform', process.platform);
      addHeader(2, "Versions");
      addInfo('Atom Version', atom.appVersion);
      addInfo('Atom Beautify Version', pkg.version);
      addHeader(2, "Original file to be beautified");
      filePath = editor.getPath();
      addInfo('Original File Path', "`" + filePath + "`");
      grammarName = editor.getGrammar().name;
      addInfo('Original File Grammar', grammarName);
      language = beautifier.getLanguage(grammarName, filePath);
      addInfo('Original File Language', language != null ? language.name : void 0);
      addInfo('Language namespace', language != null ? language.namespace : void 0);
      beautifiers = beautifier.getBeautifiers(language.name);
      addInfo('Supported Beautifiers', _.map(beautifiers, 'name').join(', '));
      selectedBeautifier = beautifier.getBeautifierForLanguage(language);
      addInfo('Selected Beautifier', selectedBeautifier.name);
      text = editor.getText() || "";
      codeBlockSyntax = ((_ref = language != null ? language.name : void 0) != null ? _ref : grammarName).toLowerCase().split(' ')[0];
      addHeader(3, 'Original File Contents');
      addInfo(null, "\n```" + codeBlockSyntax + "\n" + text + "\n```");
      addHeader(3, 'Package Settings');
      addInfo(null, "The raw package settings options\n" + ("```json\n" + (JSON.stringify(atom.config.get('atom-beautify'), void 0, 4)) + "\n```"));
      addHeader(2, "Beautification options");
      allOptions = beautifier.getOptionsForPath(filePath, editor);
      return Promise.all(allOptions).then(function(allOptions) {
        var cb, configOptions, e, editorConfigOptions, editorOptions, finalOptions, homeOptions, logFilePathRegex, logs, preTransformedOptions, projectOptions, subscription;
        editorOptions = allOptions[0], configOptions = allOptions[1], homeOptions = allOptions[2], editorConfigOptions = allOptions[3];
        projectOptions = allOptions.slice(4);
        preTransformedOptions = beautifier.getOptionsForLanguage(allOptions, language);
        if (selectedBeautifier) {
          finalOptions = beautifier.transformOptions(selectedBeautifier, language.name, preTransformedOptions);
        }
        addInfo('Editor Options', "\n" + "Options from Atom Editor settings\n" + ("```json\n" + (JSON.stringify(editorOptions, void 0, 4)) + "\n```"));
        addInfo('Config Options', "\n" + "Options from Atom Beautify package settings\n" + ("```json\n" + (JSON.stringify(configOptions, void 0, 4)) + "\n```"));
        addInfo('Home Options', "\n" + ("Options from `" + (path.resolve(beautifier.getUserHome(), '.jsbeautifyrc')) + "`\n") + ("```json\n" + (JSON.stringify(homeOptions, void 0, 4)) + "\n```"));
        addInfo('EditorConfig Options', "\n" + "Options from [EditorConfig](http://editorconfig.org/) file\n" + ("```json\n" + (JSON.stringify(editorConfigOptions, void 0, 4)) + "\n```"));
        addInfo('Project Options', "\n" + ("Options from `.jsbeautifyrc` files starting from directory `" + (path.dirname(filePath)) + "` and going up to root\n") + ("```json\n" + (JSON.stringify(projectOptions, void 0, 4)) + "\n```"));
        addInfo('Pre-Transformed Options', "\n" + "Combined options before transforming them given a beautifier's specifications\n" + ("```json\n" + (JSON.stringify(preTransformedOptions, void 0, 4)) + "\n```"));
        if (selectedBeautifier) {
          addHeader(3, 'Final Options');
          addInfo(null, "Final combined and transformed options that are used\n" + ("```json\n" + (JSON.stringify(finalOptions, void 0, 4)) + "\n```"));
        }
        logs = "";
        logFilePathRegex = new RegExp('\\: \\[(.*)\\]');
        subscription = logger.onLogging(function(msg) {
          var sep;
          sep = path.sep;
          return logs += msg.replace(logFilePathRegex, function(a, b) {
            var i, p, s;
            s = b.split(sep);
            i = s.indexOf('atom-beautify');
            p = s.slice(i + 2).join(sep);
            return ': [' + p + ']';
          });
        });
        cb = function(result) {
          var JsDiff, bullet, diff, header, indent, indentNum, toc, _i, _len;
          subscription.dispose();
          addHeader(2, "Results");
          addInfo('Beautified File Contents', "\n```" + codeBlockSyntax + "\n" + result + "\n```");
          JsDiff = require('diff');
          if (typeof result === "string") {
            diff = JsDiff.createPatch(filePath || "", text || "", result || "", "original", "beautified");
            addInfo('Original vs. Beautified Diff', "\n```" + codeBlockSyntax + "\n" + diff + "\n```");
          }
          addHeader(3, "Logs");
          addInfo(null, "```\n" + logs + "\n```");
          toc = "## Table Of Contents\n";
          for (_i = 0, _len = headers.length; _i < _len; _i++) {
            header = headers[_i];

            /*
            - Heading 1
              - Heading 1.1
             */
            indent = "  ";
            bullet = "-";
            indentNum = header.level - 2;
            if (indentNum >= 0) {
              toc += "" + (Array(indentNum + 1).join(indent)) + bullet + " [" + header.title + "](\#" + (linkifyTitle(header.title)) + ")\n";
            }
          }
          debugInfo = debugInfo.replace(tocEl, toc);
          return github.gists.create({
            files: {
              "debug.md": {
                "content": debugInfo
              }
            },
            "public": true,
            description: "Atom-Beautify debugging information"
          }, function(err, res) {
            var body, gistUrl, issueTemplate;
            if (err) {
              return confirm("An error occurred when creating the Gist: " + err);
            } else {
              gistUrl = res.html_url;
              open(gistUrl);
              confirm(("Your Atom Beautify debugging information can be found in the public Gist:\n" + res.html_url + "\n\n") + 'Warning: Be sure to look over the debug info before you send it ' + 'to ensure you are not sharing undesirable private information.\n\n' + 'If you want to delete this anonymous Gist read\n' + 'https://help.github.com/articles/deleting-an-anonymous-gist/');
              if (!confirm("Would you like to create a new Issue on GitHub now?")) {
                return;
              }
              issueTemplate = fs.readFileSync(path.resolve(__dirname, "../ISSUE_TEMPLATE.md")).toString();
              body = issueTemplate.replace("<INSERT GIST HERE>", gistUrl);
              return open("https://github.com/Glavin001/atom-beautify/issues/new?body=" + (encodeURIComponent(body)));
            }
          });
        };
        try {
          return beautifier.beautify(text, allOptions, grammarName, filePath).then(cb)["catch"](cb);
        } catch (_error) {
          e = _error;
          return cb(e);
        }
      })["catch"](function(error) {
        var detail, stack, _ref1;
        stack = error.stack;
        detail = error.description || error.message;
        return typeof atom !== "undefined" && atom !== null ? (_ref1 = atom.notifications) != null ? _ref1.addError(error.message, {
          stack: stack,
          detail: detail,
          dismissable: true
        }) : void 0 : void 0;
      });
    } catch (_error) {
      error = _error;
      stack = error.stack;
      detail = error.description || error.message;
      return typeof atom !== "undefined" && atom !== null ? (_ref1 = atom.notifications) != null ? _ref1.addError(error.message, {
        stack: stack,
        detail: detail,
        dismissable: true
      }) : void 0 : void 0;
    }
  };

  handleSaveEvent = function() {
    return atom.workspace.observeTextEditors(function(editor) {
      var beautifyOnSaveHandler, disposable, pendingPaths;
      pendingPaths = {};
      beautifyOnSaveHandler = function(_arg) {
        var beautifyOnSave, buffer, fileExtension, filePath, grammar, key, language, languages;
        filePath = _arg.path;
        logger.verbose('Should beautify on this save?');
        if (pendingPaths[filePath]) {
          logger.verbose("Editor with file path " + filePath + " already beautified!");
          return;
        }
        buffer = editor.getBuffer();
        if (path == null) {
          path = require('path');
        }
        grammar = editor.getGrammar().name;
        fileExtension = path.extname(filePath);
        fileExtension = fileExtension.substr(1);
        languages = beautifier.languages.getLanguages({
          grammar: grammar,
          extension: fileExtension
        });
        if (languages.length < 1) {
          return;
        }
        language = languages[0];
        key = "atom-beautify." + language.namespace + ".beautify_on_save";
        beautifyOnSave = atom.config.get(key);
        logger.verbose('save editor positions', key, beautifyOnSave);
        if (beautifyOnSave) {
          logger.verbose('Beautifying file', filePath);
          return beautify({
            editor: editor,
            onSave: true
          }).then(function() {
            logger.verbose('Done beautifying file', filePath);
            if (editor.isAlive() === true) {
              logger.verbose('Saving TextEditor...');
              pendingPaths[filePath] = true;
              editor.save();
              delete pendingPaths[filePath];
              return logger.verbose('Saved TextEditor.');
            }
          })["catch"](function(error) {
            return showError(error);
          });
        }
      };
      disposable = editor.onDidSave(function(_arg) {
        var filePath;
        filePath = _arg.path;
        return beautifyOnSaveHandler({
          path: filePath
        });
      });
      return plugin.subscriptions.add(disposable);
    });
  };

  getUnsupportedOptions = function() {
    var schema, settings, unsupportedOptions;
    settings = atom.config.get('atom-beautify');
    schema = atom.config.getSchema('atom-beautify');
    unsupportedOptions = _.filter(_.keys(settings), function(key) {
      return schema.properties[key] === void 0;
    });
    return unsupportedOptions;
  };

  plugin.checkUnsupportedOptions = function() {
    var unsupportedOptions;
    unsupportedOptions = getUnsupportedOptions();
    if (unsupportedOptions.length !== 0) {
      return atom.notifications.addWarning("Please run Atom command 'Atom-Beautify: Migrate Settings'.", {
        detail: "You can open the Atom command palette with `cmd-shift-p` (OSX) or `ctrl-shift-p` (Linux/Windows) in Atom. You have unsupported options: " + (unsupportedOptions.join(', ')),
        dismissable: true
      });
    }
  };

  plugin.migrateSettings = function() {
    var namespaces, rename, rex, unsupportedOptions;
    unsupportedOptions = getUnsupportedOptions();
    namespaces = beautifier.languages.namespaces;
    if (unsupportedOptions.length === 0) {
      return atom.notifications.addSuccess("No options to migrate.");
    } else {
      rex = new RegExp("(" + (namespaces.join('|')) + ")_(.*)");
      rename = _.toPairs(_.zipObject(unsupportedOptions, _.map(unsupportedOptions, function(key) {
        var m;
        m = key.match(rex);
        if (m === null) {
          return "general." + key;
        } else {
          return "" + m[1] + "." + m[2];
        }
      })));
      _.each(rename, function(_arg) {
        var key, newKey, val;
        key = _arg[0], newKey = _arg[1];
        val = atom.config.get("atom-beautify." + key);
        atom.config.set("atom-beautify." + newKey, val);
        return atom.config.set("atom-beautify." + key, void 0);
      });
      return atom.notifications.addSuccess("Successfully migrated options: " + (unsupportedOptions.join(', ')));
    }
  };

  plugin.config = _.merge(require('./config.coffee'), defaultLanguageOptions);

  plugin.activate = function() {
    this.subscriptions = new CompositeDisposable;
    this.subscriptions.add(handleSaveEvent());
    this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:beautify-editor", beautify));
    this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:help-debug-editor", debug));
    this.subscriptions.add(atom.commands.add(".tree-view .file .name", "atom-beautify:beautify-file", beautifyFile));
    this.subscriptions.add(atom.commands.add(".tree-view .directory .name", "atom-beautify:beautify-directory", beautifyDirectory));
    return this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:migrate-settings", plugin.migrateSettings));
  };

  plugin.deactivate = function() {
    return this.subscriptions.dispose();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3N0ZWZhbm8uY29yYWxsby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZ5LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsRUFBQSxZQUFBLENBQUE7QUFBQSxNQUFBLGdWQUFBOztBQUFBLEVBQ0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxpQkFBUixDQUROLENBQUE7O0FBQUEsRUFJQSxNQUFBLEdBQVMsTUFBTSxDQUFDLE9BSmhCLENBQUE7O0FBQUEsRUFLQyxzQkFBdUIsT0FBQSxDQUFRLFdBQVIsRUFBdkIsbUJBTEQsQ0FBQTs7QUFBQSxFQU1BLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQU5KLENBQUE7O0FBQUEsRUFPQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGVBQVIsQ0FQZCxDQUFBOztBQUFBLEVBUUEsVUFBQSxHQUFpQixJQUFBLFdBQUEsQ0FBQSxDQVJqQixDQUFBOztBQUFBLEVBU0Esc0JBQUEsR0FBeUIsVUFBVSxDQUFDLE9BVHBDLENBQUE7O0FBQUEsRUFVQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FBQSxDQUFvQixVQUFwQixDQVZULENBQUE7O0FBQUEsRUFXQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFVBQVIsQ0FYVixDQUFBOztBQUFBLEVBY0EsRUFBQSxHQUFLLElBZEwsQ0FBQTs7QUFBQSxFQWVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQWZQLENBQUE7O0FBQUEsRUFnQkEsS0FBQSxHQUFRLElBaEJSLENBQUE7O0FBQUEsRUFpQkEsSUFBQSxHQUFPLElBakJQLENBQUE7O0FBQUEsRUFrQkEsS0FBQSxHQUFRLElBbEJSLENBQUE7O0FBQUEsRUFtQkEsR0FBQSxHQUFNLElBbkJOLENBQUE7O0FBQUEsRUFvQkEsV0FBQSxHQUFj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

//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/atom-beautify/src/beautify.coffee
