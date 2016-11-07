(function() {
  var Dialog, MergeDialog, git,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Dialog = require('./dialog');

  git = require('../git');

  module.exports = MergeDialog = (function(_super) {
    __extends(MergeDialog, _super);

    function MergeDialog() {
      return MergeDialog.__super__.constructor.apply(this, arguments);
    }

    MergeDialog.content = function() {
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
            return _this.strong('Merge');
          });
          _this.div({
            "class": 'body'
          }, function() {
            _this.label('Current Branch');
            _this.input({
              "class": 'native-key-bindings',
              type: 'text',
              readonly: true,
              outlet: 'toBranch'
            });
            _this.label('Merge From Branch');
            _this.select({
              "class": 'native-key-bindings',
              outlet: 'fromBranch'
            });
            return _this.div(function() {
              _this.input({
                type: 'checkbox',
                "class": 'checkbox',
                outlet: 'noff'
              });
              return _this.label('No Fast-Forward');
            });
          });
          return _this.div({
            "class": 'buttons'
          }, function() {
            _this.button({
              "class": 'active',
              click: 'merge'
            }, function() {
              _this.i({
                "class": 'icon merge'
              });
              return _this.span('Merge');
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

    MergeDialog.prototype.activate = function(branches) {
      var branch, current, _i, _len;
      current = git.getLocalBranch();
      if (atom.config.get("git-control.noFastForward")) {
        this.noff.prop("checked", true);
      }
      this.toBranch.val(current);
      this.fromBranch.find('option').remove();
      for (_i = 0, _len = branches.length; _i < _len; _i++) {
        branch = branches[_i];
        if (branch !== current) {
          this.fromBranch.append("<option value='" + branch + "'>" + branch + "</option>");
        }
      }
      return MergeDialog.__super__.activate.call(this);
    };

    MergeDialog.prototype.merge = function() {
      this.deactivate();
      this.parentView.merge(this.fromBranch.val(), this.noFF());
    };

    MergeDialog.prototype.noFF = function() {
      return this.noff.is(':checked');
    };

    return MergeDialog;

  })(Dialog);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc3RlZmFuby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2dpdC1jb250cm9sL2xpYi9kaWFsb2dzL21lcmdlLWRpYWxvZy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0JBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUFULENBQUE7O0FBQUEsRUFFQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVIsQ0FGTixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGtDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFdBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLFFBQVA7T0FBTCxFQUFzQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3BCLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLFNBQVA7V0FBTCxFQUF1QixTQUFBLEdBQUE7QUFDckIsWUFBQSxLQUFDLENBQUEsQ0FBRCxDQUFHO0FBQUEsY0FBQSxPQUFBLEVBQU8sa0JBQVA7QUFBQSxjQUEyQixLQUFBLEVBQU8sUUFBbEM7YUFBSCxDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLE1BQUQsQ0FBUSxPQUFSLEVBRnFCO1VBQUEsQ0FBdkIsQ0FBQSxDQUFBO0FBQUEsVUFHQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sTUFBUDtXQUFMLEVBQW9CLFNBQUEsR0FBQTtBQUNsQixZQUFBLEtBQUMsQ0FBQSxLQUFELENBQU8sZ0JBQVAsQ0FBQSxDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEsS0FBRCxDQUFP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

//# sourceURL=/home/stefano/.dotfiles/atom.symlink/packages/git-control/lib/dialogs/merge-dialog.coffee
