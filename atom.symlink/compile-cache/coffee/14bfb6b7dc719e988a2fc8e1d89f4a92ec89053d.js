(function() {
  var atomRefresh, callGit, cwd, fs, getBranches, git, logcb, noop, parseDefault, parseDiff, parseStatus, path, projectIndex, q, repo, setProjectIndex;

  fs = require('fs');

  path = require('path');

  git = require('git-promise');

  q = require('q');

  logcb = function(log, error) {
    return console[error ? 'error' : 'log'](log);
  };

  repo = void 0;

  cwd = void 0;

  projectIndex = 0;

  noop = function() {
    return q.fcall(function() {
      return true;
    });
  };

  atomRefresh = function() {
    repo.refreshStatus();
  };

  getBranches = function() {
    return q.fcall(function() {
      var branches, h, refs, _i, _j, _len, _len1, _ref, _ref1;
      branches = {
        local: [],
        remote: [],
        tags: []
      };
      refs = repo.getReferences();
      _ref = refs.heads;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        h = _ref[_i];
        branches.local.push(h.replace('refs/heads/', ''));
      }
      _ref1 = refs.remotes;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        h = _ref1[_j];
        branches.remote.push(h.replace('refs/remotes/', ''));
      }
      return branches;
    });
  };

  setProjectIndex = function(index) {
    repo = void 0;
    cwd = void 0;
    projectIndex = index;
    if (atom.project) {
      repo = atom.project.getRepositories()[index];
      cwd = repo ? repo.getWorkingDirectory() : void 0;
    }
  };

  setProjectIndex(projectIndex);

  parseDiff = function(data) {
    return q.fcall(function() {
      var diff, diffs, line, _i, _len, _ref;
      diffs = [];
      diff = {};
      _ref = data.split('\n');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        if (line.length) {
          switch (false) {
            case !/^diff --git /.test(line):
              diff = {
                lines: [],
                added: 0,
                removed: 0
              };
              diff['diff'] = line.replace(/^diff --git /, '');
              diffs.push(diff);
              break;
            case !/^index /.test(line):
              diff['index'] = line.replace(/^index /, '');
              break;
            case !/^--- /.test(line):
              diff['---'] = line.replace(/^--- [a|b]\//, '');
              break;
            case !/^\+\+\+ /.test(line):
              diff['+++'] = line.replace(/^\+\+\+ [a|b]\//, '');
              break;
            default:
              diff['lines'].push(line);
              if (/^\+/.test(line)) {
                diff['added']++;
              }
              if (/^-/.test(line)) {
                diff['removed']++;
              }
          }
        }
      }
      return diffs;
    });
  };

  parseStatus = function(data) {
    return q.fcall(function() {
      var files, line, name, type, _i, _len, _ref;
      files = [];
      _ref = data.split('\n');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        if (!line.length) {
          continue;
        }
        type = line.substring(0, 2);
        name = line.substring(2).trim().replace(new RegExp('\"', 'g'), '');
        files.push({
          name: name,
          selected: (function() {
            switch (type[type.length - 1]) {
              case 'C':
              case 'M':
              case 'R':
              case 'D':
              case 'A':
                return true;
              default:
                return false;
            }
          })(),
          type: (function() {
            switch (type[type.length - 1]) {
              case 'A':
                return 'added';
              case 'C':
                return 'modified';
              case 'D':
                return 'deleted';
              case 'M':
                return 'modified';
              case 'R':
                return 'modified';
              case 'U':
                return 'conflict';
              case '?':
                return 'new';
              default:
                return 'unknown';
            }
          })()
        });
      }
      return files;
    });
  };

  parseDefault = function(data) {
    return q.fcall(function() {
      return true;
    });
  };

  callGit = function(cmd, parser, nodatalog) {
    logcb("> git " + cmd);
    return git(cmd, {
      cwd: cwd
    }).then(function(data) {
      if (!nodatalog) {
        logcb(data);
      }
      return parser(data);
    }).fail(function(e) {
      logcb(e.stdout, true);
      logcb(e.message, true);
    });
  };

  module.exports = {
    isInitialised: function() {
      return cwd;
    },
    alert: function(text) {
      logcb(text);
    },
    setLogger: function(cb) {
      logcb = cb;
    },
    setProjectIndex: setProjectIndex,
    getProjectIndex: function() {
      return projectIndex;
    },
    getRepository: function() {
      return repo;
    },
    count: function(branch) {
      return repo.getAheadBehindCount(branch);
    },
    getLocalBranch: function() {
      return repo.getShortHead();
    },
    getRemoteBranch: function() {
      return repo.getUpstreamBranch();
    },
    isMerging: function() {
      return fs.existsSync(path.join(repo.path, 'MERGE_HEAD'));
    },
    getBranches: getBranches,
    hasRemotes: function() {
      var refs;
      refs = repo.getReferences();
      return refs && refs.remotes && refs.remotes.length;
    },
    hasOrigin: function() {
      return repo.getOriginURL() !== null;
    },
    add: function(files) {
      if (!files.length) {
        return noop();
      }
      return callGit("add -- " + (files.join(' ')), function(data) {
        atomRefresh();
        return parseDefault(data);
      });
    },
    commit: function(message) {
      message = message || Date.now();
      message = message.replace(/"/g, '\\"');
      return callGit("commit --allow-empty-message -m \"" + message + "\"", function(data) {
        atomRefresh();
        return parseDefault(data);
      });
    },
    checkout: function(branch, remote) {
      return callGit("checkout " + (remote ? '--track ' : '') + branch, function(data) {
        atomRefresh();
        return parseDefault(data);
      });
    },
    createBranch: function(branch) {
      return callGit("branch " + branch, function(data) {
        return callGit("checkout " + branch, function(data) {
          atomRefresh();
          return parseDefault(data);
        });
      });
    },
    deleteBranch: function(branch) {
      return callGit("branch -d " + branch, function(data) {
        atomRefresh();
        return parseDefault;
      });
    },
    forceDeleteBranch: function(branch) {
      return callGit("branch -D " + branch, function(data) {
        atomRefresh();
        return parseDefault;
      });
    },
    diff: function(file) {
      return callGit("--no-pager diff " + (file || ''), parseDiff, true);
    },
    fetch: function() {
      return callGit("fetch --prune", parseDefault);
    },
    merge: function(branch, noff) {
      var noffOutput;
      noffOutput = noff ? "--no-ff" : "";
      return callGit("merge " + noffOutput + " " + branch, function(data) {
        atomRefresh();
        return parseDefault(data);
      });
    },
    ptag: function(remote) {
      return callGit("push " + remote + " --tags", function(data) {
        atomRefresh();
        return parseDefault(data);
      });
    },
    pullup: function() {
      return callGit("pull upstream $(git branch | grep '^\*' | sed -n 's/\*[ ]*//p')", function(data) {
        atomRefresh();
        return parseDefault(data);
      });
    },
    pull: function() {
      return callGit("pull", function(data) {
        atomRefresh();
        return parseDefault(data);
      });
    },
    flow: function(type, action, branch) {
      return callGit("flow " + type + " " + action + " " + branch, function(data) {
        atomRefresh();
        return parseDefault(data);
      });
    },
    push: function(remote, branch, force) {
      var cmd, forced;
      forced = force ? "-f" : "";
      cmd = "-c push.default=simple push " + remote + " " + branch + " " + forced + " --porcelain";
      return callGit(cmd, function(data) {
        atomRefresh();
        return parseDefault(data);
      });
    },
    log: function(branch) {
      return callGit("log origin/" + (repo.getUpstreamBranch() || 'master') + ".." + branch, parseDefault);
    },
    rebase: function(branch) {
      return callGit("rebase " + branch, function(data) {
        atomRefresh();
        return parseDefault(data);
      });
    },
    midrebase: function(contin, abort, skip) {
      if (contin) {
        return callGit("rebase --continue", function(data) {
          atomRefresh();
          return parseDefault(data);
        });
      } else if (abort) {
        return callGit("rebase --abort", function(data) {
          atomRefresh();
          return parseDefault(data);
        });
      } else if (skip) {
        return callGit("rebase --skip", function(data) {
          atomRefresh();
          return parseDefault(data);
        });
      }
    },
    reset: function(files) {
      return callGit("checkout -- " + (files.join(' ')), function(data) {
        atomRefresh();
        return parseDefault(data);
      });
    },
    remove: function(files) {
      if (!files.length) {
        return noop();
      }
      return callGit("rm -- " + (files.join(' ')), function(data) {
        atomRefresh();
        return parseDefault(true);
      });
    },
    status: function() {
      return callGit('status --porcelain --untracked-files=all', parseStatus);
    },
    tag: function(name, href, msg) {
      return callGit("tag -a " + name + " -m '" + msg + "' " + href, function(data) {
        atomRefresh();
        return parseDefault(data);
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc3RlZmFuby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2dpdC1jb250cm9sL2xpYi9naXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdKQUFBOztBQUFBLEVBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFHQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGFBQVIsQ0FITixDQUFBOztBQUFBLEVBSUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxHQUFSLENBSkosQ0FBQTs7QUFBQSxFQU1BLEtBQUEsR0FBUSxTQUFDLEdBQUQsRUFBTSxLQUFOLEdBQUE7V0FDTixPQUFRLENBQUcsS0FBSCxHQUFjLE9BQWQsR0FBMkIsS0FBM0IsQ0FBUixDQUEwQyxHQUExQyxFQURNO0VBQUEsQ0FOUixDQUFBOztBQUFBLEVBU0EsSUFBQSxHQUFPLE1BVFAsQ0FBQTs7QUFBQSxFQVVBLEdBQUEsR0FBTSxNQVZOLENBQUE7O0FBQUEsRUFXQSxZQUFBLEdBQWUsQ0FYZixDQUFBOztBQUFBLEVBYUEsSUFBQSxHQUFPLFNBQUEsR0FBQTtXQUFHLENBQUMsQ0FBQyxLQUFGLENBQVEsU0FBQSxHQUFBO2FBQUcsS0FBSDtJQUFBLENBQVIsRUFBSDtFQUFBLENBYlAsQ0FBQTs7QUFBQSxFQWVBLFdBQUEsR0FBYyxTQUFBLEdBQUE7QUFDWixJQUFBLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBQSxDQURZO0VBQUEsQ0FmZCxDQUFBOztBQUFBLEVBbUJBLFdBQUEsR0FBYyxTQUFBLEdBQUE7V0FBRyxDQUFDLENBQUMsS0FBRixDQUFRLFNBQUEsR0FBQTtBQUN2QixVQUFBLG1EQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVc7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

//# sourceURL=/home/stefano/.dotfiles/atom.symlink/packages/git-control/lib/git.coffee
