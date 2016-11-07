(function() {
  var CMD_TOGGLE, CompositeDisposable, EVT_SWITCH, GitControl, GitControlView, git, item, pane, view, views;

  GitControlView = require('./git-control-view');

  CompositeDisposable = require('atom').CompositeDisposable;

  git = require('./git');

  CMD_TOGGLE = 'git-control:toggle';

  EVT_SWITCH = 'pane-container:active-pane-item-changed';

  views = [];

  view = void 0;

  pane = void 0;

  item = void 0;

  module.exports = GitControl = {
    activate: function(state) {
      console.log('GitControl: activate');
      atom.commands.add('atom-workspace', CMD_TOGGLE, (function(_this) {
        return function() {
          return _this.toggleView();
        };
      })(this));
      atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(item) {
          return _this.updateViews();
        };
      })(this));
      atom.project.onDidChangePaths((function(_this) {
        return function() {
          return _this.updatePaths();
        };
      })(this));
    },
    deactivate: function() {
      console.log('GitControl: deactivate');
    },
    toggleView: function() {
      console.log('GitControl: toggle');
      if (!(view && view.active)) {
        view = new GitControlView();
        views.push(view);
        pane = atom.workspace.getActivePane();
        item = pane.addItem(view, 0);
        pane.activateItem(item);
      } else {
        pane.destroyItem(item);
      }
    },
    updatePaths: function() {
      git.setProjectIndex(0);
    },
    updateViews: function() {
      var activeView, v, _i, _len;
      activeView = atom.workspace.getActivePane().getActiveItem();
      for (_i = 0, _len = views.length; _i < _len; _i++) {
        v = views[_i];
        if (v === activeView) {
          v.update();
        }
      }
    },
    updatePaths: function() {
      git.setProjectIndex(0);
    },
    serialize: function() {},
    config: {
      showGitFlowButton: {
        title: 'Show GitFlow button',
        description: 'Show the GitFlow button in the Git Control toolbar',
        type: 'boolean',
        "default": true
      },
      noFastForward: {
        title: 'Disable Fast Forward',
        description: 'Disable Fast Forward for default at Git Merge',
        type: 'boolean',
        "default": false
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc3RlZmFuby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2dpdC1jb250cm9sL2xpYi9naXQtY29udHJvbC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscUdBQUE7O0FBQUEsRUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUixDQUFqQixDQUFBOztBQUFBLEVBQ0Msc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQURELENBQUE7O0FBQUEsRUFFQSxHQUFBLEdBQU0sT0FBQSxDQUFRLE9BQVIsQ0FGTixDQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLG9CQUpiLENBQUE7O0FBQUEsRUFLQSxVQUFBLEdBQWEseUNBTGIsQ0FBQTs7QUFBQSxFQU9BLEtBQUEsR0FBUSxFQVBSLENBQUE7O0FBQUEsRUFRQSxJQUFBLEdBQU8sTUFSUCxDQUFBOztBQUFBLEVBU0EsSUFBQSxHQUFPLE1BVFAsQ0FBQTs7QUFBQSxFQVVBLElBQUEsR0FBTyxNQVZQLENBQUE7O0FBQUEsRUFZQSxNQUFNLENBQUMsT0FBUCxHQUFpQixVQUFBLEdBRWY7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxzQkFBWixDQUFBLENBQUE7QUFBQSxNQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsVUFBcEMsRUFBZ0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsVUFBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoRCxDQUZBLENBQUE7QUFBQSxNQUdBLElBQUksQ0FBQyxTQUFTLENBQUMseUJBQWYsQ0FBeUMsQ0FBQSxTQUFB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

//# sourceURL=/home/stefano/.dotfiles/atom.symlink/packages/git-control/lib/git-control.coffee
