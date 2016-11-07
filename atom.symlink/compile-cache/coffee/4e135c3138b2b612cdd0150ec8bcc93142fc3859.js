(function() {
  var $$$, TextEditorView, View, _ref;

  _ref = require('atom-space-pen-views'), $$$ = _ref.$$$, View = _ref.View, TextEditorView = _ref.TextEditorView;

  module.exports = function() {
    return this.div({
      tabIndex: -1,
      "class": 'atomts-rename-view'
    }, (function(_this) {
      return function() {
        _this.div({
          "class": 'block'
        }, function() {
          return _this.div(function() {
            _this.span({
              outlet: 'title'
            }, function() {
              return 'Rename Variable';
            });
            return _this.span({
              "class": 'subtle-info-message'
            }, function() {
              _this.span('Close this panel with ');
              _this.span({
                "class": 'highlight'
              }, 'esc');
              _this.span(' key. And commit with the ');
              _this.span({
                "class": 'highlight'
              }, 'enter');
              return _this.span('key.');
            });
          });
        });
        _this.div({
          "class": 'find-container block'
        }, function() {
          return _this.div({
            "class": 'editor-container'
          }, function() {
            return _this.subview('newNameEditor', new TextEditorView({
              mini: true,
              placeholderText: 'new name'
            }));
          });
        });
        _this.div({
          outlet: 'fileCount'
        }, function() {});
        _this.br({});
        return _this.div({
          "class": 'highlight-error',
          style: 'display:none',
          outlet: 'validationMessage'
        });
      };
    })(this));
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc3RlZmFuby8uYXRvbS9wYWNrYWdlcy9hdG9tLXR5cGVzY3JpcHQvdmlld3MvcmVuYW1lVmlldy5odG1sLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrQkFBQTs7QUFBQSxFQUFBLE9BQThCLE9BQUEsQ0FBUSxzQkFBUixDQUE5QixFQUFDLFdBQUEsR0FBRCxFQUFNLFlBQUEsSUFBTixFQUFZLHNCQUFBLGNBQVosQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0ksU0FBQSxHQUFBO1dBQ0ksSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLE1BQUEsUUFBQSxFQUFVLENBQUEsQ0FBVjtBQUFBLE1BQWMsT0FBQSxFQUFPLG9CQUFyQjtLQUFMLEVBQWdELENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxTQUFBLEdBQUE7QUFDNUMsUUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsVUFBQSxPQUFBLEVBQU8sT0FBUDtTQUFMLEVBQXFCLFNBQUEsR0FBQTtpQkFDakIsS0FBQyxDQUFBLEdBQUQsQ0FBSyxTQUFBLEdBQUE7QUFDRCxZQUFBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxjQUFDLE1BQUEsRUFBUSxPQUFUO2FBQU4sRUFBeUIsU0FBQSxHQUFBO3FCQUFHLGtCQUFIO1lBQUEsQ0FBekIsQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxjQUFBLE9BQUEsRUFBTyxxQkFBUDthQUFOLEVBQW9DLFNBQUEsR0FBQTtBQUNoQyxjQUFBLEtBQUMsQ0FBQSxJQUFELENBQU0sd0JBQU4sQ0FBQSxDQUFBO0FBQUEsY0FDQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsZ0JBQUEsT0FBQSxFQUFNLFdBQU47ZUFBTixFQUF5QixLQUF6QixDQURBLENBQUE7QUFBQSxjQUVBLEtBQUMsQ0FBQSxJQUFELENBQU0sNEJBQU4sQ0FGQSxDQUFBO0FBQUEsY0FHQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsZ0JBQUEsT0FBQSxFQUFNLFdBQU47ZUFBTixFQUF5QixPQUF6QixDQUhBLENBQUE7cUJBSUEsS0FBQyxDQUFBLElBQUQsQ0FBTSxNQUFOLEVBTGdDO1lBQUEsQ0FBcEMsRUFGQztVQUFBLENBQUwsRUFEaUI7UUFBQSxDQUFyQixDQUFBLENBQUE7QUFBQSxRQVVBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxVQUFBLE9BQUEsRUFBTyxzQkFBUDtTQUFMLEVBQW9DLFNBQUEsR0FBQTtpQkFDaEMsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLGtCQUFQO1dBQUwsRUFBZ0MsU0FBQSxHQUFBO21CQUM1QixLQUFDLENBQUEsT0FBRCxDQUFTLGVBQVQsRUFBOEIsSUFBQSxjQUFBLENBQWU7QUFBQSxjQUFBLElBQUEsRUFBTSxJQUFOO0FBQUEsY0FBWSxlQUFBLEVBQWlCLFVBQTdCO2FBQWYsQ0FBOUIsRUFENEI7VUFBQSxDQUFoQyxFQURnQztRQUFBLENBQXBDLENBVkEsQ0FBQTtBQUFBLFFBY0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFVBQUMsTUFBQSxFQUFPLFdBQVI7U0FBTCxFQUEyQixTQUFBLEdBQUEsQ0FBM0IsQ0FkQSxDQUFBO0FBQUEsUUFlQSxLQUFDLENBQUEsRUFBRCxDQUFJLEVBQUosQ0FmQSxDQUFBO2VBZ0JBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxVQUFDLE9BQUEsRUFBTyxpQkFBUjtBQUFBLFVBQTJCLEtBQUEsRUFBTSxjQUFqQztBQUFBLFVBQWlELE1BQUEsRUFBTyxtQkFBeEQ7U0FBTCxFQWpCNEM7TUFBQSxFQUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoRCxFQURKO0VBQUEsQ0FISixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/stefano/.atom/packages/atom-typescript/views/renameView.html.coffee
