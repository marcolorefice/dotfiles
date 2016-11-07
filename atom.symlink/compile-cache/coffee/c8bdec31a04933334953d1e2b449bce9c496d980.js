(function() {
  var UrlReplace, shell;

  shell = require('shell');

  UrlReplace = require('../lib/url-replace');

  module.exports = function(toolBar, button) {
    return toolBar.addButton({
      icon: button.icon,
      callback: function(url) {
        var options, urlReplace, warning;
        urlReplace = new UrlReplace();
        url = urlReplace.replace(url);
        if (url.startsWith('atom://')) {
          return atom.workspace.open(url);
        } else if (atom.config.get('flex-tool-bar.useBrowserPlusWhenItIsActive')) {
          if (atom.packages.isPackageActive('browser-plus')) {
            return atom.workspace.open(url, {
              split: 'right'
            });
          } else {
            warning = 'Package browser-plus is not active. Using default browser instead!';
            options = {
              detail: 'Use apm install browser-plus to install the needed package.'
            };
            atom.notifications.addWarning(warning, options);
            return shell.openExternal(url);
          }
        } else {
          return shell.openExternal(url);
        }
      },
      tooltip: button.tooltip,
      iconset: button.iconset,
      data: button.url,
      priority: button.priority || 45
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc3RlZmFuby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2ZsZXgtdG9vbC1iYXIvdHlwZXMvdXJsLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpQkFBQTs7QUFBQSxFQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUixDQUFSLENBQUE7O0FBQUEsRUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLG9CQUFSLENBRGIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtBQUNmLFdBQU8sT0FBTyxDQUFDLFNBQVIsQ0FDTDtBQUFBLE1BQUEsSUFBQSxFQUFNLE1BQU0sQ0FBQyxJQUFiO0FBQUEsTUFDQSxRQUFBLEVBQVUsU0FBQyxHQUFELEdBQUE7QUFDUixZQUFBLDRCQUFBO0FBQUEsUUFBQSxVQUFBLEdBQWlCLElBQUEsVUFBQSxDQUFBLENBQWpCLENBQUE7QUFBQSxRQUNBLEdBQUEsR0FBTSxVQUFVLENBQUMsT0FBWCxDQUFtQixHQUFuQixDQUROLENBQUE7QUFFQSxRQUFBLElBQUcsR0FBRyxDQUFDLFVBQUosQ0FBZSxTQUFmLENBQUg7aUJBQ0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLEdBQXBCLEVBREY7U0FBQSxNQUVLLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRDQUFoQixDQUFIO0FBQ0gsVUFBQSxJQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixjQUE5QixDQUFIO21CQUNFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixHQUFwQixFQUF5QjtBQUFBLGNBQUEsS0FBQSxFQUFNLE9BQU47YUFBekIsRUFERjtXQUFBLE1BQUE7QUFHRSxZQUFBLE9BQUEsR0FBVSxvRUFBVixDQUFBO0FBQUEsWUFDQSxPQUFBLEdBQVU7QUFBQSxjQUFBLE1BQUEsRUFBUSw2REFBUjthQURWLENBQUE7QUFBQSxZQUVBLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBbkIsQ0FBOEIsT0FBOUIsRUFBdUMsT0FBdkMsQ0FGQSxDQUFBO21CQUdBLEtBQUssQ0FBQyxZQUFOLENBQW1CLEdBQW5CLEVBTkY7V0FERztTQUFBLE1BQUE7aUJBU0gsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsR0FBbkIsRUFURztTQUxHO01BQUEsQ0FEVjtBQUFBLE1BZ0JBLE9BQUEsRUFBUyxNQUFNLENBQUMsT0FoQmhCO0FBQUEsTUFpQkEsT0FBQSxFQUFTLE1BQU0sQ0FBQyxPQWpCaEI7QUFBQSxNQWtCQSxJQUFBLEVBQU0sTUFBTSxDQUFDLEdBbEJiO0FBQUEsTUFtQkEsUUFBQSxFQUFVLE1BQU0sQ0FBQyxRQUFQLElBQW1CLEVBbkI3QjtLQURLLENBQVAsQ0FEZTtFQUFBLENBSGpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/stefano/.dotfiles/atom.symlink/packages/flex-tool-bar/types/url.coffee
