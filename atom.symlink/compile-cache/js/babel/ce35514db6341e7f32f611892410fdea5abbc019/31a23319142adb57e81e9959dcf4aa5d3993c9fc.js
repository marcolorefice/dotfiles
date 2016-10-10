Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.activate = activate;
exports.deactivate = deactivate;
exports.provideToolBar = provideToolBar;
exports.provideToolBarLegacy = provideToolBarLegacy;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _toolBarManager = require('./tool-bar-manager');

var _toolBarManager2 = _interopRequireDefault(_toolBarManager);

var _toolBarView = require('./tool-bar-view');

var _toolBarView2 = _interopRequireDefault(_toolBarView);

'use babel';

var toolBar = null;

function activate() {
  toolBar = new _toolBarView2['default']();
}

function deactivate() {
  toolBar.destroy();
  toolBar = null;
}

function provideToolBar() {
  return function (group) {
    return new _toolBarManager2['default'](group, toolBar);
  };
}

function provideToolBarLegacy() {
  return function (group) {
    var Grim = require('grim');
    Grim.deprecate('Please update to the latest tool-bar provider service.');
    return new _toolBarManager2['default'](group, toolBar, true);
  };
}

var config = {
  visible: {
    type: 'boolean',
    'default': true,
    order: 1
  },
  iconSize: {
    type: 'string',
    'default': '24px',
    'enum': ['12px', '16px', '24px', '32px'],
    order: 2
  },
  position: {
    type: 'string',
    'default': 'Top',
    'enum': ['Top', 'Right', 'Bottom', 'Left'],
    order: 3
  },
  fullWidth: {
    type: 'boolean',
    'default': true,
    order: 4
  }
};

exports.config = config;
if (typeof atom.workspace.addHeaderPanel !== 'function') {
  delete config.fullWidth;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdGVmYW5vLmNvcmFsbG8vLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy90b29sLWJhci9saWIvdG9vbC1iYXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs4QkFFMkIsb0JBQW9COzs7OzJCQUN2QixpQkFBaUI7Ozs7QUFIekMsV0FBVyxDQUFDOztBQUtaLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQzs7QUFFWixTQUFTLFFBQVEsR0FBSTtBQUMxQixTQUFPLEdBQUcsOEJBQWlCLENBQUM7Q0FDN0I7O0FBRU0sU0FBUyxVQUFVLEdBQUk7QUFDNUIsU0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2xCLFNBQU8sR0FBRyxJQUFJLENBQUM7Q0FDaEI7O0FBRU0sU0FBUyxjQUFjLEdBQUk7QUFDaEMsU0FBTyxVQUFDLEtBQUs7V0FBSyxnQ0FBbUIsS0FBSyxFQUFFLE9BQU8sQ0FBQztHQUFBLENBQUM7Q0FDdEQ7O0FBRU0sU0FBUyxvQkFBb0IsR0FBSTtBQUN0QyxTQUFPLFVBQUMsS0FBSyxFQUFLO0FBQ2hCLFFBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixRQUFJLENBQUMsU0FBUyxDQUFDLHdEQUF3RCxDQUFDLENBQUM7QUFDekUsV0FBTyxnQ0FBbUIsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztHQUNqRCxDQUFDO0NBQ0g7O0FBRU0sSUFBTSxNQUFNLEdBQUc7QUFDcEIsU0FBTyxFQUFFO0FBQ1AsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7QUFDYixTQUFLLEVBQUUsQ0FBQztHQUNUO0FBQ0QsVUFBUSxFQUFFO0FBQ1IsUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFTLE1BQU07QUFDZixZQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDO0FBQ3RDLFNBQUssRUFBRSxDQUFDO0dBQ1Q7QUFDRCxVQUFRLEVBQUU7QUFDUixRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVMsS0FBSztBQUNkLFlBQU0sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUM7QUFDeEMsU0FBSyxFQUFFLENBQUM7R0FDVDtBQUNELFdBQVMsRUFBRTtBQUNULFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxJQUFJO0FBQ2IsU0FBSyxFQUFFLENBQUM7R0FDVDtDQUNGLENBQUM7OztBQUVGLElBQUksT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsS0FBSyxVQUFVLEVBQUU7QUFDdkQsU0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDO0NBQ3pCIiwiZmlsZSI6Ii9Vc2Vycy9zdGVmYW5vLmNvcmFsbG8vLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy90b29sLWJhci9saWIvdG9vbC1iYXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IFRvb2xCYXJNYW5hZ2VyIGZyb20gJy4vdG9vbC1iYXItbWFuYWdlcic7XG5pbXBvcnQgVG9vbEJhclZpZXcgZnJvbSAnLi90b29sLWJhci12aWV3JztcblxubGV0IHRvb2xCYXIgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gYWN0aXZhdGUgKCkge1xuICB0b29sQmFyID0gbmV3IFRvb2xCYXJWaWV3KCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWFjdGl2YXRlICgpIHtcbiAgdG9vbEJhci5kZXN0cm95KCk7XG4gIHRvb2xCYXIgPSBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvdmlkZVRvb2xCYXIgKCkge1xuICByZXR1cm4gKGdyb3VwKSA9PiBuZXcgVG9vbEJhck1hbmFnZXIoZ3JvdXAsIHRvb2xCYXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvdmlkZVRvb2xCYXJMZWdhY3kgKCkge1xuICByZXR1cm4gKGdyb3VwKSA9PiB7XG4gICAgY29uc3QgR3JpbSA9IHJlcXVpcmUoJ2dyaW0nKTtcbiAgICBHcmltLmRlcHJlY2F0ZSgnUGxlYXNlIHVwZGF0ZSB0byB0aGUgbGF0ZXN0IHRvb2wtYmFyIHByb3ZpZGVyIHNlcnZpY2UuJyk7XG4gICAgcmV0dXJuIG5ldyBUb29sQmFyTWFuYWdlcihncm91cCwgdG9vbEJhciwgdHJ1ZSk7XG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBjb25maWcgPSB7XG4gIHZpc2libGU6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICBvcmRlcjogMVxuICB9LFxuICBpY29uU2l6ZToge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICcyNHB4JyxcbiAgICBlbnVtOiBbJzEycHgnLCAnMTZweCcsICcyNHB4JywgJzMycHgnXSxcbiAgICBvcmRlcjogMlxuICB9LFxuICBwb3NpdGlvbjoge1xuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICdUb3AnLFxuICAgIGVudW06IFsnVG9wJywgJ1JpZ2h0JywgJ0JvdHRvbScsICdMZWZ0J10sXG4gICAgb3JkZXI6IDNcbiAgfSxcbiAgZnVsbFdpZHRoOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgb3JkZXI6IDRcbiAgfVxufTtcblxuaWYgKHR5cGVvZiBhdG9tLndvcmtzcGFjZS5hZGRIZWFkZXJQYW5lbCAhPT0gJ2Z1bmN0aW9uJykge1xuICBkZWxldGUgY29uZmlnLmZ1bGxXaWR0aDtcbn1cbiJdfQ==
//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/tool-bar/lib/tool-bar.js
