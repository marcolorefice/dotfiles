(function() {
  var Dialog, MidrebaseDialog, git,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Dialog = require('./dialog');

  git = require('../git');

  module.exports = MidrebaseDialog = (function(_super) {
    __extends(MidrebaseDialog, _super);

    function MidrebaseDialog() {
      return MidrebaseDialog.__super__.constructor.apply(this, arguments);
    }

    MidrebaseDialog.content = function() {
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
            return _this.strong('It appears that you are in the middle of a rebase, would you like to:');
          });
          _this.div({
            "class": 'body'
          }, function() {
            _this.label('Continue the rebase');
            _this.input({
              type: 'checkbox',
              "class": 'checkbox',
              outlet: 'contin'
            });
            _this.div(function() {
              _this.label('Abort the rebase');
              return _this.input({
                type: 'checkbox',
                "class": 'checkbox',
                outlet: 'abort'
              });
            });
            return _this.div(function() {
              _this.label('Skip the patch');
              return _this.input({
                type: 'checkbox',
                "class": 'checkbox',
                outlet: 'skip'
              });
            });
          });
          return _this.div({
            "class": 'buttons'
          }, function() {
            _this.button({
              "class": 'active',
              click: 'midrebase'
            }, function() {
              _this.i({
                "class": 'icon circuit-board'
              });
              return _this.span('Rebase');
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

    MidrebaseDialog.prototype.midrebase = function() {
      this.deactivate();
      this.parentView.midrebase(this.Contin(), this.Abort(), this.Skip());
    };

    MidrebaseDialog.prototype.Contin = function() {
      return this.contin.is(':checked');
    };

    MidrebaseDialog.prototype.Abort = function() {
      return this.abort.is(':checked');
    };

    MidrebaseDialog.prototype.Skip = function() {
      return this.skip.is(':checked');
    };

    return MidrebaseDialog;

  })(Dialog);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc3RlZmFuby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2dpdC1jb250cm9sL2xpYi9kaWFsb2dzL21pZHJlYmFzZS1kaWFsb2cuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FBVCxDQUFBOztBQUFBLEVBRUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBRk4sQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixzQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxlQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxRQUFQO09BQUwsRUFBc0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNwQixVQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxTQUFQO1dBQUwsRUFBdUIsU0FBQSxHQUFBO0FBQ3JCLFlBQUEsS0FBQyxDQUFBLENBQUQsQ0FBRztBQUFBLGNBQUEsT0FBQSxFQUFPLGtCQUFQO0FBQUEsY0FBMkIsS0FBQSxFQUFPLFFBQWxDO2FBQUgsQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxNQUFELENBQVEsdUVBQVIsRUFGcUI7VUFBQSxDQUF2QixDQUFBLENBQUE7QUFBQSxVQUdBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxNQUFQO1dBQUwsRUFBb0IsU0FBQSxHQUFBO0FBQ2xCLFlBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxxQkFBUCxDQUFBLENBQUE7QUFBQSxZQUNBLEtBQUMsQ0FBQSxLQUFE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

//# sourceURL=/home/stefano/.dotfiles/atom.symlink/packages/git-control/lib/dialogs/midrebase-dialog.coffee
