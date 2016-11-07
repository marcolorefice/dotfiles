(function() {
  module.exports = function(toolBar, button) {
    var options;
    options = {
      icon: button.icon,
      tooltip: button.tooltip,
      iconset: button.iconset,
      priority: button.priority || 45
    };
    if (Array.isArray(button.callback)) {
      options.callback = function(_, target) {
        var callback, _i, _len, _ref, _results;
        _ref = button.callback;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          callback = _ref[_i];
          _results.push(atom.commands.dispatch(target, callback));
        }
        return _results;
      };
    } else {
      options.callback = button.callback;
    }
    return toolBar.addButton(options);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc3RlZmFuby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2ZsZXgtdG9vbC1iYXIvdHlwZXMvYnV0dG9uLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLE9BQUQsRUFBVSxNQUFWLEdBQUE7QUFDZixRQUFBLE9BQUE7QUFBQSxJQUFBLE9BQUEsR0FDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLE1BQU0sQ0FBQyxJQUFiO0FBQUEsTUFDQSxPQUFBLEVBQVMsTUFBTSxDQUFDLE9BRGhCO0FBQUEsTUFFQSxPQUFBLEVBQVMsTUFBTSxDQUFDLE9BRmhCO0FBQUEsTUFHQSxRQUFBLEVBQVUsTUFBTSxDQUFDLFFBQVAsSUFBbUIsRUFIN0I7S0FERixDQUFBO0FBTUEsSUFBQSxJQUFHLEtBQUssQ0FBQyxPQUFOLENBQWMsTUFBTSxDQUFDLFFBQXJCLENBQUg7QUFDRSxNQUFBLE9BQU8sQ0FBQyxRQUFSLEdBQW1CLFNBQUMsQ0FBRCxFQUFJLE1BQUosR0FBQTtBQUNqQixZQUFBLGtDQUFBO0FBQUE7QUFBQTthQUFBLDJDQUFBOzhCQUFBO0FBQ0Usd0JBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLE1BQXZCLEVBQStCLFFBQS9CLEVBQUEsQ0FERjtBQUFBO3dCQURpQjtNQUFBLENBQW5CLENBREY7S0FBQSxNQUFBO0FBS0UsTUFBQSxPQUFPLENBQUMsUUFBUixHQUFtQixNQUFNLENBQUMsUUFBMUIsQ0FMRjtLQU5BO0FBYUEsV0FBTyxPQUFPLENBQUMsU0FBUixDQUFrQixPQUFsQixDQUFQLENBZGU7RUFBQSxDQUFqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/stefano/.dotfiles/atom.symlink/packages/flex-tool-bar/types/button.coffee
