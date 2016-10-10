Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

var prevFocusedElm = null;

var ToolBarButtonView = (function () {
  function ToolBarButtonView(options) {
    var _element$classList;

    _classCallCheck(this, ToolBarButtonView);

    this.element = document.createElement('button');
    this.subscriptions = new _atom.CompositeDisposable();

    this.priority = options.priority;
    this.options = options;

    if (options.tooltip) {
      this.element.title = options.tooltip;
      this.subscriptions.add(atom.tooltips.add(this.element, {
        title: options.tooltip,
        placement: getTooltipPlacement
      }));
    }

    var classNames = ['btn', 'btn-default', 'tool-bar-btn'];
    if (this.priority < 0) {
      classNames.push('tool-bar-item-align-end');
    }
    if (options.iconset) {
      classNames.push(options.iconset, options.iconset + '-' + options.icon);
    } else {
      classNames.push('icon-' + options.icon);
    }

    (_element$classList = this.element.classList).add.apply(_element$classList, classNames);

    this._onClick = this._onClick.bind(this);
    this._onMouseOver = this._onMouseOver.bind(this);

    this.element.addEventListener('click', this._onClick);
    this.element.addEventListener('mouseover', this._onMouseOver);
  }

  _createClass(ToolBarButtonView, [{
    key: 'setEnabled',
    value: function setEnabled(enabled) {
      if (enabled) {
        this.element.classList.remove('disabled');
      } else {
        this.element.classList.add('disabled');
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.subscriptions.dispose();
      this.subscriptions = null;

      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }

      this.element.removeEventListener('click', this._onClick);
      this.element.removeEventListener('mouseover', this._onMouseOver);
      this.element = null;
    }
  }, {
    key: '_onClick',
    value: function _onClick(e) {
      getPrevFocusedElm().focus();
      if (!this.element.classList.contains('disabled')) {
        executeCallback(this.options, e);
      }
      e.preventDefault();
      e.stopPropagation();
    }
  }, {
    key: '_onMouseOver',
    value: function _onMouseOver(e) {
      if (!document.activeElement.classList.contains('tool-bar-btn')) {
        prevFocusedElm = document.activeElement;
      }
    }
  }]);

  return ToolBarButtonView;
})();

exports['default'] = ToolBarButtonView;

function getPrevFocusedElm() {
  var workspaceView = atom.views.getView(atom.workspace);
  if (workspaceView.contains(prevFocusedElm)) {
    return prevFocusedElm;
  } else {
    return workspaceView;
  }
}

function getTooltipPlacement() {
  var toolbarPosition = atom.config.get('tool-bar.position');
  return toolbarPosition === 'Top' ? 'bottom' : toolbarPosition === 'Right' ? 'left' : toolbarPosition === 'Bottom' ? 'top' : toolbarPosition === 'Left' ? 'right' : null;
}

function executeCallback(_ref, e) {
  var callback = _ref.callback;
  var data = _ref.data;

  if (typeof callback === 'object' && callback) {
    callback = getCallbackModifier(callback, e);
  }
  if (typeof callback === 'string') {
    atom.commands.dispatch(getPrevFocusedElm(), callback);
  } else if (typeof callback === 'function') {
    callback(data, getPrevFocusedElm());
  }
}

