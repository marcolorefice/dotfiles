(function() {
  "use strict";
  var Beautifier, TidyMarkdown,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = TidyMarkdown = (function(_super) {
    __extends(TidyMarkdown, _super);

    function TidyMarkdown() {
      return TidyMarkdown.__super__.constructor.apply(this, arguments);
    }

    TidyMarkdown.prototype.name = "Tidy Markdown";

    TidyMarkdown.prototype.link = "https://github.com/slang800/tidy-markdown";

    TidyMarkdown.prototype.options = {
      Markdown: false
    };

    TidyMarkdown.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var cleanMarkdown, tidyMarkdown;
        tidyMarkdown = require('tidy-markdown');
        cleanMarkdown = tidyMarkdown(text);
        return resolve(cleanMarkdown);
      });
    };

    return TidyMarkdown;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3N0ZWZhbm8uY29yYWxsby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL3RpZHktbWFya2Rvd24uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFlBQUEsQ0FBQTtBQUFBLE1BQUEsd0JBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQURiLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQixtQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsMkJBQUEsSUFBQSxHQUFNLGVBQU4sQ0FBQTs7QUFBQSwyQkFDQSxJQUFBLEdBQU0sMkNBRE4sQ0FBQTs7QUFBQSwyQkFFQSxPQUFBLEdBQVM7QUFBQSxNQUNQLFFBQUEsRUFBVSxLQURIO0tBRlQsQ0FBQTs7QUFBQSwyQkFNQSxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQixHQUFBO0FBQ1IsYUFBVyxJQUFBLElBQUMsQ0FBQSxPQUFELENBQVMsU0FBQyxPQUFELEVBQVUsTUFBVixHQUFBO0FBQ2xCLFlBQUEsMkJBQUE7QUFBQSxRQUFBLFlBQUEsR0FBZSxPQUFBLENBQVEsZUFBUixDQUFmLENBQUE7QUFBQSxRQUNBLGFBQUEsR0FBZ0IsWUFBQSxDQUFhLElBQWIsQ0FEaEIsQ0FBQTtlQUVBLE9BQUEsQ0FBUSxhQUFSLEVBSGtCO01BQUEsQ0FBVCxDQUFYLENBRFE7SUFBQSxDQU5WLENBQUE7O3dCQUFBOztLQUQwQyxXQUg1QyxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/atom-beautify/src/beautifiers/tidy-markdown.coffee
