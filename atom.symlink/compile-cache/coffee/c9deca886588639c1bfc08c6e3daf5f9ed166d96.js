(function() {
  "use strict";
  var Beautifier, PrettyDiff,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Beautifier = require('./beautifier');

  module.exports = PrettyDiff = (function(_super) {
    __extends(PrettyDiff, _super);

    function PrettyDiff() {
      return PrettyDiff.__super__.constructor.apply(this, arguments);
    }

    PrettyDiff.prototype.name = "Pretty Diff";

    PrettyDiff.prototype.link = "https://github.com/prettydiff/prettydiff";

    PrettyDiff.prototype.options = {
      _: {
        inchar: [
          "indent_with_tabs", "indent_char", function(indent_with_tabs, indent_char) {
            if (indent_with_tabs === true) {
              return "\t";
            } else {
              return indent_char;
            }
          }
        ],
        insize: [
          "indent_with_tabs", "indent_size", function(indent_with_tabs, indent_size) {
            if (indent_with_tabs === true) {
              return 1;
            } else {
              return indent_size;
            }
          }
        ],
        objsort: function(objsort) {
          return objsort || false;
        },
        preserve: [
          'preserve_newlines', function(preserve_newlines) {
            if (preserve_newlines === true) {
              return "all";
            } else {
              return "none";
            }
          }
        ],
        cssinsertlines: "newline_between_rules",
        comments: [
          "indent_comments", function(indent_comments) {
            if (indent_comments === false) {
              return "noindent";
            } else {
              return "indent";
            }
          }
        ],
        force: "force_indentation",
        quoteConvert: "convert_quotes",
        vertical: [
          'align_assignments', function(align_assignments) {
            if (align_assignments === true) {
              return "all";
            } else {
              return "none";
            }
          }
        ],
        wrap: "wrap_line_length",
        space: "space_after_anon_function",
        noleadzero: "no_lead_zero",
        endcomma: "end_with_comma",
        methodchain: [
          'break_chained_methods', function(break_chained_methods) {
            if (break_chained_methods === true) {
              return false;
            } else {
              return true;
            }
          }
        ],
        ternaryline: "preserve_ternary_lines",
        bracepadding: "space_in_paren"
      },
      CSV: true,
      Coldfusion: true,
      ERB: true,
      EJS: true,
      HTML: true,
      Handlebars: true,
      Nunjucks: true,
      XML: true,
      SVG: true,
      Spacebars: true,
      JSX: true,
      JavaScript: true,
      CSS: true,
      SCSS: true,
      JSON: true,
      TSS: true,
      Twig: true,
      LESS: true,
      Swig: true,
      "UX Markup": true,
      Visualforce: true,
      "Riot.js": true,
      XTemplate: true
    };

    PrettyDiff.prototype.beautify = function(text, language, options) {
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var args, lang, output, prettydiff, result, _;
          prettydiff = require("prettydiff");
          _ = require('lodash');
          lang = "auto";
          switch (language) {
            case "CSV":
              lang = "csv";
              break;
            case "Coldfusion":
              lang = "html";
              break;
            case "EJS":
            case "Twig":
              lang = "ejs";
              break;
            case "ERB":
              lang = "html_ruby";
              break;
            case "Handlebars":
            case "Mustache":
            case "Spacebars":
            case "Swig":
            case "Riot.js":
            case "XTemplate":
              lang = "handlebars";
              break;
            case "SGML":
              lang = "markup";
              break;
            case "XML":
            case "Visualforce":
            case "SVG":
              lang = "xml";
              break;
            case "HTML":
            case "Nunjucks":
            case "UX Markup":
              lang = "html";
              break;
            case "JavaScript":
              lang = "javascript";
              break;
            case "JSON":
              lang = "json";
              break;
            case "JSX":
              lang = "jsx";
              break;
            case "JSTL":
              lang = "jsp";
              break;
            case "CSS":
              lang = "css";
              break;
            case "LESS":
              lang = "less";
              break;
            case "SCSS":
              lang = "scss";
              break;
            case "TSS":
              lang = "tss";
              break;
            default:
              lang = "auto";
          }
          args = {
            source: text,
            lang: lang,
            mode: "beautify"
          };
          _.merge(options, args);
          _this.verbose('prettydiff', options);
          output = prettydiff.api(options);
          result = output[0];
          return resolve(result);
        };
      })(this));
    };

    return PrettyDiff;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3N0ZWZhbm8uY29yYWxsby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL3ByZXR0eWRpZmYuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFlBQUEsQ0FBQTtBQUFBLE1BQUEsc0JBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUixDQURiLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUF1QjtBQUNyQixpQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEseUJBQUEsSUFBQSxHQUFNLGFBQU4sQ0FBQTs7QUFBQSx5QkFDQSxJQUFBLEdBQU0sMENBRE4sQ0FBQTs7QUFBQSx5QkFFQSxPQUFBLEdBQVM7QUFBQSxNQUVQLENBQUEsRUFDRTtBQUFBLFFBQUEsTUFBQSxFQUFRO1VBQUMsa0JBQUQsRUFBcUIsYUFBckIsRUFBb0MsU0FBQyxnQkFBRCxFQUFtQixXQUFuQixHQUFBO0FBQzFDLFlBQUEsSUFBSSxnQkFBQSxLQUFvQixJQUF4QjtxQkFDRSxLQURGO2FBQUEsTUFBQTtxQkFDWSxZQURaO2FBRDBDO1VBQUEsQ0FBcEM7U0FBUjtBQUFBLFFBSUEsTUFBQSxFQUFRO1VBQUMsa0JBQUQsRUFBcUIsYUFBckIsRUFBb0MsU0FBQyxnQkFBRCxFQUFtQixXQUFuQixHQUFBO0FBQzFDLFlBQUEsSUFBSSxnQkFBQSxLQUFvQixJQUF4QjtxQkFDRSxFQURGO2FBQUEsTUFBQTtxQkFDUyxZQURUO2FBRDBDO1VBQUEsQ0FBcEM7U0FKUjtBQUFBLFFBUUEsT0FBQSxFQUFTLFNBQUMsT0FBRCxHQUFBO2lCQUNQLE9BQUEsSUFBVyxNQURKO1FBQUEsQ0FSVDtBQUFBLFFBVUEsUUFBQSxFQUFVO1VBQUMsbUJBQUQs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

//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/atom-beautify/src/beautifiers/prettydiff.coffee
