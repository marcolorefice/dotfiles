
/*
Requires http://uncrustify.sourceforge.net/
 */

(function() {
  "use strict";
  var Beautifier, Uncrustify, cfg, expandHomeDir, path, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('../beautifier');

  cfg = require("./cfg");

  path = require("path");

  expandHomeDir = require('expand-home-dir');

  _ = require('lodash');

  module.exports = Uncrustify = (function(_super) {
    __extends(Uncrustify, _super);

    function Uncrustify() {
      return Uncrustify.__super__.constructor.apply(this, arguments);
    }

    Uncrustify.prototype.name = "Uncrustify";

    Uncrustify.prototype.link = "https://github.com/uncrustify/uncrustify";

    Uncrustify.prototype.options = {
      Apex: true,
      C: true,
      "C++": true,
      "C#": true,
      "Objective-C": true,
      D: true,
      Pawn: true,
      Vala: true,
      Java: true,
      Arduino: true
    };

    Uncrustify.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var basePath, configPath, editor, expandedConfigPath, projectPath;
        configPath = options.configPath;
        if (!configPath) {
          return cfg(options, function(error, cPath) {
            if (error) {
              throw error;
            }
            return resolve(cPath);
          });
        } else {
          editor = atom.workspace.getActiveTextEditor();
          if (editor != null) {
            basePath = path.dirname(editor.getPath());
            projectPath = atom.workspace.project.getPaths()[0];
            expandedConfigPath = expandHomeDir(configPath);
            configPath = path.resolve(projectPath, expandedConfigPath);
            return resolve(configPath);
          } else {
            return reject(new Error("No Uncrustify Config Path set! Please configure Uncrustify with Atom Beautify."));
          }
        }
      }).then((function(_this) {
        return function(configPath) {
          var lang, outputFile;
          lang = "C";
          switch (language) {
            case "Apex":
              lang = "Apex";
              break;
            case "C":
              lang = "C";
              break;
            case "C++":
              lang = "CPP";
              break;
            case "C#":
              lang = "CS";
              break;
            case "Objective-C":
            case "Objective-C++":
              lang = "OC+";
              break;
            case "D":
              lang = "D";
              break;
            case "Pawn":
              lang = "PAWN";
              break;
            case "Vala":
              lang = "VALA";
              break;
            case "Java":
              lang = "JAVA";
              break;
            case "Arduino":
              lang = "CPP";
          }
          return _this.run("uncrustify", ["-c", configPath, "-f", _this.tempFile("input", text), "-o", outputFile = _this.tempFile("output", text), "-l", lang], {
            help: {
              link: "http://sourceforge.net/projects/uncrustify/"
            }
          }).then(function() {
            return _this.readFile(outputFile);
          });
        };
      })(this));
    };

    return Uncrustify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3N0ZWZhbm8uY29yYWxsby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL3VuY3J1c3RpZnkvaW5kZXguY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7R0FBQTtBQUFBO0FBQUE7QUFBQSxFQUdBLFlBSEEsQ0FBQTtBQUFBLE1BQUEsbURBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUlBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUpiLENBQUE7O0FBQUEsRUFLQSxHQUFBLEdBQU0sT0FBQSxDQUFRLE9BQVIsQ0FMTixDQUFBOztBQUFBLEVBTUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBTlAsQ0FBQTs7QUFBQSxFQU9BLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGlCQUFSLENBUGhCLENBQUE7O0FBQUEsRUFRQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FSSixDQUFBOztBQUFBLEVBVUEsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDckIsaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHlCQUFBLElBQUEsR0FBTSxZQUFOLENBQUE7O0FBQUEseUJBQ0EsSUFBQSxHQUFNLDBDQUROLENBQUE7O0FBQUEseUJBRUEsT0FBQSxHQUFTO0FBQUEsTUFDUCxJQUFBLEVBQU0sSUFEQztBQUFBLE1BRVAsQ0FBQSxFQUFHLElBRkk7QUFBQSxNQUdQLEtBQUEsRUFBTyxJQUhBO0FBQUEsTUFJUCxJQUFBLEVBQU0sSUFKQztBQUFBLE1BS1AsYUFBQSxFQUFlLElBTFI7QUFBQSxNQU1QLENBQUEsRUFBRyxJQU5JO0FBQUEsTUFPUCxJQUFBLEVBQU0sSUFQQztBQUFBLE1BUVAsSUFBQSxFQUFNLElBUkM7QUFBQSxNQVNQLElBQUEsRUFBTSxJQVRDO0FBQUEsTUFV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

//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/atom-beautify/src/beautifiers/uncrustify/index.coffee
