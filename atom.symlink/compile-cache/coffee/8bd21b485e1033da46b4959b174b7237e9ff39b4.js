(function() {
  var Dialog, PushDialog, git,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Dialog = require('./dialog');

  git = require('../git');

  module.exports = PushDialog = (function(_super) {
    __extends(PushDialog, _super);

    function PushDialog() {
      return PushDialog.__super__.constructor.apply(this, arguments);
    }

    PushDialog.content = function() {
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
            return _this.strong('Push');
          });
          _this.div({
            "class": 'body'
          }, function() {
            _this.div(function() {
              return _this.button({
                click: 'upstream'
              }, function() {
                return _this.p('Push upstream', function() {
                  return _this.i({
                    "class": 'icon push'
                  });
                });
              });
            });
            _this.label('Push from branch');
            _this.input({
              "class": 'native-key-bindings',
              readonly: true,
              outlet: 'fromBranch'
            });
            _this.label('To branch');
            _this.select({
              "class": 'native-key-bindings',
              outlet: 'toBranch'
            });
            return _this.div(function() {
              _this.label('Force Push');
              return _this.input({
                type: 'checkbox',
                "class": 'checkbox',
                outlet: 'force'
              });
            });
          });
          return _this.div({
            "class": 'buttons'
          }, function() {
            _this.button({
              "class": 'active',
              click: 'push'
            }, function() {
              _this.i({
                "class": 'icon push'
              });
              return _this.span('Push');
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

    PushDialog.prototype.activate = function(remotes) {
      var remote, _i, _len;
      this.fromBranch.val(git.getLocalBranch());
      this.toBranch.find('option').remove();
      this.toBranch.append("<option value='origin'>origin</option>");
      for (_i = 0, _len = remotes.length; _i < _len; _i++) {
        remote = remotes[_i];
        this.toBranch.append("<option value='" + remote + "'>" + remote + "</option>");
      }
      return PushDialog.__super__.activate.call(this);
    };

    PushDialog.prototype.push = function() {
      var branch, remote;
      this.deactivate();
      remote = this.toBranch.val().split('/')[0];
      branch = git.getLocalBranch();
      this.parentView.push(remote, branch, this.Force());
    };

    PushDialog.prototype.upstream = function() {
      this.deactivate();
      return this.parentView.push('', '');
    };

    PushDialog.prototype.Force = function() {
      return this.force.is(':checked');
    };

    return PushDialog;

  })(Dialog);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc3RlZmFuby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2dpdC1jb250cm9sL2xpYi9kaWFsb2dzL3B1c2gtZGlhbG9nLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1QkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUNBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUROLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsVUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sUUFBUDtPQUFMLEVBQXNCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDcEIsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sU0FBUDtXQUFMLEVBQXVCLFNBQUEsR0FBQTtBQUNyQixZQUFBLEtBQUMsQ0FBQSxDQUFELENBQUc7QUFBQSxjQUFBLE9BQUEsRUFBTyxrQkFBUDtBQUFBLGNBQTBCLEtBQUEsRUFBTyxRQUFqQzthQUFILENBQUEsQ0FBQTttQkFDQSxLQUFDLENBQUEsTUFBRCxDQUFRLE1BQVIsRUFGcUI7VUFBQSxDQUF2QixDQUFBLENBQUE7QUFBQSxVQUdBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxNQUFQO1dBQUwsRUFBb0IsU0FBQSxHQUFBO0FBQ2xCLFlBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSyxTQUFBLEdBQUE7cUJBQ0gsS0FBQyxDQUFBLE1BQUQsQ0FBUTtBQUFBLGdCQUFB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

//# sourceURL=/home/stefano/.dotfiles/atom.symlink/packages/git-control/lib/dialogs/push-dialog.coffee