function getCallbackModifier(callback, _ref2) {
  var altKey = _ref2.altKey;
  var ctrlKey = _ref2.ctrlKey;
  var shiftKey = _ref2.shiftKey;

  if (!(ctrlKey || altKey || shiftKey)) {
    return callback[''];
  }
  var modifier = Object.keys(callback).filter(Boolean).map(function (modifiers) {
    return modifiers.toLowerCase();
  }).reverse().find(function (item) {
    if (~item.indexOf('alt') && !altKey || altKey && ! ~item.indexOf('alt')) {
      return false;
    }
    if (~item.indexOf('ctrl') && !ctrlKey || ctrlKey && ! ~item.indexOf('ctrl')) {
      return false;
    }
    if (~item.indexOf('shift') && !shiftKey || shiftKey && ! ~item.indexOf('shift')) {
      return false;
    }
    return true;
  });
  return callback[modifier] || callback[''];
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdGVmYW5vLmNvcmFsbG8vLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy90b29sLWJhci9saWIvdG9vbC1iYXItYnV0dG9uLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRWtDLE1BQU07O0FBRnhDLFdBQVcsQ0FBQzs7QUFJWixJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUM7O0lBRUwsaUJBQWlCO0FBRXhCLFdBRk8saUJBQWlCLENBRXZCLE9BQU8sRUFBRTs7OzBCQUZILGlCQUFpQjs7QUFHbEMsUUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2hELFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUM7O0FBRS9DLFFBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztBQUNqQyxRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzs7QUFFdkIsUUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFO0FBQ25CLFVBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7QUFDckMsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDOUIsYUFBSyxFQUFFLE9BQU8sQ0FBQyxPQUFPO0FBQ3RCLGlCQUFTLEVBQUUsbUJBQW1CO09BQy9CLENBQUMsQ0FDSCxDQUFDO0tBQ0g7O0FBRUQsUUFBTSxVQUFVLEdBQUcsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBQzFELFFBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUU7QUFDckIsZ0JBQVUsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQztLQUM1QztBQUNELFFBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtBQUNuQixnQkFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFLLE9BQU8sQ0FBQyxPQUFPLFNBQUksT0FBTyxDQUFDLElBQUksQ0FBRyxDQUFDO0tBQ3hFLE1BQU07QUFDTCxnQkFBVSxDQUFDLElBQUksV0FBUyxPQUFPLENBQUMsSUFBSSxDQUFHLENBQUM7S0FDekM7O0FBRUQsMEJBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUMsR0FBRyxNQUFBLHFCQUFJLFVBQVUsQ0FBQyxDQUFDOztBQUUxQyxRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pDLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWpELFFBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN0RCxRQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7R0FDL0Q7O2VBcENrQixpQkFBaUI7O1dBc0N6QixvQkFBQyxPQUFPLEVBQUU7QUFDbkIsVUFBSSxPQUFPLEVBQUU7QUFDWCxZQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7T0FDM0MsTUFBTTtBQUNMLFlBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztPQUN4QztLQUNGOzs7V0FFTyxtQkFBRztBQUNULFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDN0IsVUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7O0FBRTFCLFVBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7QUFDM0IsWUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztPQUNuRDs7QUFFRCxVQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2pFLFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0tBQ3JCOzs7V0FFUSxrQkFBQyxDQUFDLEVBQUU7QUFDWCx1QkFBaUIsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQzVCLFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUU7QUFDaEQsdUJBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO09BQ2xDO0FBQ0QsT0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ25CLE9BQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztLQUNyQjs7O1dBRVksc0JBQUMsQ0FBQyxFQUFFO0FBQ2YsVUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRTtBQUM5RCxzQkFBYyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUM7T0FDekM7S0FDRjs7O1NBeEVrQixpQkFBaUI7OztxQkFBakIsaUJBQWlCOztBQTJFdEMsU0FBUyxpQkFBaUIsR0FBSTtBQUM1QixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDekQsTUFBSSxhQUFhLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFO0FBQzFDLFdBQU8sY0FBYyxDQUFDO0dBQ3ZCLE1BQU07QUFDTCxXQUFPLGFBQWEsQ0FBQztHQUN0QjtDQUNGOztBQUVELFNBQVMsbUJBQW1CLEdBQUk7QUFDOUIsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUM3RCxTQUFPLGVBQWUsS0FBSyxLQUFLLEdBQUcsUUFBUSxHQUNwQyxlQUFlLEtBQUssT0FBTyxHQUFHLE1BQU0sR0FDcEMsZUFBZSxLQUFLLFFBQVEsR0FBRyxLQUFLLEdBQ3BDLGVBQWUsS0FBSyxNQUFNLEdBQUcsT0FBTyxHQUNwQyxJQUFJLENBQUM7Q0FDYjs7QUFFRCxTQUFTLGVBQWUsQ0FBRSxJQUFnQixFQUFFLENBQUMsRUFBRTtNQUFwQixRQUFRLEdBQVQsSUFBZ0IsQ0FBZixRQUFRO01BQUUsSUFBSSxHQUFmLElBQWdCLENBQUwsSUFBSTs7QUFDdkMsTUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLElBQUksUUFBUSxFQUFFO0FBQzVDLFlBQVEsR0FBRyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7R0FDN0M7QUFDRCxNQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVEsRUFBRTtBQUNoQyxRQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0dBQ3ZELE1BQU0sSUFBSSxPQUFPLFFBQVEsS0FBSyxVQUFVLEVBQUU7QUFDekMsWUFBUSxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxDQUFDLENBQUM7R0FDckM7Q0FDRjs7QUFFRCxTQUFTLG1CQUFtQixDQUFFLFFBQVEsRUFBRSxLQUEyQixFQUFFO01BQTVCLE1BQU0sR0FBUCxLQUEyQixDQUExQixNQUFNO01BQUUsT0FBTyxHQUFoQixLQUEyQixDQUFsQixPQUFPO01BQUUsUUFBUSxHQUExQixLQUEyQixDQUFULFFBQVE7O0FBQ2hFLE1BQUksRUFBRSxPQUFPLElBQUksTUFBTSxJQUFJLFFBQVEsQ0FBQSxBQUFDLEVBQUU7QUFDcEMsV0FBTyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7R0FDckI7QUFDRCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUNuQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQ2YsR0FBRyxDQUFDLFVBQUEsU0FBUztXQUFJLFNBQVMsQ0FBQyxXQUFXLEVBQUU7R0FBQSxDQUFDLENBQ3pDLE9BQU8sRUFBRSxDQUNULElBQUksQ0FBQyxVQUFBLElBQUksRUFBSTtBQUNaLFFBQUksQUFBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQU0sTUFBTSxJQUFJLEVBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxBQUFDLEVBQUU7QUFDMUUsYUFBTyxLQUFLLENBQUM7S0FDZDtBQUNELFFBQUksQUFBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQU0sT0FBTyxJQUFJLEVBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxBQUFDLEVBQUU7QUFDOUUsYUFBTyxLQUFLLENBQUM7S0FDZDtBQUNELFFBQUksQUFBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLElBQU0sUUFBUSxJQUFJLEVBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxBQUFDLEVBQUU7QUFDbEYsYUFBTyxLQUFLLENBQUM7S0FDZDtBQUNELFdBQU8sSUFBSSxDQUFDO0dBQ2IsQ0FBQyxDQUFDO0FBQ0wsU0FBTyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0NBQzNDIiwiZmlsZSI6Ii9Vc2Vycy9zdGVmYW5vLmNvcmFsbG8vLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy90b29sLWJhci9saWIvdG9vbC1iYXItYnV0dG9uLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJztcblxubGV0IHByZXZGb2N1c2VkRWxtID0gbnVsbDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG9vbEJhckJ1dHRvblZpZXcge1xuXG4gIGNvbnN0cnVjdG9yIChvcHRpb25zKSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgIHRoaXMucHJpb3JpdHkgPSBvcHRpb25zLnByaW9yaXR5O1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICBpZiAob3B0aW9ucy50b29sdGlwKSB7XG4gICAgICB0aGlzLmVsZW1lbnQudGl0bGUgPSBvcHRpb25zLnRvb2x0aXA7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgICBhdG9tLnRvb2x0aXBzLmFkZCh0aGlzLmVsZW1lbnQsIHtcbiAgICAgICAgICB0aXRsZTogb3B0aW9ucy50b29sdGlwLFxuICAgICAgICAgIHBsYWNlbWVudDogZ2V0VG9vbHRpcFBsYWNlbWVudFxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBjbGFzc05hbWVzID0gWydidG4nLCAnYnRuLWRlZmF1bHQnLCAndG9vbC1iYXItYnRuJ107XG4gICAgaWYgKHRoaXMucHJpb3JpdHkgPCAwKSB7XG4gICAgICBjbGFzc05hbWVzLnB1c2goJ3Rvb2wtYmFyLWl0ZW0tYWxpZ24tZW5kJyk7XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmljb25zZXQpIHtcbiAgICAgIGNsYXNzTmFtZXMucHVzaChvcHRpb25zLmljb25zZXQsIGAke29wdGlvbnMuaWNvbnNldH0tJHtvcHRpb25zLmljb259YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNsYXNzTmFtZXMucHVzaChgaWNvbi0ke29wdGlvbnMuaWNvbn1gKTtcbiAgICB9XG5cbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCguLi5jbGFzc05hbWVzKTtcblxuICAgIHRoaXMuX29uQ2xpY2sgPSB0aGlzLl9vbkNsaWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25Nb3VzZU92ZXIgPSB0aGlzLl9vbk1vdXNlT3Zlci5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fb25DbGljayk7XG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIHRoaXMuX29uTW91c2VPdmVyKTtcbiAgfVxuXG4gIHNldEVuYWJsZWQgKGVuYWJsZWQpIHtcbiAgICBpZiAoZW5hYmxlZCkge1xuICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpO1xuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3kgKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbDtcblxuICAgIGlmICh0aGlzLmVsZW1lbnQucGFyZW50Tm9kZSkge1xuICAgICAgdGhpcy5lbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KTtcbiAgICB9XG5cbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9vbkNsaWNrKTtcbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgdGhpcy5fb25Nb3VzZU92ZXIpO1xuICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XG4gIH1cblxuICBfb25DbGljayAoZSkge1xuICAgIGdldFByZXZGb2N1c2VkRWxtKCkuZm9jdXMoKTtcbiAgICBpZiAoIXRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2Rpc2FibGVkJykpIHtcbiAgICAgIGV4ZWN1dGVDYWxsYmFjayh0aGlzLm9wdGlvbnMsIGUpO1xuICAgIH1cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgfVxuXG4gIF9vbk1vdXNlT3ZlciAoZSkge1xuICAgIGlmICghZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3Rvb2wtYmFyLWJ0bicpKSB7XG4gICAgICBwcmV2Rm9jdXNlZEVsbSA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldFByZXZGb2N1c2VkRWxtICgpIHtcbiAgY29uc3Qgd29ya3NwYWNlVmlldyA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSk7XG4gIGlmICh3b3Jrc3BhY2VWaWV3LmNvbnRhaW5zKHByZXZGb2N1c2VkRWxtKSkge1xuICAgIHJldHVybiBwcmV2Rm9jdXNlZEVsbTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gd29ya3NwYWNlVmlldztcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRUb29sdGlwUGxhY2VtZW50ICgpIHtcbiAgY29uc3QgdG9vbGJhclBvc2l0aW9uID0gYXRvbS5jb25maWcuZ2V0KCd0b29sLWJhci5wb3NpdGlvbicpO1xuICByZXR1cm4gdG9vbGJhclBvc2l0aW9uID09PSAnVG9wJyA/ICdib3R0b20nXG4gICAgICAgOiB0b29sYmFyUG9zaXRpb24gPT09ICdSaWdodCcgPyAnbGVmdCdcbiAgICAgICA6IHRvb2xiYXJQb3NpdGlvbiA9PT0gJ0JvdHRvbScgPyAndG9wJ1xuICAgICAgIDogdG9vbGJhclBvc2l0aW9uID09PSAnTGVmdCcgPyAncmlnaHQnXG4gICAgICAgOiBudWxsO1xufVxuXG5mdW5jdGlvbiBleGVjdXRlQ2FsbGJhY2sgKHtjYWxsYmFjaywgZGF0YX0sIGUpIHtcbiAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ29iamVjdCcgJiYgY2FsbGJhY2spIHtcbiAgICBjYWxsYmFjayA9IGdldENhbGxiYWNrTW9kaWZpZXIoY2FsbGJhY2ssIGUpO1xuICB9XG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdzdHJpbmcnKSB7XG4gICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChnZXRQcmV2Rm9jdXNlZEVsbSgpLCBjYWxsYmFjayk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2soZGF0YSwgZ2V0UHJldkZvY3VzZWRFbG0oKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0Q2FsbGJhY2tNb2RpZmllciAoY2FsbGJhY2ssIHthbHRLZXksIGN0cmxLZXksIHNoaWZ0S2V5fSkge1xuICBpZiAoIShjdHJsS2V5IHx8IGFsdEtleSB8fCBzaGlmdEtleSkpIHtcbiAgICByZXR1cm4gY2FsbGJhY2tbJyddO1xuICB9XG4gIGNvbnN0IG1vZGlmaWVyID0gT2JqZWN0LmtleXMoY2FsbGJhY2spXG4gICAgLmZpbHRlcihCb29sZWFuKVxuICAgIC5tYXAobW9kaWZpZXJzID0+IG1vZGlmaWVycy50b0xvd2VyQ2FzZSgpKVxuICAgIC5yZXZlcnNlKClcbiAgICAuZmluZChpdGVtID0+IHtcbiAgICAgIGlmICgofml0ZW0uaW5kZXhPZignYWx0JykgJiYgIWFsdEtleSkgfHwgKGFsdEtleSAmJiAhfml0ZW0uaW5kZXhPZignYWx0JykpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICgofml0ZW0uaW5kZXhPZignY3RybCcpICYmICFjdHJsS2V5KSB8fCAoY3RybEtleSAmJiAhfml0ZW0uaW5kZXhPZignY3RybCcpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoKH5pdGVtLmluZGV4T2YoJ3NoaWZ0JykgJiYgIXNoaWZ0S2V5KSB8fCAoc2hpZnRLZXkgJiYgIX5pdGVtLmluZGV4T2YoJ3NoaWZ0JykpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICByZXR1cm4gY2FsbGJhY2tbbW9kaWZpZXJdIHx8IGNhbGxiYWNrWycnXTtcbn1cbiJdfQ==
//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/tool-bar/lib/tool-bar-button-view.js
