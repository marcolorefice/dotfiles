(function() {
  "use strict";
  var Beautifier, VueBeautifier, prettydiff, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  prettydiff = require("prettydiff");

  _ = require('lodash');

  module.exports = VueBeautifier = (function(_super) {
    __extends(VueBeautifier, _super);

    function VueBeautifier() {
      return VueBeautifier.__super__.constructor.apply(this, arguments);
    }

    VueBeautifier.prototype.name = "Vue Beautifier";

    VueBeautifier.prototype.options = {
      Vue: true
    };

    VueBeautifier.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var regexp;
        regexp = /(<(template|script|style)[^>]*>)((\s|\S)*?)<\/\2>/gi;
        return resolve(text.replace(regexp, function(match, begin, type, text) {
          var lang, _ref;
          lang = (_ref = /lang\s*=\s*['"](\w+)["']/.exec(begin)) != null ? _ref[1] : void 0;
          switch (type) {
            case "template":
              switch (lang) {
                case "pug":
                case "jade":
                  return match.replace(text, "\n" + require("pug-beautify")(text, options) + "\n");
                case void 0:
                  return match.replace(text, "\n" + require("js-beautify").html(text, options) + "\n");
                default:
                  return match;
              }
              break;
            case "script":
              return match.replace(text, "\n" + require("js-beautify")(text, options) + "\n");
            case "style":
              switch (lang) {
                case "sass":
                case "scss":
                  options = _.merge(options, {
                    source: text,
                    lang: "scss",
                    mode: "beautify"
                  });
                  return match.replace(text, prettydiff.api(options)[0]);
                case "less":
                  options = _.merge(options, {
                    source: text,
                    lang: "less",
                    mode: "beautify"
                  });
                  return match.replace(text, prettydiff.api(options)[0]);
                case void 0:
                  return match.replace(text, "\n" + require("js-beautify").css(text, options) + "\n");
                default:
                  return match;
              }
          }
        }));
      });
    };

    return VueBeautifier;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3N0ZWZhbm8uY29yYWxsby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL3Z1ZS1iZWF1dGlmaWVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxZQUFBLENBQUE7QUFBQSxNQUFBLHdDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FEYixDQUFBOztBQUFBLEVBRUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxZQUFSLENBRmIsQ0FBQTs7QUFBQSxFQUdBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQUhKLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQixvQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsNEJBQUEsSUFBQSxHQUFNLGdCQUFOLENBQUE7O0FBQUEsNEJBRUEsT0FBQSxHQUNFO0FBQUEsTUFBQSxHQUFBLEVBQUssSUFBTDtLQUhGLENBQUE7O0FBQUEsNEJBS0EsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsR0FBQTtBQUNSLGFBQVcsSUFBQSxJQUFDLENBQUEsT0FBRCxDQUFTLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUNsQixZQUFBLE1BQUE7QUFBQSxRQUFBLE1BQUEsR0FBUyxxREFBVCxDQUFBO2VBRUEsT0FBQSxDQUFRLElBQUksQ0FBQyxPQUFMLENBQWEsTUFBYixFQUFxQixTQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWUsSUFBZixFQUFxQixJQUFyQixHQUFBO0FBQzNCLGNBQUEsVUFBQTtBQUFBLFVBQUEsSUFBQSxpRUFBK0MsQ0FBQSxDQUFBLFVBQS9DLENBQUE7QUFFQSxrQkFBTyxJQUFQO0FBQUEsaUJBQ08sVUFEUDtBQUVJLHNCQUFPLElBQVA7QUFBQSxxQkFDTyxLQURQO0FBQUEscUJBQ2MsTUFEZDt5QkFFSSxLQUFLLENBQUMsT0FBTixDQUFjLElBQWQsRUFBb0IsSUFBQSxHQUFPLE9BQUEsQ0FBUSxjQUFSLENBQUEsQ0FBd0IsSUFBeEIsRUFBOEIsT0FBOUIsQ0FBUCxHQUFnRCxJQUFwRSxFQUZKO0FBQUEscUJBR08sTUFIUDt5QkFJSSxLQUFLLENBQUMsT0FBTixDQUFjLElBQWQsRUFBb0IsSUFBQSxHQUFPLE9BQUEsQ0FBUSxhQUFSLENBQXNCLENBQUMsSUFBdkIsQ0FBNEIsSUFBNUIsRUFBa0MsT0FBbEMsQ0FBUCxHQUFvRCxJQUF4RSxFQUpKO0FBQUE7eUJBTUksTUFOSjtBQUFBLGVBRko7QUFDTztBQURQLGlCQVNPLFFBVFA7cUJBVUksS0FBSyxDQUFDLE9BQU4sQ0FBYyxJQUFkLEVBQW9CLElBQUEsR0FBTyxPQUFBLENBQVEsYUFBUixDQUFBLENBQXVCLElBQXZCLEVBQTZCLE9BQTdCLENBQVAsR0FBK0MsSUFBbkUsRUFWSjtBQUFBLGlCQVdPLE9BWFA7QUFZSSxzQkFBTyxJQUFQO0FBQUEscUJBQ08sTUFEUDtBQUFBLHFCQUNlLE1BRGY7QUFFSSxrQkFBQSxPQUFBLEdBQVUsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxPQUFSLEVBQ1I7QUFBQSxvQkFBQSxNQUFBLEVBQVEsSUFBUjtBQUFBLG9CQUNBLElBQUEsRUFBTSxNQUROO0FBQUEsb0JBRUEsSUFBQSxFQUFNLFVBRk47bUJBRFEsQ0FBVixDQUFBO3lCQUlBLEtBQUssQ0FBQyxPQUFOLENBQWMsSUFBZCxFQUFvQixVQUFVLENBQUMsR0FBWCxDQUFlLE9BQWYsQ0FBd0IsQ0FBQSxDQUFBLENBQTVDLEVBTko7QUFBQSxxQkFPTyxNQVBQO0FBUUksa0JBQUEsT0FBQSxHQUFVLENBQUMsQ0FBQyxLQUFGLENBQVEsT0FBUixFQUNWO0FBQUEsb0JBQUEsTUFBQSxFQUFRLElBQVI7QUFBQSxvQkFDQSxJQUFBLEVBQU0sTUFETjtBQUFBLG9CQUVBLElBQUEsRUFBTSxVQUZOO21CQURVLENBQVYsQ0FBQTt5QkFJQSxLQUFLLENBQUMsT0FBTixDQUFjLElBQWQsRUFBb0IsVUFBVSxDQUFDLEdBQVgsQ0FBZSxPQUFmLENBQXdCLENBQUEsQ0FBQSxDQUE1QyxFQVpKO0FBQUEscUJBYU8sTUFiUDt5QkFjSSxLQUFLLENBQUMsT0FBTixDQUFjLElBQWQsRUFBb0IsSUFBQSxHQUFPLE9BQUEsQ0FBUSxhQUFSLENBQXNCLENBQUMsR0FBdkIsQ0FBMkIsSUFBM0IsRUFBaUMsT0FBakMsQ0FBUCxHQUFtRCxJQUF2RSxFQWRKO0FBQUE7eUJBZ0JJLE1BaEJKO0FBQUEsZUFaSjtBQUFBLFdBSDJCO1FBQUEsQ0FBckIsQ0FBUixFQUhrQjtNQUFBLENBQVQsQ0FBWCxDQURRO0lBQUEsQ0FMVixDQUFBOzt5QkFBQTs7S0FEMkMsV0FMN0MsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/atom-beautify/src/beautifiers/vue-beautifier.coffee
