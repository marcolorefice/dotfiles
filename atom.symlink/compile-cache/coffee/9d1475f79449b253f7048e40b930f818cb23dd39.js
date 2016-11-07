(function() {
  var UrlReplace;

  module.exports = UrlReplace = (function() {
    function UrlReplace() {
      var _ref;
      this.repoInfo = this.parseUrl((_ref = this.getRepositoryForActiveItem()) != null ? _ref.getOriginURL() : void 0);
      this.info = {
        'repo-name': this.repoInfo.name,
        'repo-owner': this.repoInfo.owner,
        'atom-version': atom.getVersion()
      };
    }

    UrlReplace.prototype.replace = function(url) {
      var m, matchedText, re;
      re = /({[^}]*})/;
      m = re.exec(url);
      while (m) {
        matchedText = m[0];
        url = url.replace(m[0], this.getInfo(matchedText));
        m = re.exec(url);
      }
      return url;
    };

    UrlReplace.prototype.getInfo = function(key) {
      key = key.replace(/{([^}]*)}/, "$1");
      if (this.info[key] != null) {
        return this.info[key];
      } else {
        return key;
      }
    };

    UrlReplace.prototype.getRepositoryDetail = function() {
      return atom.project.getRepositories();
    };

    UrlReplace.prototype.getActiveItemPath = function() {
      var _ref;
      return (_ref = this.getActiveItem()) != null ? typeof _ref.getPath === "function" ? _ref.getPath() : void 0 : void 0;
    };

    UrlReplace.prototype.getRepositoryForActiveItem = function() {
      var repo, rootDir, rootDirIndex, _i, _len, _ref;
      rootDir = atom.project.relativizePath(this.getActiveItemPath())[0];
      rootDirIndex = atom.project.getPaths().indexOf(rootDir);
      if (rootDirIndex >= 0) {
        return atom.project.getRepositories()[rootDirIndex];
      } else {
        _ref = atom.project.getRepositories();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          repo = _ref[_i];
          if (repo) {
            return repo;
          }
        }
      }
    };

    UrlReplace.prototype.getActiveItem = function() {
      return atom.workspace.getActivePaneItem();
    };

    UrlReplace.prototype.parseUrl = function(url) {
      var m, re, repoInfo;
      repoInfo = {
        owner: '',
        name: ''
      };
      if (url == null) {
        return repoInfo;
      }
      if (url.indexOf('http' >= 0)) {
        re = /github\.com\/([^\/]*)\/([^\/]*)\.git/;
      }
      if (url.indexOf('git@') >= 0) {
        re = /:([^\/]*)\/([^\/]*)\.git/;
      }
      m = re.exec(url);
      if (m) {
        return {
          owner: m[1],
          name: m[2]
        };
      } else {
        return repoInfo;
      }
    };

    return UrlReplace;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc3RlZmFuby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2ZsZXgtdG9vbC1iYXIvbGliL3VybC1yZXBsYWNlLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxVQUFBOztBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsb0JBQUEsR0FBQTtBQUNYLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFDLENBQUEsUUFBRCwwREFBdUMsQ0FBRSxZQUEvQixDQUFBLFVBQVYsQ0FBWixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsSUFBRCxHQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUF2QjtBQUFBLFFBQ0EsWUFBQSxFQUFjLElBQUMsQ0FBQSxRQUFRLENBQUMsS0FEeEI7QUFBQSxRQUVBLGNBQUEsRUFBZ0IsSUFBSSxDQUFDLFVBQUwsQ0FBQSxDQUZoQjtPQUZGLENBRFc7SUFBQSxDQUFiOztBQUFBLHlCQU9BLE9BQUEsR0FBUyxTQUFDLEdBQUQsR0FBQTtBQUNQLFVBQUEsa0JBQUE7QUFBQSxNQUFBLEVBQUEsR0FBSyxXQUFMLENBQUE7QUFBQSxNQUVBLENBQUEsR0FBSSxFQUFFLENBQUMsSUFBSCxDQUFRLEdBQVIsQ0FGSixDQUFBO0FBR0EsYUFBTSxDQUFOLEdBQUE7QUFDRSxRQUFBLFdBQUEsR0FBYyxDQUFFLENBQUEsQ0FBQSxDQUFoQixDQUFBO0FBQUEsUUFDQSxHQUFBLEdBQU0sR0FBRyxDQUFDLE9BQUosQ0FBWSxDQUFFLENBQUEsQ0FBQSxDQUFkLEVBQWtCLElBQUMsQ0FBQSxPQUFELENBQVMsV0FBVCxDQUFsQixDQUROLENBQUE7QUFBQSxRQUdBLENBQUEsR0FBSSxFQUFFLENBQUMsSUFBSCxDQUFR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

//# sourceURL=/home/stefano/.dotfiles/atom.symlink/packages/flex-tool-bar/lib/url-replace.coffee
