(function() {
  var $, $$, BranchDialog, BranchView, CommitDialog, ConfirmDialog, CreateTagDialog, DeleteDialog, DiffView, FileView, FlowDialog, GitControlView, LogView, MenuView, MergeDialog, MidrebaseDialog, ProjectDialog, PushDialog, PushTagsDialog, RebaseDialog, View, child_process, git, gitWorkspaceTitle, runShell, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), View = _ref.View, $ = _ref.$, $$ = _ref.$$;

  child_process = require('child_process');

  git = require('./git');

  BranchView = require('./views/branch-view');

  DiffView = require('./views/diff-view');

  FileView = require('./views/file-view');

  LogView = require('./views/log-view');

  MenuView = require('./views/menu-view');

  ProjectDialog = require('./dialogs/project-dialog');

  BranchDialog = require('./dialogs/branch-dialog');

  CommitDialog = require('./dialogs/commit-dialog');

  ConfirmDialog = require('./dialogs/confirm-dialog');

  CreateTagDialog = require('./dialogs/create-tag-dialog');

  DeleteDialog = require('./dialogs/delete-dialog');

  MergeDialog = require('./dialogs/merge-dialog');

  FlowDialog = require('./dialogs/flow-dialog');

  PushDialog = require('./dialogs/push-dialog');

  PushTagsDialog = require('./dialogs/push-tags-dialog');

  RebaseDialog = require('./dialogs/rebase-dialog');

  MidrebaseDialog = require('./dialogs/midrebase-dialog');

  runShell = function(cmd, output) {
    var shell;
    shell = child_process.execSync(cmd, {
      encoding: 'utf8'
    }).trim();
    if (shell === output) {
      return true;
    } else if (shell !== output) {
      return false;
    }
  };

  gitWorkspaceTitle = '';

  module.exports = GitControlView = (function(_super) {
    __extends(GitControlView, _super);

    function GitControlView() {
      this.tag = __bind(this.tag, this);
      this.midrebase = __bind(this.midrebase, this);
      this.rebase = __bind(this.rebase, this);
      this.flow = __bind(this.flow, this);
      this.merge = __bind(this.merge, this);
      return GitControlView.__super__.constructor.apply(this, arguments);
    }

    GitControlView.content = function() {
      if (git.isInitialised()) {
        return this.div({
          "class": 'git-control'
        }, (function(_this) {
          return function() {
            _this.subview('menuView', new MenuView());
            _this.div({
              "class": 'content',
              outlet: 'contentView'
            }, function() {
              _this.div({
                "class": 'sidebar'
              }, function() {
                _this.subview('filesView', new FileView());
                _this.subview('localBranchView', new BranchView({
                  name: 'Local',
                  local: true
                }));
                return _this.subview('remoteBranchView', new BranchView({
                  name: 'Remote'
                }));
              });
              _this.div({
                "class": 'domain'
              }, function() {
                return _this.subview('diffView', new DiffView());
              });
              _this.subview('projectDialog', new ProjectDialog());
              _this.subview('branchDialog', new BranchDialog());
              _this.subview('commitDialog', new CommitDialog());
              _this.subview('createtagDialog', new CreateTagDialog());
              _this.subview('mergeDialog', new MergeDialog());
              _this.subview('flowDialog', new FlowDialog());
              _this.subview('pushDialog', new PushDialog());
              _this.subview('pushtagDialog', new PushTagsDialog());
              _this.subview('rebaseDialog', new RebaseDialog());
              return _this.subview('midrebaseDialog', new MidrebaseDialog());
            });
            return _this.subview('logView', new LogView());
          };
        })(this));
      } else {
        return this.div({
          "class": 'git-control'
        }, (function(_this) {
          return function() {
            return _this.subview('logView', new LogView());
          };
        })(this));
      }
    };

    GitControlView.prototype.serialize = function() {};

    GitControlView.prototype.initialize = function() {
      console.log('GitControlView: initialize');
      git.setLogger((function(_this) {
        return function(log, iserror) {
          return _this.logView.log(log, iserror);
        };
      })(this));
      this.active = true;
      this.branchSelected = null;
      if (!git.isInitialised()) {
        git.alert("> This project is not a git repository. Either open another project or create a repository.");
      } else {
        this.setWorkspaceTitle(git.getRepository().path.split('/').reverse()[1]);
      }
      this.update(true);
    };

    GitControlView.prototype.destroy = function() {
      console.log('GitControlView: destroy');
      this.active = false;
    };

    GitControlView.prototype.setWorkspaceTitle = function(title) {
      return gitWorkspaceTitle = title;
    };

    GitControlView.prototype.getTitle = function() {
      return 'git:control';
    };

    GitControlView.prototype.update = function(nofetch) {
      if (git.isInitialised()) {
        this.loadBranches();
        this.showStatus();
        this.filesView.setWorkspaceTitle(gitWorkspaceTitle);
        if (!nofetch) {
          this.fetchMenuClick();
          if (this.diffView) {
            this.diffView.clearAll();
          }
        }
      }
    };

    GitControlView.prototype.loadLog = function() {
      git.log(this.selectedBranch).then(function(logs) {
        console.log('git.log', logs);
      });
    };

    GitControlView.prototype.checkoutBranch = function(branch, remote) {
      git.checkout(branch, remote).then((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
    };

    GitControlView.prototype.branchCount = function(count) {
      var remotes;
      if (git.isInitialised()) {
        remotes = git.hasOrigin();
        this.menuView.activate('upstream', remotes && count.behind);
        this.menuView.activate('downstream', remotes && (count.ahead || !git.getRemoteBranch()));
        this.menuView.activate('remote', remotes);
      }
    };

    GitControlView.prototype.loadBranches = function() {
      if (git.isInitialised()) {
        this.selectedBranch = git.getLocalBranch();
        git.getBranches().then((function(_this) {
          return function(branches) {
            _this.branches = branches;
            _this.remoteBranchView.addAll(branches.remote);
            _this.localBranchView.addAll(branches.local, true);
          };
        })(this));
      }
    };

    GitControlView.prototype.showSelectedFiles = function() {
      this.menuView.activate('file', this.filesView.hasSelected());
      this.menuView.activate('file.merging', this.filesView.hasSelected() || git.isMerging());
    };

    GitControlView.prototype.showStatus = function() {
      git.status().then((function(_this) {
        return function(files) {
          _this.filesView.addAll(files);
        };
      })(this));
    };

    GitControlView.prototype.projectMenuClick = function() {
      this.projectDialog.activate();
    };

    GitControlView.prototype.branchMenuClick = function() {
      this.branchDialog.activate();
    };

    GitControlView.prototype.compareMenuClick = function() {
      git.diff(this.filesView.getSelected().all.join(' ')).then((function(_this) {
        return function(diffs) {
          return _this.diffView.addAll(diffs);
        };
      })(this));
    };

    GitControlView.prototype.commitMenuClick = function() {
      if (!(this.filesView.hasSelected() || git.isMerging())) {
        return;
      }
      this.commitDialog.activate();
    };

    GitControlView.prototype.commit = function() {
      var files, msg;
      if (!this.filesView.hasSelected()) {
        return;
      }
      msg = this.commitDialog.getMessage();
      files = this.filesView.getSelected();
      this.filesView.unselectAll();
      git.add(files.add).then(function() {
        return git.remove(files.rem);
      }).then(function() {
        return git.commit(msg);
      }).then((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
    };

    GitControlView.prototype.createBranch = function(branch) {
      git.createBranch(branch).then((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
    };

    GitControlView.prototype.deleteBranch = function(branch) {
      var confirmCb, forceDeleteCallback;
      confirmCb = (function(_this) {
        return function(params) {
          git.deleteBranch(params.branch).then(function() {
            return _this.update();
          });
        };
      })(this);
      forceDeleteCallback = (function(_this) {
        return function(params) {
          return git.forceDeleteBranch(params.branch).then(function() {
            return _this.update();
          });
        };
      })(this);
      this.contentView.append(new DeleteDialog({
        hdr: 'Delete Branch',
        msg: "Are you sure you want to delete the local branch '" + branch + "'?",
        cb: confirmCb,
        fdCb: forceDeleteCallback,
        branch: branch
      }));
    };

    GitControlView.prototype.fetchMenuClick = function() {
      if (git.isInitialised()) {
        if (!git.hasOrigin()) {
          return;
        }
      }
      git.fetch().then((function(_this) {
        return function() {
          return _this.loadBranches();
        };
      })(this));
    };

    GitControlView.prototype.mergeMenuClick = function() {
      this.mergeDialog.activate(this.branches.local);
    };

    GitControlView.prototype.merge = function(branch, noff) {
      git.merge(branch, noff).then((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
    };

    GitControlView.prototype.flowMenuClick = function() {
      this.flowDialog.activate(this.branches.local);
    };

    GitControlView.prototype.flow = function(type, action, branch) {
      git.flow(type, action, branch).then((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
    };

    GitControlView.prototype.ptagMenuClick = function() {
      this.pushtagDialog.activate();
    };

    GitControlView.prototype.ptag = function(remote) {
      git.ptag(remote).then((function(_this) {
        return function() {
          return _this.update(true);
        };
      })(this));
    };

    GitControlView.prototype.pullMenuClick = function() {
      git.pull().then((function(_this) {
        return function() {
          return _this.update(true);
        };
      })(this));
    };

    GitControlView.prototype.pullupMenuClick = function() {
      git.pullup().then((function(_this) {
        return function() {
          return _this.update(true);
        };
      })(this));
    };

    GitControlView.prototype.pushMenuClick = function() {
      git.getBranches().then((function(_this) {
        return function(branches) {
          return _this.pushDialog.activate(branches.remote);
        };
      })(this));
    };

    GitControlView.prototype.push = function(remote, branches, force) {
      return git.push(remote, branches, force).then((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
    };

    GitControlView.prototype.rebaseMenuClick = function() {
      var check;
      check = runShell('ls `git rev-parse --git-dir` | grep rebase || echo norebase', 'norebase');
      if (check === true) {
        this.rebaseDialog.activate(this.branches.local);
      } else if (check === false) {
        this.midrebaseDialog.activate();
      }
    };

    GitControlView.prototype.rebase = function(branch) {
      git.rebase(branch).then((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
    };

    GitControlView.prototype.midrebase = function(contin, abort, skip) {
      git.midrebase(contin, abort, skip).then((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
    };

    GitControlView.prototype.resetMenuClick = function() {
      var files;
      if (!this.filesView.hasSelected()) {
        return;
      }
      files = this.filesView.getSelected();
      return atom.confirm({
        message: "Reset will erase changes since the last commit in the selected files. Are you sure?",
        buttons: {
          Cancel: (function(_this) {
            return function() {};
          })(this),
          Reset: (function(_this) {
            return function() {
              git.reset(files.all).then(function() {
                return _this.update();
              });
            };
          })(this)
        }
      });
    };

    GitControlView.prototype.tagMenuClick = function() {
      this.createtagDialog.activate();
    };

    GitControlView.prototype.tag = function(name, href, msg) {
      git.tag(name, href, msg).then((function(_this) {
        return function() {
          return _this.update();
        };
      })(this));
    };

    return GitControlView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc3RlZmFuby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2dpdC1jb250cm9sL2xpYi9naXQtY29udHJvbC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrVEFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLE9BQWdCLE9BQUEsQ0FBUSxzQkFBUixDQUFoQixFQUFDLFlBQUEsSUFBRCxFQUFPLFNBQUEsQ0FBUCxFQUFVLFVBQUEsRUFBVixDQUFBOztBQUFBLEVBRUEsYUFBQSxHQUFnQixPQUFBLENBQVEsZUFBUixDQUZoQixDQUFBOztBQUFBLEVBSUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxPQUFSLENBSk4sQ0FBQTs7QUFBQSxFQU1BLFVBQUEsR0FBYSxPQUFBLENBQVEscUJBQVIsQ0FOYixDQUFBOztBQUFBLEVBT0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxtQkFBUixDQVBYLENBQUE7O0FBQUEsRUFRQSxRQUFBLEdBQVcsT0FBQSxDQUFRLG1CQUFSLENBUlgsQ0FBQTs7QUFBQSxFQVNBLE9BQUEsR0FBVSxPQUFBLENBQVEsa0JBQVIsQ0FUVixDQUFBOztBQUFBLEVBVUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxtQkFBUixDQVZYLENBQUE7O0FBQUEsRUFZQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSwwQkFBUixDQVpoQixDQUFBOztBQUFBLEVBYUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSx5QkFBUixDQWJmLENBQUE7O0FBQUEsRUFjQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHlCQUFSLENBZGYsQ0FBQTs7QUFBQSxFQWVBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLDBCQUFSLENBZmhCLENBQUE7O0FBQUEsRUFnQkEsZUFBQSxHQUFrQixPQUFBLENBQVEsNkJBQVIsQ0FoQmxCLENBQUE7O0FBQUEsRUFpQkEs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

//# sourceURL=/home/stefano/.dotfiles/atom.symlink/packages/git-control/lib/git-control-view.coffee
