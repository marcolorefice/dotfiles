Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _toolBarButtonView = require('./tool-bar-button-view');

var _toolBarButtonView2 = _interopRequireDefault(_toolBarButtonView);

var _toolBarSpacerView = require('./tool-bar-spacer-view');

var _toolBarSpacerView2 = _interopRequireDefault(_toolBarSpacerView);

'use babel';

var ToolBarManager = (function () {
  function ToolBarManager(group, toolBar, legacy) {
    _classCallCheck(this, ToolBarManager);

    this.group = group;
    this.toolBar = toolBar;
    this._legacy = legacy;
  }

  _createClass(ToolBarManager, [{
    key: 'addButton',
    value: function addButton(options) {
      var button = new _toolBarButtonView2['default'](options);
      button.group = this.group;
      this.toolBar.addItem(button);
      if (this._legacy) {
        return legacyWrap(button);
      }
      return button;
    }
  }, {
    key: 'addSpacer',
    value: function addSpacer(options) {
      var spacer = new _toolBarSpacerView2['default'](options);
      spacer.group = this.group;
      this.toolBar.addItem(spacer);
      if (this._legacy) {
        return legacyWrap(spacer);
      }
      return spacer;
    }
  }, {
    key: 'removeItems',
    value: function removeItems() {
      var _this = this;

      if (this.toolBar.items) {
        this.toolBar.items.filter(function (item) {
          return item.group === _this.group;
        }).forEach(function (item) {
          return _this.toolBar.removeItem(item);
        });
      }
    }
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      this.toolBar.emitter.on('did-destroy', callback);
    }
  }]);

  return ToolBarManager;
})();

exports['default'] = ToolBarManager;

