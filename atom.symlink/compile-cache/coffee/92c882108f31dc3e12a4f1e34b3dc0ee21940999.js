
/*
Requires https://github.com/threedaymonk/htmlbeautifier
 */

(function() {
  "use strict";
  var Beautifier, HTMLBeautifier,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = HTMLBeautifier = (function(_super) {
    __extends(HTMLBeautifier, _super);

    function HTMLBeautifier() {
      return HTMLBeautifier.__super__.constructor.apply(this, arguments);
    }

    HTMLBeautifier.prototype.name = "HTML Beautifier";

    HTMLBeautifier.prototype.link = "https://github.com/threedaymonk/htmlbeautifier";

    HTMLBeautifier.prototype.options = {
      ERB: {
        indent_size: true
      }
    };

    HTMLBeautifier.prototype.beautify = function(text, language, options) {
      var tempFile;
      console.log('erb', options);
      return this.run("htmlbeautifier", ["--tab-stops", options.indent_size, tempFile = this.tempFile("temp", text)]).then((function(_this) {
        return function() {
          return _this.readFile(tempFile);
        };
      })(this));
    };

    return HTMLBeautifier;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3N0ZWZhbm8uY29yYWxsby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL2h0bWxiZWF1dGlmaWVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7O0dBQUE7QUFBQTtBQUFBO0FBQUEsRUFJQSxZQUpBLENBQUE7QUFBQSxNQUFBLDBCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVIsQ0FMYixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFDckIscUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLDZCQUFBLElBQUEsR0FBTSxpQkFBTixDQUFBOztBQUFBLDZCQUNBLElBQUEsR0FBTSxnREFETixDQUFBOztBQUFBLDZCQUVBLE9BQUEsR0FBUztBQUFBLE1BQ1AsR0FBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsSUFBYjtPQUZLO0tBRlQsQ0FBQTs7QUFBQSw2QkFPQSxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixHQUFBO0FBQ1IsVUFBQSxRQUFBO0FBQUEsTUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLEtBQVosRUFBbUIsT0FBbkIsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLEdBQUQsQ0FBSyxnQkFBTCxFQUF1QixDQUNyQixhQURxQixFQUNOLE9BQU8sQ0FBQyxXQURGLEVBRXJCLFFBQUEsR0FBVyxJQUFDLENBQUEsUUFBRCxDQUFVLE1BQVYsRUFBa0IsSUFBbEIsQ0FGVSxDQUF2QixDQUlFLENBQUMsSUFKSCxDQUlRLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ0osS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWLEVBREk7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUpSLEVBRlE7SUFBQSxDQVBWLENBQUE7OzBCQUFBOztLQUQ0QyxXQVA5QyxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/atom-beautify/src/beautifiers/htmlbeautifier.coffee
