(function() {
  var CreateTagDialog, Dialog,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Dialog = require('./dialog');

  module.exports = CreateTagDialog = (function(_super) {
    __extends(CreateTagDialog, _super);

    function CreateTagDialog() {
      return CreateTagDialog.__super__.constructor.apply(this, arguments);
    }

    CreateTagDialog.content = function() {
      return this.div({
        "class": 'dialog'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'heading'
          }, function() {
            _this.i({
              "class": 'icon x clickable',
              click: 'cancel'
            });
            return _this.strong('Tag');
          });
          _this.div({
            "class": 'body'
          }, function() {
            _this.label('Tag name');
            _this.input({
              "class": 'native-key-bindings',
              type: 'text',
              outlet: 'name'
            });
            _this.label('commit ref');
            _this.input({
              "class": 'native-key-bindings',
              type: 'text',
              outlet: 'href'
            });
            _this.label('Tag Message');
            return _this.textarea({
              "class": 'native-key-bindings',
              outlet: 'msg'
            });
          });
          return _this.div({
            "class": 'buttons'
          }, function() {
            _this.button({
              "class": 'active',
              click: 'tag'
            }, function() {
              _this.i({
                "class": 'icon tag'
              });
              return _this.span('Create Tag');
            });
            return _this.button({
              click: 'cancel'
            }, function() {
              _this.i({
                "class": 'icon x'
              });
              return _this.span('Cancel');
            });
          });
        };
      })(this));
    };

    CreateTagDialog.prototype.tag = function() {
      this.deactivate();
      this.parentView.tag(this.Name(), this.Href(), this.Msg());
    };

    CreateTagDialog.prototype.Name = function() {
      return this.name.val();
    };

    CreateTagDialog.prototype.Href = function() {
      return this.href.val();
    };

    CreateTagDialog.prototype.Msg = function() {
      return this.msg.val();
    };

    return CreateTagDialog;

  })(Dialog);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc3RlZmFuby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2dpdC1jb250cm9sL2xpYi9kaWFsb2dzL2NyZWF0ZS10YWctZGlhbG9nLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1QkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixzQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxlQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxRQUFQO09BQUwsRUFBc0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNwQixVQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxTQUFQO1dBQUwsRUFBdUIsU0FBQSxHQUFBO0FBQ3JCLFlBQUEsS0FBQyxDQUFBLENBQUQsQ0FBRztBQUFBLGNBQUEsT0FBQSxFQUFPLGtCQUFQO0FBQUEsY0FBMkIsS0FBQSxFQUFPLFFBQWxDO2FBQUgsQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxNQUFELENBQVEsS0FBUixFQUZxQjtVQUFBLENBQXZCLENBQUEsQ0FBQTtBQUFBLFVBR0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLE1BQVA7V0FBTCxFQUFvQixTQUFBLEdBQUE7QUFDbEIsWUFBQSxLQUFDLENBQUEsS0FBRCxDQUFPLFVBQVAsQ0FBQSxDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEsS0FBRCxDQUFPO0FBQUEsY0FBQSxPQUFBLEVBQU8scUJBQVA7QUFBQSxjQUE4QixJQUFB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

//# sourceURL=/home/stefano/.dotfiles/atom.symlink/packages/git-control/lib/dialogs/create-tag-dialog.coffee
