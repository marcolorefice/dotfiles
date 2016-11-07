(function() {
  var Dialog, FlowDialog, git,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Dialog = require('./dialog');

  git = require('../git');

  module.exports = FlowDialog = (function(_super) {
    __extends(FlowDialog, _super);

    function FlowDialog() {
      return FlowDialog.__super__.constructor.apply(this, arguments);
    }

    FlowDialog.content = function() {
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
            return _this.strong('Workflow - GitFlow');
          });
          _this.div({
            "class": 'body'
          }, function() {
            _this.label('Git Flow ');
            _this.select({
              "class": 'native-key-bindings',
              outlet: 'flowType',
              change: 'flowTypeChange'
            });
            _this.select({
              "class": 'native-key-bindings',
              outlet: 'flowAction',
              change: 'flowActionChange'
            });
            _this.label('Branch Name:', {
              outlet: 'labelBranchName'
            });
            _this.input({
              "class": 'native-key-bindings',
              type: 'text',
              outlet: 'branchName'
            });
            _this.select({
              "class": 'native-key-bindings',
              outlet: 'branchChoose'
            });
            _this.label('Message:', {
              outlet: 'labelMessage'
            });
            _this.textarea({
              "class": 'native-key-bindings',
              outlet: 'message'
            });
            _this.input({
              "class": 'native-key-bindings',
              type: 'checkbox',
              outlet: 'noTag',
              id: 'noTag'
            });
            return _this.label('No Tag', {
              outlet: 'labelNoTag',
              "for": 'noTag'
            });
          });
          return _this.div({
            "class": 'buttons'
          }, function() {
            _this.button({
              "class": 'active',
              click: 'flow'
            }, function() {
              _this.i({
                "class": 'icon flow'
              });
              return _this.span('Ok');
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

    FlowDialog.prototype.activate = function(branches) {
      var current;
      current = git.getLocalBranch();
      this.branches = branches;
      this.flowType.find('option').remove();
      this.flowType.append("<option value='feature'>feature</option>");
      this.flowType.append("<option value='release'>release</option>");
      this.flowType.append("<option value='hotfix'>hotfix</option>");
      this.flowType.append("<option value='init'>init</option>");
      this.flowAction.find('option').remove();
      this.flowAction.append("<option value='start'>start</option>");
      this.flowAction.append("<option value='finish'>finish</option>");
      this.flowAction.append("<option value='publish'>publish</option>");
      this.flowAction.append("<option value='pull'>pull</option>");
      this.flowTypeChange();
      this.flowActionChange();
      return FlowDialog.__super__.activate.call(this);
    };

    FlowDialog.prototype.flow = function() {
      var actionSelected, branchSelected;
      this.deactivate();
      if (this.flowType.val() === "init") {
        this.parentView.flow(this.flowType.val(), '-d', '');
      } else {
        branchSelected = this.branchName.val() !== '' ? this.branchName.val() : this.branchChoose.val();
        actionSelected = this.flowAction.val();
        if ((branchSelected != null) && branchSelected !== '') {
          if (actionSelected === "finish") {
            if (this.message.val() !== '') {
              actionSelected += ' -m "' + this.message.val() + '"';
            }
            if (this.noTag.prop('checked')) {
              actionSelected += ' -n';
            }
          }
          this.parentView.flow(this.flowType.val(), actionSelected, branchSelected);
        } else {
          git.alert("> No branches selected... Git flow action not valid.");
        }
      }
    };

    FlowDialog.prototype.checkMessageNeeded = function() {
      this.message.val("");
      if (this.flowAction.val() === "finish" && (this.flowType.val() === "release" || this.flowType.val() === "hotfix")) {
        this.message.show();
        this.labelMessage.show();
      } else {
        this.message.hide();
        this.labelMessage.hide();
      }
    };

    FlowDialog.prototype.checkNoTagNeeded = function() {
      if (this.flowAction.val() === "finish" && (this.flowType.val() === "release" || this.flowType.val() === "hotfix")) {
        this.noTag.show();
        this.labelNoTag.show();
      } else {
        this.noTag.hide();
        this.labelNoTag.hide();
      }
    };

    FlowDialog.prototype.flowTypeChange = function() {
      if (this.flowType.val() === "init") {
        this.flowAction.hide();
        this.branchName.hide();
        this.branchChoose.hide();
        this.labelBranchName.hide();
      } else {
        this.flowAction.show();
        this.flowActionChange();
        this.labelBranchName.show();
      }
      this.checkMessageNeeded();
      this.checkNoTagNeeded();
    };

    FlowDialog.prototype.flowActionChange = function() {
      var branch, value, _i, _len, _ref;
      this.checkMessageNeeded();
      this.checkNoTagNeeded();
      if (this.flowAction.val() !== "start") {
        this.branchName.hide();
        this.branchName.val('');
        this.branchChoose.find('option').remove();
        _ref = this.branches;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          branch = _ref[_i];
          if (branch.indexOf(this.flowType.val()) !== -1) {
            value = branch.replace(this.flowType.val() + '/', '');
            this.branchChoose.append("<option value='" + value + "'>" + value + "</option>");
          }
        }
        if (this.branchChoose.find('option').length <= 0) {
          this.branchChoose.append("<option value=''> --no " + this.flowType.val() + " branches--</option>");
        }
        return this.branchChoose.show();
      } else {
        this.branchName.show();
        this.branchChoose.val('');
        return this.branchChoose.hide();
      }
    };

    return FlowDialog;

  })(Dialog);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc3RlZmFuby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2dpdC1jb250cm9sL2xpYi9kaWFsb2dzL2Zsb3ctZGlhbG9nLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1QkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUVBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUZOLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsVUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sUUFBUDtPQUFMLEVBQXNCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDcEIsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sU0FBUDtXQUFMLEVBQXVCLFNBQUEsR0FBQTtBQUNyQixZQUFBLEtBQUMsQ0FBQSxDQUFELENBQUc7QUFBQSxjQUFBLE9BQUEsRUFBTyxrQkFBUDtBQUFBLGNBQTJCLEtBQUEsRUFBTyxRQUFsQzthQUFILENBQUEsQ0FBQTttQkFDQSxLQUFDLENBQUEsTUFBRCxDQUFRLG9CQUFSLEVBRnFCO1VBQUEsQ0FBdkIsQ0FBQSxDQUFBO0FBQUEsVUFHQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sTUFBUDtXQUFMLEVBQW9CLFNBQUEsR0FBQTtBQUNsQixZQUFBLEtBQUMsQ0FBQSxLQUFELENBQU8sV0FBUCxDQUFBLENBQUE7QUFBQSxZQUNBLEtBQUMsQ0FBQSxNQUFELENBQVE7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

//# sourceURL=/home/stefano/.dotfiles/atom.symlink/packages/git-control/lib/dialogs/flow-dialog.coffee
