(function() {
  var Beautifier, Promise, fs, path, readFile, spawn, temp, which, _;

  Promise = require('bluebird');

  _ = require('lodash');

  fs = require('fs');

  temp = require('temp').track();

  readFile = Promise.promisify(fs.readFile);

  which = require('which');

  spawn = require('child_process').spawn;

  path = require('path');

  module.exports = Beautifier = (function() {

    /*
    Promise
     */
    Beautifier.prototype.Promise = Promise;


    /*
    Name of Beautifier
     */

    Beautifier.prototype.name = 'Beautifier';


    /*
    Supported Options
    
    Enable options for supported languages.
    - <string:language>:<boolean:all_options_enabled>
    - <string:language>:<string:option_key>:<boolean:enabled>
    - <string:language>:<string:option_key>:<string:rename>
    - <string:language>:<string:option_key>:<function:transform>
    - <string:language>:<string:option_key>:<array:mapper>
     */

    Beautifier.prototype.options = {};


    /*
    Supported languages by this Beautifier
    
    Extracted from the keys of the `options` field.
     */

    Beautifier.prototype.languages = null;


    /*
    Beautify text
    
    Override this method in subclasses
     */

    Beautifier.prototype.beautify = null;


    /*
    Show deprecation warning to user.
     */

    Beautifier.prototype.deprecate = function(warning) {
      var _ref;
      return (_ref = atom.notifications) != null ? _ref.addWarning(warning) : void 0;
    };


    /*
    Create temporary file
     */

    Beautifier.prototype.tempFile = function(name, contents, ext) {
      if (name == null) {
        name = "atom-beautify-temp";
      }
      if (contents == null) {
        contents = "";
      }
      if (ext == null) {
        ext = "";
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return temp.open({
            prefix: name,
            suffix: ext
          }, function(err, info) {
            _this.debug('tempFile', name, err, info);
            if (err) {
              return reject(err);
            }
            return fs.write(info.fd, contents, function(err) {
              if (err) {
                return reject(err);
              }
              return fs.close(info.fd, function(err) {
                if (err) {
                  return reject(err);
                }
                return resolve(info.path);
              });
            });
          });
        };
      })(this));
    };


    /*
    Read file
     */

    Beautifier.prototype.readFile = function(filePath) {
      return Promise.resolve(filePath).then(function(filePath) {
        return readFile(filePath, "utf8");
      });
    };


    /*
    Find file
     */

    Beautifier.prototype.findFile = function(startDir, fileNames) {
      var currentDir, fileName, filePath, _i, _len;
      if (!arguments.length) {
        throw new Error("Specify file names to find.");
      }
      if (!(fileNames instanceof Array)) {
        fileNames = [fileNames];
      }
      startDir = startDir.split(path.sep);
      while (startDir.length) {
        currentDir = startDir.join(path.sep);
        for (_i = 0, _len = fileNames.length; _i < _len; _i++) {
          fileName = fileNames[_i];
          filePath = path.join(currentDir, fileName);
          try {
            fs.accessSync(filePath, fs.R_OK);
            return filePath;
          } catch (_error) {}
        }
        startDir.pop();
      }
      return null;
    };


    /*
    If platform is Windows
     */

    Beautifier.prototype.isWindows = (function() {
      return new RegExp('^win').test(process.platform);
    })();


    /*
    Get Shell Environment variables
    
    Special thank you to @ioquatix
    See https://github.com/ioquatix/script-runner/blob/v1.5.0/lib/script-runner.coffee#L45-L63
     */

    Beautifier.prototype._envCache = null;

    Beautifier.prototype._envCacheDate = null;

    Beautifier.prototype._envCacheExpiry = 10000;

    Beautifier.prototype.getShellEnvironment = function() {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var buffer, child;
          if ((_this._envCache != null) && (_this._envCacheDate != null)) {
            if ((new Date() - _this._envCacheDate) < _this._envCacheExpiry) {
              return resolve(_this._envCache);
            }
          }
          if (_this.isWindows) {
            return resolve(process.env);
          } else {
            child = spawn(process.env.SHELL, ['-ilc', 'env'], {
              detached: true,
              stdio: ['ignore', 'pipe', process.stderr]
            });
            buffer = '';
            child.stdout.on('data', function(data) {
              return buffer += data;
            });
            return child.on('close', function(code, signal) {
              var definition, environment, key, value, _i, _len, _ref, _ref1;
              if (code !== 0) {
                return reject(new Error("Could not get Shell Environment. Exit code: " + code + ", Signal: " + signal));
              }
              environment = {};
              _ref = buffer.split('\n');
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                definition = _ref[_i];
                _ref1 = definition.split('=', 2), key = _ref1[0], value = _ref1[1];
                if (key !== '') {
                  environment[key] = value;
                }
              }
              _this._envCache = environment;
              _this._envCacheDate = new Date();
              return resolve(environment);
            });
          }
        };
      })(this));
    };


    /*
    Like the unix which utility.
    
    Finds the first instance of a specified executable in the PATH environment variable.
    Does not cache the results,
    so hash -r is not needed when the PATH changes.
    See https://github.com/isaacs/node-which
     */

    Beautifier.prototype.which = function(exe, options) {
      if (options == null) {
        options = {};
      }
      return this.getShellEnvironment().then((function(_this) {
        return function(env) {
          return new Promise(function(resolve, reject) {
            var i, _ref;
            if (options.path == null) {
              options.path = env.PATH;
            }
            if (_this.isWindows) {
              if (!options.path) {
                for (i in env) {
                  if (i.toLowerCase() === "path") {
                    options.path = env[i];
                    break;
                  }
                }
              }
              if (options.pathExt == null) {
                options.pathExt = "" + ((_ref = process.env.PATHEXT) != null ? _ref : '.EXE') + ";";
              }
            }
            return which(exe, options, function(err, path) {
              if (err) {
                resolve(exe);
              }
              return resolve(path);
            });
          });
        };
      })(this));
    };


    /*
    Add help to error.description
    
    Note: error.description is not officially used in JavaScript,
    however it is used internally for Atom Beautify when displaying errors.
     */

    Beautifier.prototype.commandNotFoundError = function(exe, help) {
      var docsLink, er, helpStr, issueSearchLink, message;
      message = "Could not find '" + exe + "'. The program may not be installed.";
      er = new Error(message);
      er.code = 'CommandNotFound';
      er.errno = er.code;
      er.syscall = 'beautifier::run';
      er.file = exe;
      if (help != null) {
        if (typeof help === "object") {
          helpStr = "See " + help.link + " for program installation instructions.\n";
          if (help.pathOption) {
            helpStr += "You can configure Atom Beautify with the absolute path to '" + (help.program || exe) + "' by setting '" + help.pathOption + "' in the Atom Beautify package settings.\n";
          }
          if (help.additional) {
            helpStr += help.additional;
          }
          issueSearchLink = "https://github.com/Glavin001/atom-beautify/search?q=" + exe + "&type=Issues";
          docsLink = "https://github.com/Glavin001/atom-beautify/tree/master/docs";
          helpStr += "Your program is properly installed if running '" + (this.isWindows ? 'where.exe' : 'which') + " " + exe + "' in your " + (this.isWindows ? 'CMD prompt' : 'Terminal') + " returns an absolute path to the executable. If this does not work then you have not installed the program correctly and so Atom Beautify will not find the program. Atom Beautify requires that the program be found in your PATH environment variable. \nNote that this is not an Atom Beautify issue if beautification does not work and the above command also does not work: this is expected behaviour, since you have not properly installed your program. Please properly setup the program and search through existing Atom Beautify issues before creating a new issue. See " + issueSearchLink + " for related Issues and " + docsLink + " for documentation. If you are still unable to resolve this issue on your own then please create a new issue and ask for help.\n";
          er.description = helpStr;
        } else {
          er.description = help;
        }
      }
      return er;
    };


    /*
    Run command-line interface command
     */

    Beautifier.prototype.run = function(executable, args, _arg) {
      var cwd, help, ignoreReturnCode, onStdin, _ref;
      _ref = _arg != null ? _arg : {}, cwd = _ref.cwd, ignoreReturnCode = _ref.ignoreReturnCode, help = _ref.help, onStdin = _ref.onStdin;
      args = _.flatten(args);
      return Promise.all([executable, Promise.all(args)]).then((function(_this) {
        return function(_arg1) {
          var args, exeName;
          exeName = _arg1[0], args = _arg1[1];
          _this.debug('exeName, args:', exeName, args);
          return Promise.all([exeName, args, _this.getShellEnvironment(), _this.which(exeName)]);
        };
      })(this)).then((function(_this) {
        return function(_arg1) {
          var args, env, exe, exeName, exePath, options;
          exeName = _arg1[0], args = _arg1[1], env = _arg1[2], exePath = _arg1[3];
          _this.debug('exePath, env:', exePath, env);
          _this.debug('args', args);
          exe = exePath != null ? exePath : exeName;
          options = {
            cwd: cwd,
            env: env
          };
          return _this.spawn(exe, args, options, onStdin).then(function(_arg2) {
            var returnCode, stderr, stdout, windowsProgramNotFoundMsg;
            returnCode = _arg2.returnCode, stdout = _arg2.stdout, stderr = _arg2.stderr;
            _this.verbose('spawn result', returnCode, stdout, stderr);
            if (!ignoreReturnCode && returnCode !== 0) {
              windowsProgramNotFoundMsg = "is not recognized as an internal or external command";
              _this.verbose(stderr, windowsProgramNotFoundMsg);
              if (_this.isWindows && returnCode === 1 && stderr.indexOf(windowsProgramNotFoundMsg) !== -1) {
                throw _this.commandNotFoundError(exeName, help);
              } else {
                throw new Error(stderr);
              }
            } else {
              return stdout;
            }
          })["catch"](function(err) {
            _this.debug('error', err);
            if (err.code === 'ENOENT' || err.errno === 'ENOENT') {
              throw _this.commandNotFoundError(exeName, help);
            } else {
              throw err;
            }
          });
        };
      })(this));
    };


    /*
    Spawn
     */

    Beautifier.prototype.spawn = function(exe, args, options, onStdin) {
      args = _.without(args, void 0);
      args = _.without(args, null);
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var cmd, stderr, stdout;
          _this.debug('spawn', exe, args);
          cmd = spawn(exe, args, options);
          stdout = "";
          stderr = "";
          cmd.stdout.on('data', function(data) {
            return stdout += data;
          });
          cmd.stderr.on('data', function(data) {
            return stderr += data;
          });
          cmd.on('close', function(returnCode) {
            _this.debug('spawn done', returnCode, stderr, stdout);
            return resolve({
              returnCode: returnCode,
              stdout: stdout,
              stderr: stderr
            });
          });
          cmd.on('error', function(err) {
            _this.debug('error', err);
            return reject(err);
          });
          if (onStdin) {
            return onStdin(cmd.stdin);
          }
        };
      })(this));
    };


    /*
    Logger instance
     */

    Beautifier.prototype.logger = null;


    /*
    Initialize and configure Logger
     */

    Beautifier.prototype.setupLogger = function() {
      var key, method, _ref;
      this.logger = require('../logger')(__filename);
      _ref = this.logger;
      for (key in _ref) {
        method = _ref[key];
        this[key] = method;
      }
      return this.verbose("" + this.name + " beautifier logger has been initialized.");
    };


    /*
    Constructor to setup beautifer
     */

    function Beautifier() {
      var globalOptions, lang, options, _ref;
      this.setupLogger();
      if (this.options._ != null) {
        globalOptions = this.options._;
        delete this.options._;
        if (typeof globalOptions === "object") {
          _ref = this.options;
          for (lang in _ref) {
            options = _ref[lang];
            if (typeof options === "boolean") {
              if (options === true) {
                this.options[lang] = globalOptions;
              }
            } else if (typeof options === "object") {
              this.options[lang] = _.merge(globalOptions, options);
            } else {
              this.warn(("Unsupported options type " + (typeof options) + " for language " + lang + ": ") + options);
            }
          }
        }
      }
      this.verbose("Options for " + this.name + ":", this.options);
      this.languages = _.keys(this.options);
    }

    return Beautifier;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3N0ZWZhbm8uY29yYWxsby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL2JlYXV0aWZpZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhEQUFBOztBQUFBLEVBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxVQUFSLENBQVYsQ0FBQTs7QUFBQSxFQUNBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQURKLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQyxLQUFoQixDQUFBLENBSFAsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsR0FBVyxPQUFPLENBQUMsU0FBUixDQUFrQixFQUFFLENBQUMsUUFBckIsQ0FKWCxDQUFBOztBQUFBLEVBS0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSLENBTFIsQ0FBQTs7QUFBQSxFQU1BLEtBQUEsR0FBUSxPQUFBLENBQVEsZUFBUixDQUF3QixDQUFDLEtBTmpDLENBQUE7O0FBQUEsRUFPQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FQUCxDQUFBOztBQUFBLEVBU0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFFckI7QUFBQTs7T0FBQTtBQUFBLHlCQUdBLE9BQUEsR0FBUyxPQUhULENBQUE7O0FBS0E7QUFBQTs7T0FMQTs7QUFBQSx5QkFRQSxJQUFBLEdBQU0sWUFSTixDQUFBOztBQVVBO0FBQUE7Ozs7Ozs7OztPQVZBOztBQUFBLHlCQW9CQSxPQUFBLEdBQVMsRUFwQlQsQ0FBQTs7QUFzQkE7QUFBQTs7OztPQXRCQTs7QUFBQSx5QkEyQkEsU0FBQSxHQUFXLElBM0JYLENBQUE7O0FB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

//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/atom-beautify/src/beautifiers/beautifier.coffee
