(function() {
  var $, MenuItem, MenuView, View, items, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), View = _ref.View, $ = _ref.$;

  items = [
    {
      id: 'project',
      menu: 'Project',
      icon: 'icon-repo',
      type: 'active'
    }, {
      id: 'compare',
      menu: 'Compare',
      icon: 'compare',
      type: 'active'
    }, {
      id: 'commit',
      menu: 'Commit',
      icon: 'commit',
      type: 'file merging'
    }, {
      id: 'tag',
      menu: 'Tag',
      icon: 'tag',
      type: 'active'
    }, {
      id: 'ptag',
      menu: 'Push Tags',
      icon: 'versions',
      type: 'active'
    }, {
      id: 'reset',
      menu: 'Reset',
      icon: 'sync',
      type: 'file'
    }, {
      id: 'fetch',
      menu: 'Fetch',
      icon: 'cloud-download',
      type: 'remote'
    }, {
      id: 'pull',
      menu: 'Pull',
      icon: 'pull',
      type: 'upstream'
    }, {
      id: 'pullup',
      menu: 'Pull Upstream',
      icon: 'desktop-download',
      type: 'active'
    }, {
      id: 'push',
      menu: 'Push',
      icon: 'push',
      type: 'downstream'
    }, {
      id: 'rebase',
      menu: 'Rebase',
      icon: 'circuit-board',
      type: 'active'
    }, {
      id: 'merge',
      menu: 'Merge',
      icon: 'merge',
      type: 'active'
    }, {
      id: 'branch',
      menu: 'Branch',
      icon: 'branch',
      type: 'active'
    }, {
      id: 'flow',
      menu: 'GitFlow',
      icon: 'flow',
      type: 'active',
      showConfig: 'git-control.showGitFlowButton'
    }
  ];

  MenuItem = (function(_super) {
    __extends(MenuItem, _super);

    function MenuItem() {
      return MenuItem.__super__.constructor.apply(this, arguments);
    }

    MenuItem.content = function(item) {
      var klass;
      klass = item.type === 'active' ? '' : 'inactive';
      klass += (item.showConfig != null) && !atom.config.get(item.showConfig) ? ' hide' : '';
      return this.div({
        "class": "item " + klass + " " + item.type,
        id: "menu" + item.id,
        click: 'click'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": "icon large " + item.icon
          });
          return _this.div(item.menu);
        };
      })(this));
    };

    MenuItem.prototype.initialize = function(item) {
      this.item = item;
      if (item.showConfig != null) {
        return atom.config.observe(item.showConfig, function(show) {
          if (show) {
            return $("#menu" + item.id).removeClass('hide');
          } else {
            return $("#menu" + item.id).addClass('hide');
          }
        });
      }
    };

    MenuItem.prototype.click = function() {
      return this.parentView.click(this.item.id);
    };

    return MenuItem;

  })(View);

  module.exports = MenuView = (function(_super) {
    __extends(MenuView, _super);

    function MenuView() {
      return MenuView.__super__.constructor.apply(this, arguments);
    }

    MenuView.content = function(item) {
      return this.div({
        "class": 'menu'
      }, (function(_this) {
        return function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = items.length; _i < _len; _i++) {
            item = items[_i];
            _results.push(_this.subview(item.id, new MenuItem(item)));
          }
          return _results;
        };
      })(this));
    };

    MenuView.prototype.click = function(id) {
      if (!(this.find("#menu" + id).hasClass('inactive'))) {
        return this.parentView["" + id + "MenuClick"]();
      }
    };

    MenuView.prototype.activate = function(type, active) {
      var menuItems;
      menuItems = this.find(".item." + type);
      if (active) {
        menuItems.removeClass('inactive');
      } else {
        menuItems.addClass('inactive');
      }
    };

    return MenuView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc3RlZmFuby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2dpdC1jb250cm9sL2xpYi92aWV3cy9tZW51LXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFZLE9BQUEsQ0FBUSxzQkFBUixDQUFaLEVBQUMsWUFBQSxJQUFELEVBQU8sU0FBQSxDQUFQLENBQUE7O0FBQUEsRUFFQSxLQUFBLEdBQVE7SUFDTjtBQUFBLE1BQUUsRUFBQSxFQUFJLFNBQU47QUFBQSxNQUFpQixJQUFBLEVBQU0sU0FBdkI7QUFBQSxNQUFrQyxJQUFBLEVBQU0sV0FBeEM7QUFBQSxNQUFxRCxJQUFBLEVBQU0sUUFBM0Q7S0FETSxFQUVOO0FBQUEsTUFBRSxFQUFBLEVBQUksU0FBTjtBQUFBLE1BQWlCLElBQUEsRUFBTSxTQUF2QjtBQUFBLE1BQWtDLElBQUEsRUFBTSxTQUF4QztBQUFBLE1BQW1ELElBQUEsRUFBTSxRQUF6RDtLQUZNLEVBR047QUFBQSxNQUFFLEVBQUEsRUFBSSxRQUFOO0FBQUEsTUFBZ0IsSUFBQSxFQUFNLFFBQXRCO0FBQUEsTUFBZ0MsSUFBQSxFQUFNLFFBQXRDO0FBQUEsTUFBZ0QsSUFBQSxFQUFNLGNBQXREO0tBSE0sRUFJTjtBQUFBLE1BQUUsRUFBQSxFQUFJLEtBQU47QUFBQSxNQUFhLElBQUEsRUFBTSxLQUFuQjtBQUFBLE1BQTBCLElBQUEsRUFBTSxLQUFoQztBQUFBLE1BQXVDLElBQUEsRUFBTSxRQUE3QztLQUpNLEVBS047QUFBQSxNQUFFLEVBQUEsRUFBSSxNQUFOO0FBQUEsTUFBYyxJQUFBLEVBQU0sV0FBcEI7QUFBQSxNQUFpQyxJQUFBLEVBQU0sVUFBdkM7QUFBQSxNQUFtRCxJQUFBLEVBQU0sUUFBekQ7S0FMTSxFQU1O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

//# sourceURL=/home/stefano/.dotfiles/atom.symlink/packages/git-control/lib/views/menu-view.coffee
