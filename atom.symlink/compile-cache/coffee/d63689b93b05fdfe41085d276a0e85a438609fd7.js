(function() {
  var defaultIndentChar, defaultIndentSize, defaultIndentWithTabs, scope, softTabs, tabLength, _ref, _ref1;

  scope = ['text.html'];

  tabLength = (_ref = typeof atom !== "undefined" && atom !== null ? atom.config.get('editor.tabLength', {
    scope: scope
  }) : void 0) != null ? _ref : 4;

  softTabs = (_ref1 = typeof atom !== "undefined" && atom !== null ? atom.config.get('editor.softTabs', {
    scope: scope
  }) : void 0) != null ? _ref1 : true;

  defaultIndentSize = (softTabs ? tabLength : 1);

  defaultIndentChar = (softTabs ? " " : "\t");

  defaultIndentWithTabs = !softTabs;

  module.exports = {
    name: "HTML",
    namespace: "html",

    /*
    Supported Grammars
     */
    grammars: ["HTML"],

    /*
    Supported extensions
     */
    extensions: ["html"],
    options: {
      indent_inner_html: {
        type: 'boolean',
        "default": false,
        description: "Indent <head> and <body> sections."
      },
      indent_size: {
        type: 'integer',
        "default": defaultIndentSize,
        minimum: 0,
        description: "Indentation size/length"
      },
      indent_char: {
        type: 'string',
        "default": defaultIndentChar,
        description: "Indentation character"
      },
      brace_style: {
        type: 'string',
        "default": "collapse",
        "enum": ["collapse", "expand", "end-expand", "none"],
        description: "[collapse|expand|end-expand|none]"
      },
      indent_scripts: {
        type: 'string',
        "default": "normal",
        "enum": ["keep", "separate", "normal"],
        description: "[keep|separate|normal]"
      },
      wrap_line_length: {
        type: 'integer',
        "default": 250,
        description: "Maximum characters per line (0 disables)"
      },
      wrap_attributes: {
        type: 'string',
        "default": "auto",
        "enum": ["auto", "force"],
        description: "Wrap attributes to new lines [auto|force]"
      },
      wrap_attributes_indent_size: {
        type: 'integer',
        "default": defaultIndentSize,
        minimum: 0,
        description: "Indent wrapped attributes to after N characters"
      },
      preserve_newlines: {
        type: 'boolean',
        "default": true,
        description: "Preserve line-breaks"
      },
      max_preserve_newlines: {
        type: 'integer',
        "default": 10,
        description: "Number of line-breaks to be preserved in one chunk"
      },
      unformatted: {
        type: 'array',
        "default": ['a', 'abbr', 'area', 'audio', 'b', 'bdi', 'bdo', 'br', 'button', 'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'map', 'mark', 'math', 'meter', 'noscript', 'object', 'output', 'progress', 'q', 'ruby', 's', 'samp', 'select', 'small', 'span', 'strong', 'sub', 'sup', 'svg', 'template', 'textarea', 'time', 'u', 'var', 'video', 'wbr', 'text', 'acronym', 'address', 'big', 'dt', 'ins', 'small', 'strike', 'tt', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        items: {
          type: 'string'
        },
        description: "List of tags (defaults to inline) that should not be reformatted"
      },
      end_with_newline: {
        type: 'boolean',
        "default": false,
        description: "End output with newline"
      },
      extra_liners: {
        type: 'array',
        "default": ['head', 'body', '/html'],
        items: {
          type: 'string'
        },
        description: "List of tags (defaults to [head,body,/html] that should have an extra newline before them."
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3N0ZWZhbm8uY29yYWxsby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2xhbmd1YWdlcy9odG1sLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUNBO0FBQUEsTUFBQSxvR0FBQTs7QUFBQSxFQUFBLEtBQUEsR0FBUSxDQUFDLFdBQUQsQ0FBUixDQUFBOztBQUFBLEVBQ0EsU0FBQTs7Z0NBQWlFLENBRGpFLENBQUE7O0FBQUEsRUFFQSxRQUFBOztpQ0FBK0QsSUFGL0QsQ0FBQTs7QUFBQSxFQUdBLGlCQUFBLEdBQW9CLENBQUksUUFBSCxHQUFpQixTQUFqQixHQUFnQyxDQUFqQyxDQUhwQixDQUFBOztBQUFBLEVBSUEsaUJBQUEsR0FBb0IsQ0FBSSxRQUFILEdBQWlCLEdBQWpCLEdBQTBCLElBQTNCLENBSnBCLENBQUE7O0FBQUEsRUFLQSxxQkFBQSxHQUF3QixDQUFBLFFBTHhCLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQUFBLElBRWYsSUFBQSxFQUFNLE1BRlM7QUFBQSxJQUdmLFNBQUEsRUFBVyxNQUhJO0FBS2Y7QUFBQTs7T0FMZTtBQUFBLElBUWYsUUFBQSxFQUFVLENBQ1IsTUFEUSxDQVJLO0FBWWY7QUFBQTs7T0FaZTtBQUFBLElBZWYsVUFBQSxFQUFZLENBQ1YsTUFEVSxDQWZHO0FBQUEsSUFtQmYsT0FBQSxFQUNFO0FBQUEsTUFBQSxpQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSxvQ0FGYjtPQURGO0FBQUEsTUFJQSxXQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsaUJBRFQ7QUFBQSxRQUVBLE9B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

//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/atom-beautify/src/languages/html.coffee
