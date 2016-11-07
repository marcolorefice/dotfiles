(function() {
  var Dialog, ProjectDialog, git, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Dialog = require('./dialog');

  git = require('../git');

  path = require('path');

  module.exports = ProjectDialog = (function(_super) {
    __extends(ProjectDialog, _super);

    function ProjectDialog() {
      return ProjectDialog.__super__.constructor.apply(this, arguments);
    }

    ProjectDialog.content = function() {
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
            return _this.strong('Project');
          });
          _this.div({
            "class": 'body'
          }, function() {
            _this.label('Current Project');
            return _this.select({
              outlet: 'projectList'
            });
          });
          return _this.div({
            "class": 'buttons'
          }, function() {
            _this.button({
              "class": 'active',
              click: 'changeProject'
            }, function() {
              _this.i({
                "class": 'icon icon-repo-pull'
              });
              return _this.span('Change');
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

    ProjectDialog.prototype.activate = function() {
      var projectIndex, projectList, repo, _fn, _i, _len, _ref;
      projectIndex = 0;
      projectList = this.projectList;
      projectList.html('');
      _ref = atom.project.getRepositories();
      _fn = function(repo) {
        var option;
        if (repo) {
          option = document.createElement("option");
          option.value = projectIndex;
          option.text = path.basename(path.resolve(repo.path, '..'));
          projectList.append(option);
        }
        return projectIndex = projectIndex + 1;
      };
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        repo = _ref[_i];
        _fn(repo);
      }
      projectList.val(git.getProjectIndex);
      return ProjectDialog.__super__.activate.call(this);
    };

    ProjectDialog.prototype.changeProject = function() {
      var repo;
      this.deactivate();
      git.setProjectIndex(this.projectList.val());
      repo = git.getRepository();
      this.parentView.setWorkspaceTitle(repo.path.split('/').reverse()[1]);
      this.parentView.update();
    };

    return ProjectDialog;

  })(Dialog);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc3RlZmFuby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2dpdC1jb250cm9sL2xpYi9kaWFsb2dzL3Byb2plY3QtZGlhbG9nLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnQ0FBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUVBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUZOLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLG9DQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLFFBQVA7T0FBTCxFQUFzQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3BCLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLFNBQVA7V0FBTCxFQUF1QixTQUFBLEdBQUE7QUFDckIsWUFBQSxLQUFDLENBQUEsQ0FBRCxDQUFHO0FBQUEsY0FBQSxPQUFBLEVBQU8sa0JBQVA7QUFBQSxjQUEyQixLQUFBLEVBQU8sUUFBbEM7YUFBSCxDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLE1BQUQsQ0FBUSxTQUFSLEVBRnFCO1VBQUEsQ0FBdkIsQ0FBQSxDQUFBO0FBQUEsVUFHQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sTUFBUDtXQUFMLEVBQW9CLFNBQUEsR0FBQTtBQUNsQixZQUFBLEtBQUMsQ0FBQSxLQUFELENB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

//# sourceURL=/home/stefano/.dotfiles/atom.symlink/packages/git-control/lib/dialogs/project-dialog.coffee