function legacyWrap(view) {
  var $ = require('jquery');
  var wrapped = $(view.element);
  ['setEnabled', 'destroy'].forEach(function (name) {
    if (typeof view[name] === 'function') {
      wrapped[name] = function () {
        return view[name].apply(view, arguments);
      };
    }
  });
  wrapped.element = view.element;
  return wrapped;
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdGVmYW5vLmNvcmFsbG8vLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy90b29sLWJhci9saWIvdG9vbC1iYXItbWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O2lDQUU4Qix3QkFBd0I7Ozs7aUNBQ3hCLHdCQUF3Qjs7OztBQUh0RCxXQUFXLENBQUM7O0lBS1MsY0FBYztBQUNyQixXQURPLGNBQWMsQ0FDcEIsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUU7MEJBRGxCLGNBQWM7O0FBRS9CLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0dBQ3ZCOztlQUxrQixjQUFjOztXQU92QixtQkFBQyxPQUFPLEVBQUU7QUFDbEIsVUFBTSxNQUFNLEdBQUcsbUNBQXNCLE9BQU8sQ0FBQyxDQUFDO0FBQzlDLFlBQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUMxQixVQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixVQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDaEIsZUFBTyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDM0I7QUFDRCxhQUFPLE1BQU0sQ0FBQztLQUNmOzs7V0FFUyxtQkFBQyxPQUFPLEVBQUU7QUFDbEIsVUFBTSxNQUFNLEdBQUcsbUNBQXNCLE9BQU8sQ0FBQyxDQUFDO0FBQzlDLFlBQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUMxQixVQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixVQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDaEIsZUFBTyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDM0I7QUFDRCxhQUFPLE1BQU0sQ0FBQztLQUNmOzs7V0FFVyx1QkFBRzs7O0FBQ2IsVUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRTtBQUN0QixZQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FDZixNQUFNLENBQUMsVUFBQSxJQUFJO2lCQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssTUFBSyxLQUFLO1NBQUEsQ0FBQyxDQUN6QyxPQUFPLENBQUMsVUFBQSxJQUFJO2lCQUFJLE1BQUssT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7U0FBQSxDQUFDLENBQUM7T0FDbkQ7S0FDRjs7O1dBRVksc0JBQUMsUUFBUSxFQUFFO0FBQ3RCLFVBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDbEQ7OztTQXJDa0IsY0FBYzs7O3FCQUFkLGNBQWM7O0FBd0NuQyxTQUFTLFVBQVUsQ0FBRSxJQUFJLEVBQUU7QUFDekIsTUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzVCLE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDaEMsR0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQ3hDLFFBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssVUFBVSxFQUFFO0FBQ3BDLGFBQU8sQ0FBQyxJQUFJLENBQUMsR0FBRztlQUFhLElBQUksQ0FBQyxJQUFJLE9BQUMsQ0FBVixJQUFJLFlBQWU7T0FBQSxDQUFDO0tBQ2xEO0dBQ0YsQ0FBQyxDQUFDO0FBQ0gsU0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQy9CLFNBQU8sT0FBTyxDQUFDO0NBQ2hCIiwiZmlsZSI6Ii9Vc2Vycy9zdGVmYW5vLmNvcmFsbG8vLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy90b29sLWJhci9saWIvdG9vbC1iYXItbWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgVG9vbEJhckJ1dHRvblZpZXcgZnJvbSAnLi90b29sLWJhci1idXR0b24tdmlldyc7XG5pbXBvcnQgVG9vbEJhclNwYWNlclZpZXcgZnJvbSAnLi90b29sLWJhci1zcGFjZXItdmlldyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvb2xCYXJNYW5hZ2VyIHtcbiAgY29uc3RydWN0b3IgKGdyb3VwLCB0b29sQmFyLCBsZWdhY3kpIHtcbiAgICB0aGlzLmdyb3VwID0gZ3JvdXA7XG4gICAgdGhpcy50b29sQmFyID0gdG9vbEJhcjtcbiAgICB0aGlzLl9sZWdhY3kgPSBsZWdhY3k7XG4gIH1cblxuICBhZGRCdXR0b24gKG9wdGlvbnMpIHtcbiAgICBjb25zdCBidXR0b24gPSBuZXcgVG9vbEJhckJ1dHRvblZpZXcob3B0aW9ucyk7XG4gICAgYnV0dG9uLmdyb3VwID0gdGhpcy5ncm91cDtcbiAgICB0aGlzLnRvb2xCYXIuYWRkSXRlbShidXR0b24pO1xuICAgIGlmICh0aGlzLl9sZWdhY3kpIHtcbiAgICAgIHJldHVybiBsZWdhY3lXcmFwKGJ1dHRvbik7XG4gICAgfVxuICAgIHJldHVybiBidXR0b247XG4gIH1cblxuICBhZGRTcGFjZXIgKG9wdGlvbnMpIHtcbiAgICBjb25zdCBzcGFjZXIgPSBuZXcgVG9vbEJhclNwYWNlclZpZXcob3B0aW9ucyk7XG4gICAgc3BhY2VyLmdyb3VwID0gdGhpcy5ncm91cDtcbiAgICB0aGlzLnRvb2xCYXIuYWRkSXRlbShzcGFjZXIpO1xuICAgIGlmICh0aGlzLl9sZWdhY3kpIHtcbiAgICAgIHJldHVybiBsZWdhY3lXcmFwKHNwYWNlcik7XG4gICAgfVxuICAgIHJldHVybiBzcGFjZXI7XG4gIH1cblxuICByZW1vdmVJdGVtcyAoKSB7XG4gICAgaWYgKHRoaXMudG9vbEJhci5pdGVtcykge1xuICAgICAgdGhpcy50b29sQmFyLml0ZW1zXG4gICAgICAgIC5maWx0ZXIoaXRlbSA9PiBpdGVtLmdyb3VwID09PSB0aGlzLmdyb3VwKVxuICAgICAgICAuZm9yRWFjaChpdGVtID0+IHRoaXMudG9vbEJhci5yZW1vdmVJdGVtKGl0ZW0pKTtcbiAgICB9XG4gIH1cblxuICBvbkRpZERlc3Ryb3kgKGNhbGxiYWNrKSB7XG4gICAgdGhpcy50b29sQmFyLmVtaXR0ZXIub24oJ2RpZC1kZXN0cm95JywgY2FsbGJhY2spO1xuICB9XG59XG5cbmZ1bmN0aW9uIGxlZ2FjeVdyYXAgKHZpZXcpIHtcbiAgY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuICBjb25zdCB3cmFwcGVkID0gJCh2aWV3LmVsZW1lbnQpO1xuICBbJ3NldEVuYWJsZWQnLCAnZGVzdHJveSddLmZvckVhY2gobmFtZSA9PiB7XG4gICAgaWYgKHR5cGVvZiB2aWV3W25hbWVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB3cmFwcGVkW25hbWVdID0gKC4uLmFyZ3MpID0+IHZpZXdbbmFtZV0oLi4uYXJncyk7XG4gICAgfVxuICB9KTtcbiAgd3JhcHBlZC5lbGVtZW50ID0gdmlldy5lbGVtZW50O1xuICByZXR1cm4gd3JhcHBlZDtcbn1cbiJdfQ==
//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/tool-bar/lib/tool-bar-manager.js
