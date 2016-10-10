
/*
Requires https://github.com/nrc/rustfmt
 */

(function() {
  "use strict";
  var Beautifier, Rustfmt, path, versionCheckState,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  path = require('path');

  versionCheckState = false;

  module.exports = Rustfmt = (function(_super) {
    __extends(Rustfmt, _super);

    function Rustfmt() {
      return Rustfmt.__super__.constructor.apply(this, arguments);
    }

    Rustfmt.prototype.name = "rustfmt";

    Rustfmt.prototype.link = "https://github.com/nrc/rustfmt";

    Rustfmt.prototype.options = {
      Rust: true
    };

    Rustfmt.prototype.beautify = function(text, language, options, context) {
      var cwd, help, p, program;
      cwd = context.filePath && path.dirname(context.filePath);
      program = options.rustfmt_path || "rustfmt";
      help = {
        link: "https://github.com/nrc/rustfmt",
        program: "rustfmt",
        pathOption: "Rust - Rustfmt Path"
      };
      p = versionCheckState === program ? this.Promise.resolve() : this.run(program, ["--version"], {
        help: help
      }).then(function(stdout) {
        if (/^0\.(?:[0-4]\.[0-9])/.test(stdout.trim())) {
          versionCheckState = false;
          throw new Error("rustfmt version 0.5.0 or newer required");
        } else {
          versionCheckState = program;
          return void 0;
        }
      });
      return p.then((function(_this) {
        return function() {
          return _this.run(program, [], {
            cwd: cwd,
            help: help,
            onStdin: function(stdin) {
              return stdin.end(text);
            }
          });
        };
      })(this));
    };

    return Rustfmt;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3N0ZWZhbm8uY29yYWxsby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL3J1c3RmbXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQTs7R0FBQTtBQUFBO0FBQUE7QUFBQSxFQUlBLFlBSkEsQ0FBQTtBQUFBLE1BQUEsNENBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQUxiLENBQUE7O0FBQUEsRUFNQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FOUCxDQUFBOztBQUFBLEVBUUEsaUJBQUEsR0FBb0IsS0FScEIsQ0FBQTs7QUFBQSxFQVVBLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBQ3JCLDhCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxzQkFBQSxJQUFBLEdBQU0sU0FBTixDQUFBOztBQUFBLHNCQUNBLElBQUEsR0FBTSxnQ0FETixDQUFBOztBQUFBLHNCQUdBLE9BQUEsR0FBUztBQUFBLE1BQ1AsSUFBQSxFQUFNLElBREM7S0FIVCxDQUFBOztBQUFBLHNCQU9BLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEVBQTBCLE9BQTFCLEdBQUE7QUFDUixVQUFBLHFCQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sT0FBTyxDQUFDLFFBQVIsSUFBcUIsSUFBSSxDQUFDLE9BQUwsQ0FBYSxPQUFPLENBQUMsUUFBckIsQ0FBM0IsQ0FBQTtBQUFBLE1BQ0EsT0FBQSxHQUFVLE9BQU8sQ0FBQyxZQUFSLElBQXdCLFNBRGxDLENBQUE7QUFBQSxNQUVBLElBQUEsR0FBTztBQUFBLFFBQ0wsSUFBQSxFQUFNLGdDQUREO0FBQUEsUUFFTCxPQUFBLEVBQVMsU0FGSjtBQUFBLFFBR0wsVUFBQSxFQUFZLHFCQUhQO09BRlAsQ0FBQTtBQUFBLE1BV0EsQ0FBQSxHQUFPLGlCQUFBLEtBQXFCLE9BQXhCLEdBQ0YsSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQUFULENBQUEsQ0FERSxHQUdGLElBQUMsQ0FBQSxHQUFELENBQUssT0FBTCxFQUFjLENBQUMsV0FBRCxDQUFkLEVBQTZCO0FBQUEsUUFBQSxJQUFBLEVBQU0sSUFBTjtPQUE3QixDQUNFLENBQUMsSUFESCxDQUNRLFNBQUMsTUFBRCxHQUFBO0FBQ0osUUFBQSxJQUFHLHNCQUFzQixDQUFDLElBQXZCLENBQTRCLE1BQU0sQ0FBQyxJQUFQLENBQUEsQ0FBNUIsQ0FBSDtBQUNFLFVBQUEsaUJBQUEsR0FBb0IsS0FBcEIsQ0FBQTtBQUNBLGdCQUFVLElBQUEsS0FBQSxDQUFNLHlDQUFOLENBQVYsQ0FGRjtTQUFBLE1BQUE7QUFJRSxVQUFBLGlCQUFBLEdBQW9CLE9BQXBCLENBQUE7aUJBQ0EsT0FMRjtTQURJO01BQUEsQ0FEUixDQWRGLENBQUE7YUF3QkEsQ0FBQyxDQUFDLElBQUYsQ0FBTyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNMLEtBQUMsQ0FBQSxHQUFELENBQUssT0FBTCxFQUFjLEVBQWQsRUFBa0I7QUFBQSxZQUNoQixHQUFBLEVBQUssR0FEVztBQUFBLFlBRWhCLElBQUEsRUFBTSxJQUZVO0FBQUEsWUFHaEIsT0FBQSxFQUFTLFNBQUMsS0FBRCxHQUFBO3FCQUNQLEtBQUssQ0FBQyxHQUFOLENBQVUsSUFBVixFQURPO1lBQUEsQ0FITztXQUFsQixFQURLO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBUCxFQXpCUTtJQUFBLENBUFYsQ0FBQTs7bUJBQUE7O0tBRHFDLFdBVnZDLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/atom-beautify/src/beautifiers/rustfmt.coffee
