
/*
Language Support and default options.
 */

(function() {
  "use strict";
  var Languages, extend, _;

  _ = require('lodash');

  extend = null;

  module.exports = Languages = (function() {
    Languages.prototype.languageNames = ["apex", "arduino", "c-sharp", "c", "clojure", "coffeescript", "coldfusion", "cpp", "crystal", "css", "csv", "d", "ejs", "elm", "erb", "erlang", "gherkin", "go", "fortran", "handlebars", "haskell", "html", "jade", "java", "javascript", "json", "jsx", "latex", "less", "lua", "markdown", 'marko', "mustache", "nunjucks", "objective-c", "ocaml", "pawn", "perl", "php", "puppet", "python", "r", "riotjs", "ruby", "rust", "sass", "scss", "spacebars", "sql", "svg", "swig", "tss", "twig", "typescript", "ux_markup", "vala", "vue", "visualforce", "xml", "xtemplate"];


    /*
    Languages
     */

    Languages.prototype.languages = null;


    /*
    Namespaces
     */

    Languages.prototype.namespaces = null;


    /*
    Constructor
     */

    function Languages() {
      this.languages = _.map(this.languageNames, function(name) {
        return require("./" + name);
      });
      this.namespaces = _.map(this.languages, function(language) {
        return language.namespace;
      });
    }


    /*
    Get language for grammar and extension
     */

    Languages.prototype.getLanguages = function(_arg) {
      var extension, grammar, name, namespace;
      name = _arg.name, namespace = _arg.namespace, grammar = _arg.grammar, extension = _arg.extension;
      return _.union(_.filter(this.languages, function(language) {
        return _.isEqual(language.name, name);
      }), _.filter(this.languages, function(language) {
        return _.isEqual(language.namespace, namespace);
      }), _.filter(this.languages, function(language) {
        return _.includes(language.grammars, grammar);
      }), _.filter(this.languages, function(language) {
        return _.includes(language.extensions, extension);
      }));
    };

    return Languages;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3N0ZWZhbm8uY29yYWxsby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2xhbmd1YWdlcy9pbmRleC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBOztHQUFBO0FBQUE7QUFBQTtBQUFBLEVBR0EsWUFIQSxDQUFBO0FBQUEsTUFBQSxvQkFBQTs7QUFBQSxFQUtBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQUxKLENBQUE7O0FBQUEsRUFNQSxNQUFBLEdBQVMsSUFOVCxDQUFBOztBQUFBLEVBU0EsTUFBTSxDQUFDLE9BQVAsR0FBdUI7QUFJckIsd0JBQUEsYUFBQSxHQUFlLENBQ2IsTUFEYSxFQUViLFNBRmEsRUFHYixTQUhhLEVBSWIsR0FKYSxFQUtiLFNBTGEsRUFNYixjQU5hLEVBT2IsWUFQYSxFQVFiLEtBUmEsRUFTYixTQVRhLEVBVWIsS0FWYSxFQVdiLEtBWGEsRUFZYixHQVphLEVBYWIsS0FiYSxFQWNiLEtBZGEsRUFlYixLQWZhLEVBZ0JiLFFBaEJhLEVBaUJiLFNBakJhLEVBa0JiLElBbEJhLEVBbUJiLFNBbkJhLEVBb0JiLFlBcEJhLEVBcUJiLFNBckJhLEVBc0JiLE1BdEJhLEVBdUJiLE1BdkJhLEVBd0JiLE1BeEJhLEVBeUJiLFlBekJhLEVBMEJiLE1BMUJhLEVBMkJiLEtBM0JhLEVBNEJiLE9BNUJhLEVBNkJiLE1BN0JhLEVBOEJiLEtBOUJhLEVBK0JiLFVBL0JhLEVBZ0NiLE9BaENhLEVBaUNiLFVBakNhLEVBa0NiLFVBbENhLEVBbUNiLGFBbkNhLEVBb0NiLE9BcENhLEVBcUNiLE1BckNhLEVBc0NiLE1BdENhLEVBdUNiLEtBdkNhLEVBd0NiLFFBeENhLEVBeUNiLFFBekNhLEVBMENiLEdBMUNhLEVBMkNiLFFBM0NhLEVBNENiLE1BNUNhLEVBNkNiLE1BN0NhLEVBOENiLE1BOUNhLEVBK0NiLE1BL0NhLEVBZ0RiLFdBaERhLEVBaURiLEtBakRhLEVBa0RiLEtBbERhLEVBbURiLE1BbkRhLEVBb0RiLEtBcERhLEVBcURiLE1BckRhLEVBc0RiLFlBdERhLEVBdURiLFdBdkRhLEVBd0RiLE1BeERhLEVBeURiLEtBekRhLEVBMERiLGFBMURhLEVBMkRiLEtBM0RhLEVBNERiLFdBNURhLENBQWYsQ0FBQTs7QUErREE7QUFBQTs7T0EvREE7O0FBQUEsd0JBa0VBLFNBQUEsR0FBVyxJQWxFWCxDQUFBOztBQW9FQTtBQUFBOztPQXBFQTs7QUFBQSx3QkF1RUEsVUFBQSxHQUFZLElBdkVaLENBQUE7O0FBeUVBO0FBQUE7O09BekVBOztBQTRFYSxJQUFBLG1CQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxTQUFELEdBQWEsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxJQUFDLENBQUEsYUFBUCxFQUFzQixTQUFDLElBQUQsR0FBQTtlQUNqQyxPQUFBLENBQVMsSUFBQSxHQUFJLElBQWIsRUFEaUM7TUFBQSxDQUF0QixDQUFiLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxVQUFELEdBQWMsQ0FBQyxDQUFDLEdBQUYsQ0FBTSxJQUFDLENBQUEsU0FBUCxFQUFrQixTQUFDLFFBQUQsR0FBQTtlQUFjLFFBQVEsQ0FBQyxVQUF2QjtNQUFBLENBQWxCLENBSGQsQ0FEVztJQUFBLENBNUViOztBQWtGQTtBQUFBOztPQWxGQTs7QUFBQSx3QkFxRkEsWUFBQSxHQUFjLFNBQUMsSUFBRCxHQUFBO0FBRVosVUFBQSxtQ0FBQTtBQUFBLE1BRmMsWUFBQSxNQUFNLGlCQUFBLFdBQVcsZUFBQSxTQUFTLGlCQUFBLFNBRXhDLENBQUE7YUFBQSxDQUFDLENBQUMsS0FBRixDQUNFLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBQyxDQUFBLFNBQVYsRUFBcUIsU0FBQyxRQUFELEdBQUE7ZUFBYyxDQUFDLENBQUMsT0FBRixDQUFVLFFBQVEsQ0FBQyxJQUFuQixFQUF5QixJQUF6QixFQUFkO01BQUEsQ0FBckIsQ0FERixFQUVFLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBQyxDQUFBLFNBQVYsRUFBcUIsU0FBQyxRQUFELEdBQUE7ZUFBYyxDQUFDLENBQUMsT0FBRixDQUFVLFFBQVEsQ0FBQyxTQUFuQixFQUE4QixTQUE5QixFQUFkO01BQUEsQ0FBckIsQ0FGRixFQUdFLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBQyxDQUFBLFNBQVYsRUFBcUIsU0FBQyxRQUFELEdBQUE7ZUFBYyxDQUFDLENBQUMsUUFBRixDQUFXLFFBQVEsQ0FBQyxRQUFwQixFQUE4QixPQUE5QixFQUFkO01BQUEsQ0FBckIsQ0FIRixFQUlFLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBQyxDQUFBLFNBQVYsRUFBcUIsU0FBQyxRQUFELEdBQUE7ZUFBYyxDQUFDLENBQUMsUUFBRixDQUFXLFFBQVEsQ0FBQyxVQUFwQixFQUFnQyxTQUFoQyxFQUFkO01BQUEsQ0FBckIsQ0FKRixFQUZZO0lBQUEsQ0FyRmQsQ0FBQTs7cUJBQUE7O01BYkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/atom-beautify/src/languages/index.coffee
