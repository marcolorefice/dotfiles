(function() {
  "use strict";
  var Beautifier, TypeScriptFormatter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = TypeScriptFormatter = (function(_super) {
    __extends(TypeScriptFormatter, _super);

    function TypeScriptFormatter() {
      return TypeScriptFormatter.__super__.constructor.apply(this, arguments);
    }

    TypeScriptFormatter.prototype.name = "TypeScript Formatter";

    TypeScriptFormatter.prototype.link = "https://github.com/vvakame/typescript-formatter";

    TypeScriptFormatter.prototype.options = {
      TypeScript: true
    };

    TypeScriptFormatter.prototype.beautify = function(text, language, options) {
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var e, format, formatterUtils, opts, result;
          try {
            format = require("typescript-formatter/lib/formatter")["default"];
            formatterUtils = require("typescript-formatter/lib/utils");
            opts = formatterUtils.createDefaultFormatCodeOptions();
            if (options.indent_with_tabs) {
              opts.ConvertTabsToSpaces = false;
            } else {
              opts.TabSize = options.tab_width || options.indent_size;
              opts.IndentSize = options.indent_size;
              opts.IndentStyle = 'space';
            }
            _this.verbose('typescript', text, opts);
            result = format('', text, opts);
            _this.verbose(result);
            return resolve(result);
          } catch (_error) {
            e = _error;
            return reject(e);
          }
        };
      })(this));
    };

    return TypeScriptFormatter;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3N0ZWZhbm8uY29yYWxsby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL3R5cGVzY3JpcHQtZm9ybWF0dGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxZQUFBLENBQUE7QUFBQSxNQUFBLCtCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FEYixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDckIsMENBQUEsQ0FBQTs7OztLQUFBOztBQUFBLGtDQUFBLElBQUEsR0FBTSxzQkFBTixDQUFBOztBQUFBLGtDQUNBLElBQUEsR0FBTSxpREFETixDQUFBOztBQUFBLGtDQUVBLE9BQUEsR0FBUztBQUFBLE1BQ1AsVUFBQSxFQUFZLElBREw7S0FGVCxDQUFBOztBQUFBLGtDQU1BLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEdBQUE7QUFDUixhQUFXLElBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxPQUFELEVBQVUsTUFBVixHQUFBO0FBRWxCLGNBQUEsdUNBQUE7QUFBQTtBQUNFLFlBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxvQ0FBUixDQUE2QyxDQUFDLFNBQUQsQ0FBdEQsQ0FBQTtBQUFBLFlBQ0EsY0FBQSxHQUFpQixPQUFBLENBQVEsZ0NBQVIsQ0FEakIsQ0FBQTtBQUFBLFlBSUEsSUFBQSxHQUFPLGNBQWMsQ0FBQyw4QkFBZixDQUFBLENBSlAsQ0FBQTtBQU1BLFlBQUEsSUFBRyxPQUFPLENBQUMsZ0JBQVg7QUFDRSxjQUFBLElBQUksQ0FBQyxtQkFBTCxHQUEyQixLQUEzQixDQURGO2FBQUEsTUFBQTtBQUdFLGNBQUEsSUFBSSxDQUFDLE9BQUwsR0FBZSxPQUFPLENBQUMsU0FBUixJQUFxQixPQUFPLENBQUMsV0FBNUMsQ0FBQTtBQUFBLGNBQ0EsSUFBSSxDQUFDLFVBQUwsR0FBa0IsT0FBTyxDQUFDLFdBRDFCLENBQUE7QUFBQSxjQUVBLElBQUksQ0FBQyxXQUFMLEdBQW1CLE9BRm5CLENBSEY7YUFOQTtBQUFBLFlBYUEsS0FBQyxDQUFBLE9BQUQsQ0FBUyxZQUFULEVBQXVCLElBQXZCLEVBQTZCLElBQTdCLENBYkEsQ0FBQTtBQUFBLFlBY0EsTUFBQSxHQUFTLE1BQUEsQ0FBTyxFQUFQLEVBQVcsSUFBWCxFQUFpQixJQUFqQixDQWRULENBQUE7QUFBQSxZQWVBLEtBQUMsQ0FBQSxPQUFELENBQVMsTUFBVCxDQWZBLENBQUE7bUJBZ0JBLE9BQUEsQ0FBUSxNQUFSLEVBakJGO1dBQUEsY0FBQTtBQW1CRSxZQURJLFVBQ0osQ0FBQTtBQUFBLG1CQUFPLE1BQUEsQ0FBTyxDQUFQLENBQVAsQ0FuQkY7V0FGa0I7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFULENBQVgsQ0FEUTtJQUFBLENBTlYsQ0FBQTs7K0JBQUE7O0tBRGlELFdBSG5ELENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/atom-beautify/src/beautifiers/typescript-formatter.coffee
