Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

var supportFullWidth = typeof atom.workspace.addHeaderPanel === 'function';

var ToolBarView = (function () {
  function ToolBarView() {
    var _this = this;

    _classCallCheck(this, ToolBarView);

    this.element = document.createElement('div');
    this.element.classList.add('tool-bar');
    this.items = [];
    this.emitter = new _atom.Emitter();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', 'tool-bar:toggle', function () {
      _this.toggle();
    }), atom.commands.add('atom-workspace', 'tool-bar:position-top', function () {
      _this.updatePosition('Top');
      atom.config.set('tool-bar.position', 'Top');
    }), atom.commands.add('atom-workspace', 'tool-bar:position-right', function () {
      _this.updatePosition('Right');
      atom.config.set('tool-bar.position', 'Right');
    }), atom.commands.add('atom-workspace', 'tool-bar:position-bottom', function () {
      _this.updatePosition('Bottom');
      atom.config.set('tool-bar.position', 'Bottom');
    }), atom.commands.add('atom-workspace', 'tool-bar:position-left', function () {
      _this.updatePosition('Left');
      atom.config.set('tool-bar.position', 'Left');
    }), atom.config.observe('tool-bar.iconSize', function (newValue) {
      _this.updateSize(newValue);
    }), atom.config.onDidChange('tool-bar.position', function (_ref) {
      var newValue = _ref.newValue;
      var oldValue = _ref.oldValue;

      if (atom.config.get('tool-bar.visible')) {
        _this.show();
      }
    }), atom.config.onDidChange('tool-bar.visible', function (_ref2) {
      var newValue = _ref2.newValue;
      var oldValue = _ref2.oldValue;

      if (newValue) {
        _this.show();
      } else {
        _this.hide();
      }
    }));

    if (supportFullWidth) {
      this.subscriptions.add(atom.config.onDidChange('tool-bar.fullWidth', function (_ref3) {
        var newValue = _ref3.newValue;
        var oldValue = _ref3.oldValue;

        if (atom.config.get('tool-bar.visible')) {
          _this.show();
        }
      }));
    }

    if (atom.config.get('tool-bar.visible')) {
      this.show();
    }

    this.drawGutter = this.drawGutter.bind(this);

    this.element.addEventListener('scroll', this.drawGutter);
    window.addEventListener('resize', this.drawGutter);
  }

  _createClass(ToolBarView, [{
    key: 'addItem',
    value: function addItem(newItem) {
      newItem.priority = this.calculatePriority(newItem);

      if (atom.devMode) {
        newItem.element.dataset.group = newItem.group;
        newItem.element.dataset.priority = newItem.priority;
      }

      var index = this.items.findIndex(function (existingItem) {
        return existingItem.priority > newItem.priority;
      });
      if (index === -1) {
        index = this.items.length;
      }
      var nextItem = this.items[index];

      this.items.splice(index, 0, newItem);

      this.element.insertBefore(newItem.element, nextItem ? nextItem.element : null);

      this.drawGutter();

      return nextItem;
    }
  }, {
    key: 'removeItem',
    value: function removeItem(item) {
      item.destroy();
      this.items.splice(this.items.indexOf(item), 1);
      this.drawGutter();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.items.forEach(function (item) {
        return item.destroy();
      });
      this.items = null;

      this.subscriptions.dispose();
      this.subscriptions = null;

      this.hide();
      this.element.removeEventListener('scroll', this.drawGutter);
      this.element = null;

      window.removeEventListener('resize', this.drawGutter);

      this.emitter.emit('did-destroy');
      this.emitter.dispose();
      this.emitter = null;
    }
  }, {
    key: 'calculatePriority',
    value: function calculatePriority(item) {
      if (!isNaN(item.priority)) {
        return item.priority;
      }
      var lastItem = this.items.filter(function (i) {
        return i.group !== item.group;
      }).pop();
      return lastItem && !isNaN(lastItem.priority) ? lastItem.priority + 1 : 50;
    }
  }, {
    key: 'updateSize',
    value: function updateSize(size) {
      this.element.classList.remove('tool-bar-12px', 'tool-bar-16px', 'tool-bar-24px', 'tool-bar-32px');
      this.element.classList.add('tool-bar-' + size);
    }
  }, {
    key: 'updatePosition',
    value: function updatePosition(position) {
      var _element$classList;

      this.element.classList.remove('tool-bar-top', 'tool-bar-right', 'tool-bar-bottom', 'tool-bar-left', 'tool-bar-horizontal', 'tool-bar-vertical');

      var fullWidth = supportFullWidth && atom.config.get('tool-bar.fullWidth');

      switch (position) {
        case 'Top':
          this.panel = fullWidth ? atom.workspace.addHeaderPanel({ item: this.element }) : atom.workspace.addTopPanel({ item: this.element });
          break;
        case 'Right':
          this.panel = atom.workspace.addRightPanel({ item: this.element });
          break;
        case 'Bottom':
          this.panel = fullWidth ? atom.workspace.addFooterPanel({ item: this.element }) : atom.workspace.addBottomPanel({ item: this.element });
          break;
        case 'Left':
          this.panel = atom.workspace.addLeftPanel({ item: this.element, priority: 50 });
          break;
      }

      var classNames = ['tool-bar-' + position.toLowerCase()];
      if (position === 'Top' || position === 'Bottom') {
        classNames.push('tool-bar-horizontal');
      } else {
        classNames.push('tool-bar-vertical');
      }
      (_element$classList = this.element.classList).add.apply(_element$classList, classNames);

      this.updateMenu(position);
      this.drawGutter();
    }
  }, {
    key: 'updateMenu',
    value: function updateMenu(position) {
      var packagesMenu = atom.menu.template.find(function (_ref4) {
        var label = _ref4.label;
        return label === 'Packages' || label === '&Packages';
      });

      var toolBarMenu = packagesMenu && packagesMenu.submenu.find(function (_ref5) {
        var label = _ref5.label;
        return label === 'Tool Bar' || label === '&Tool Bar';
      });

      var positionsMenu = toolBarMenu && toolBarMenu.submenu.find(function (_ref6) {
        var label = _ref6.label;
        return label === 'Position' || label === '&Position';
      });

      var positionMenu = positionMenu && positionsMenu.submenu.find(function (_ref7) {
        var label = _ref7.label;
        return label === position;
      });

      if (positionMenu) {
        positionMenu.checked = true;
      }
    }
  }, {
    key: 'drawGutter',
    value: function drawGutter() {
      this.element.classList.remove('gutter-top', 'gutter-bottom');

      var visibleHeight = this.element.offsetHeight;
      var scrollHeight = this.element.scrollHeight;
      var hiddenHeight = scrollHeight - visibleHeight;

      if (visibleHeight < scrollHeight) {
        if (this.element.scrollTop > 0) {
          this.element.classList.add('gutter-top');
        }
        if (this.element.scrollTop < hiddenHeight) {
          this.element.classList.add('gutter-bottom');
        }
      }
    }
  }, {
    key: 'hide',
    value: function hide() {
      if (this.panel != null) {
        if (this.element.parentNode) {
          this.element.parentNode.removeChild(this.element);
        }
        this.panel.destroy();
        this.panel = null;
      }
    }
  }, {
    key: 'show',
    value: function show() {
      this.hide();
      this.updatePosition(atom.config.get('tool-bar.position'));
      this.updateSize(atom.config.get('tool-bar.iconSize'));
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      if (this.element.parentNode) {
        this.hide();
        atom.config.set('tool-bar.visible', false);
      } else {
        this.show();
        atom.config.set('tool-bar.visible', true);
      }
    }
  }]);

  return ToolBarView;
})();

exports['default'] = ToolBarView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdGVmYW5vLmNvcmFsbG8vLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy90b29sLWJhci9saWIvdG9vbC1iYXItdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFFMkMsTUFBTTs7QUFGakQsV0FBVyxDQUFDOztBQUlaLElBQU0sZ0JBQWdCLEdBQUcsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsS0FBSyxVQUFVLENBQUM7O0lBRXhELFdBQVc7QUFFbEIsV0FGTyxXQUFXLEdBRWY7OzswQkFGSSxXQUFXOztBQUc1QixRQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDN0MsUUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3ZDLFFBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQztBQUM3QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFDOztBQUUvQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsaUJBQWlCLEVBQUUsWUFBTTtBQUMzRCxZQUFLLE1BQU0sRUFBRSxDQUFDO0tBQ2YsQ0FBQyxFQUNGLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLHVCQUF1QixFQUFFLFlBQU07QUFDakUsWUFBSyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0IsVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDN0MsQ0FBQyxFQUNGLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLHlCQUF5QixFQUFFLFlBQU07QUFDbkUsWUFB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QUMzQixjQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ25EO0FBQ0QsWUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNyQixZQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztPQUNuQjtLQUNGOzs7V0FFSSxnQkFBRztBQUNOLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNaLFVBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO0FBQzFELFVBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO0tBQ3ZEOzs7V0FFTSxrQkFBRztBQUNSLFVBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7QUFDM0IsWUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1osWUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLENBQUM7T0FDNUMsTUFBTTtBQUNMLFlBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNaLFlBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxDQUFDO09BQzNDO0tBQ0Y7OztTQS9Pa0IsV0FBVzs7O3FCQUFYLFdBQVciLCJmaWxlIjoiL1VzZXJzL3N0ZWZhbm8uY29yYWxsby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL3Rvb2wtYmFyL2xpYi90b29sLWJhci12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlcn0gZnJvbSAnYXRvbSc7XG5cbmNvbnN0IHN1cHBvcnRGdWxsV2lkdGggPSB0eXBlb2YgYXRvbS53b3Jrc3BhY2UuYWRkSGVhZGVyUGFuZWwgPT09ICdmdW5jdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvb2xCYXJWaWV3IHtcblxuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3Rvb2wtYmFyJyk7XG4gICAgdGhpcy5pdGVtcyA9IFtdO1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAndG9vbC1iYXI6dG9nZ2xlJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnRvZ2dsZSgpO1xuICAgICAgfSksXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAndG9vbC1iYXI6cG9zaXRpb24tdG9wJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uKCdUb3AnKTtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCd0b29sLWJhci5wb3NpdGlvbicsICdUb3AnKTtcbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ3Rvb2wtYmFyOnBvc2l0aW9uLXJpZ2h0JywgKCkgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uKCdSaWdodCcpO1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ3Rvb2wtYmFyLnBvc2l0aW9uJywgJ1JpZ2h0Jyk7XG4gICAgICB9KSxcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICd0b29sLWJhcjpwb3NpdGlvbi1ib3R0b20nLCAoKSA9PiB7XG4gICAgICAgIHRoaXMudXBkYXRlUG9zaXRpb24oJ0JvdHRvbScpO1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ3Rvb2wtYmFyLnBvc2l0aW9uJywgJ0JvdHRvbScpO1xuICAgICAgfSksXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAndG9vbC1iYXI6cG9zaXRpb24tbGVmdCcsICgpID0+IHtcbiAgICAgICAgdGhpcy51cGRhdGVQb3NpdGlvbignTGVmdCcpO1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ3Rvb2wtYmFyLnBvc2l0aW9uJywgJ0xlZnQnKTtcbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgndG9vbC1iYXIuaWNvblNpemUnLCBuZXdWYWx1ZSA9PiB7XG4gICAgICAgIHRoaXMudXBkYXRlU2l6ZShuZXdWYWx1ZSk7XG4gICAgICB9KSxcbiAgICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCd0b29sLWJhci5wb3NpdGlvbicsICh7bmV3VmFsdWUsIG9sZFZhbHVlfSkgPT4ge1xuICAgICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCd0b29sLWJhci52aXNpYmxlJykpIHtcbiAgICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgndG9vbC1iYXIudmlzaWJsZScsICh7bmV3VmFsdWUsIG9sZFZhbHVlfSkgPT4ge1xuICAgICAgICBpZiAobmV3VmFsdWUpIHtcbiAgICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuXG4gICAgaWYgKHN1cHBvcnRGdWxsV2lkdGgpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCd0b29sLWJhci5mdWxsV2lkdGgnLCAoe25ld1ZhbHVlLCBvbGRWYWx1ZX0pID0+IHtcbiAgICAgICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCd0b29sLWJhci52aXNpYmxlJykpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgndG9vbC1iYXIudmlzaWJsZScpKSB7XG4gICAgICB0aGlzLnNob3coKTtcbiAgICB9XG5cbiAgICB0aGlzLmRyYXdHdXR0ZXIgPSB0aGlzLmRyYXdHdXR0ZXIuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLmRyYXdHdXR0ZXIpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLmRyYXdHdXR0ZXIpO1xuICB9XG5cbiAgYWRkSXRlbSAobmV3SXRlbSkge1xuICAgIG5ld0l0ZW0ucHJpb3JpdHkgPSB0aGlzLmNhbGN1bGF0ZVByaW9yaXR5KG5ld0l0ZW0pO1xuXG4gICAgaWYgKGF0b20uZGV2TW9kZSkge1xuICAgICAgbmV3SXRlbS5lbGVtZW50LmRhdGFzZXQuZ3JvdXAgPSBuZXdJdGVtLmdyb3VwO1xuICAgICAgbmV3SXRlbS5lbGVtZW50LmRhdGFzZXQucHJpb3JpdHkgPSBuZXdJdGVtLnByaW9yaXR5O1xuICAgIH1cblxuICAgIGxldCBpbmRleCA9IHRoaXMuaXRlbXMuZmluZEluZGV4KGV4aXN0aW5nSXRlbSA9PlxuICAgICAgKGV4aXN0aW5nSXRlbS5wcmlvcml0eSA+IG5ld0l0ZW0ucHJpb3JpdHkpKTtcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICBpbmRleCA9IHRoaXMuaXRlbXMubGVuZ3RoO1xuICAgIH1cbiAgICBjb25zdCBuZXh0SXRlbSA9IHRoaXMuaXRlbXNbaW5kZXhdO1xuXG4gICAgdGhpcy5pdGVtcy5zcGxpY2UoaW5kZXgsIDAsIG5ld0l0ZW0pO1xuXG4gICAgdGhpcy5lbGVtZW50Lmluc2VydEJlZm9yZShcbiAgICAgIG5ld0l0ZW0uZWxlbWVudCxcbiAgICAgIG5leHRJdGVtID8gbmV4dEl0ZW0uZWxlbWVudCA6IG51bGxcbiAgICApO1xuXG4gICAgdGhpcy5kcmF3R3V0dGVyKCk7XG5cbiAgICByZXR1cm4gbmV4dEl0ZW07XG4gIH1cblxuICByZW1vdmVJdGVtIChpdGVtKSB7XG4gICAgaXRlbS5kZXN0cm95KCk7XG4gICAgdGhpcy5pdGVtcy5zcGxpY2UodGhpcy5pdGVtcy5pbmRleE9mKGl0ZW0pLCAxKTtcbiAgICB0aGlzLmRyYXdHdXR0ZXIoKTtcbiAgfVxuXG4gIGRlc3Ryb3kgKCkge1xuICAgIHRoaXMuaXRlbXMuZm9yRWFjaChpdGVtID0+IGl0ZW0uZGVzdHJveSgpKTtcbiAgICB0aGlzLml0ZW1zID0gbnVsbDtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbDtcblxuICAgIHRoaXMuaGlkZSgpO1xuICAgIHRoaXMuZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLmRyYXdHdXR0ZXIpO1xuICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XG5cbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5kcmF3R3V0dGVyKTtcblxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZGVzdHJveScpO1xuICAgIHRoaXMuZW1pdHRlci5kaXNwb3NlKCk7XG4gICAgdGhpcy5lbWl0dGVyID0gbnVsbDtcbiAgfVxuXG4gIGNhbGN1bGF0ZVByaW9yaXR5IChpdGVtKSB7XG4gICAgaWYgKCFpc05hTihpdGVtLnByaW9yaXR5KSkge1xuICAgICAgcmV0dXJuIGl0ZW0ucHJpb3JpdHk7XG4gICAgfVxuICAgIGNvbnN0IGxhc3RJdGVtID0gdGhpcy5pdGVtcy5maWx0ZXIoaSA9PiBpLmdyb3VwICE9PSBpdGVtLmdyb3VwKS5wb3AoKTtcbiAgICByZXR1cm4gbGFzdEl0ZW0gJiYgIWlzTmFOKGxhc3RJdGVtLnByaW9yaXR5KVxuICAgICAgPyBsYXN0SXRlbS5wcmlvcml0eSArIDFcbiAgICAgIDogNTA7XG4gIH1cblxuICB1cGRhdGVTaXplIChzaXplKSB7XG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXG4gICAgICAndG9vbC1iYXItMTJweCcsXG4gICAgICAndG9vbC1iYXItMTZweCcsXG4gICAgICAndG9vbC1iYXItMjRweCcsXG4gICAgICAndG9vbC1iYXItMzJweCdcbiAgICApO1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKGB0b29sLWJhci0ke3NpemV9YCk7XG4gIH1cblxuICB1cGRhdGVQb3NpdGlvbiAocG9zaXRpb24pIHtcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcbiAgICAgICd0b29sLWJhci10b3AnLFxuICAgICAgJ3Rvb2wtYmFyLXJpZ2h0JyxcbiAgICAgICd0b29sLWJhci1ib3R0b20nLFxuICAgICAgJ3Rvb2wtYmFyLWxlZnQnLFxuICAgICAgJ3Rvb2wtYmFyLWhvcml6b250YWwnLFxuICAgICAgJ3Rvb2wtYmFyLXZlcnRpY2FsJ1xuICAgICk7XG5cbiAgICBjb25zdCBmdWxsV2lkdGggPSBzdXBwb3J0RnVsbFdpZHRoICYmIGF0b20uY29uZmlnLmdldCgndG9vbC1iYXIuZnVsbFdpZHRoJyk7XG5cbiAgICBzd2l0Y2ggKHBvc2l0aW9uKSB7XG4gICAgICBjYXNlICdUb3AnOlxuICAgICAgICB0aGlzLnBhbmVsID0gZnVsbFdpZHRoXG4gICAgICAgICAgPyBhdG9tLndvcmtzcGFjZS5hZGRIZWFkZXJQYW5lbCh7aXRlbTogdGhpcy5lbGVtZW50fSlcbiAgICAgICAgICA6IGF0b20ud29ya3NwYWNlLmFkZFRvcFBhbmVsKHtpdGVtOiB0aGlzLmVsZW1lbnR9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdSaWdodCc6XG4gICAgICAgIHRoaXMucGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRSaWdodFBhbmVsKHtpdGVtOiB0aGlzLmVsZW1lbnR9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdCb3R0b20nOlxuICAgICAgICB0aGlzLnBhbmVsID0gZnVsbFdpZHRoXG4gICAgICAgICAgPyBhdG9tLndvcmtzcGFjZS5hZGRGb290ZXJQYW5lbCh7aXRlbTogdGhpcy5lbGVtZW50fSlcbiAgICAgICAgICA6IGF0b20ud29ya3NwYWNlLmFkZEJvdHRvbVBhbmVsKHtpdGVtOiB0aGlzLmVsZW1lbnR9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdMZWZ0JzpcbiAgICAgICAgdGhpcy5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZExlZnRQYW5lbCh7aXRlbTogdGhpcy5lbGVtZW50LCBwcmlvcml0eTogNTB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY29uc3QgY2xhc3NOYW1lcyA9IFtgdG9vbC1iYXItJHtwb3NpdGlvbi50b0xvd2VyQ2FzZSgpfWBdO1xuICAgIGlmIChwb3NpdGlvbiA9PT0gJ1RvcCcgfHwgcG9zaXRpb24gPT09ICdCb3R0b20nKSB7XG4gICAgICBjbGFzc05hbWVzLnB1c2goJ3Rvb2wtYmFyLWhvcml6b250YWwnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2xhc3NOYW1lcy5wdXNoKCd0b29sLWJhci12ZXJ0aWNhbCcpO1xuICAgIH1cbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCguLi5jbGFzc05hbWVzKTtcblxuICAgIHRoaXMudXBkYXRlTWVudShwb3NpdGlvbik7XG4gICAgdGhpcy5kcmF3R3V0dGVyKCk7XG4gIH1cblxuICB1cGRhdGVNZW51IChwb3NpdGlvbikge1xuICAgIGNvbnN0IHBhY2thZ2VzTWVudSA9IGF0b20ubWVudS50ZW1wbGF0ZS5maW5kKCh7bGFiZWx9KSA9PlxuICAgICAgKGxhYmVsID09PSAnUGFja2FnZXMnIHx8IGxhYmVsID09PSAnJlBhY2thZ2VzJykpO1xuXG4gICAgY29uc3QgdG9vbEJhck1lbnUgPSBwYWNrYWdlc01lbnUgJiYgcGFja2FnZXNNZW51LnN1Ym1lbnUuZmluZCgoe2xhYmVsfSkgPT5cbiAgICAgIChsYWJlbCA9PT0gJ1Rvb2wgQmFyJyB8fCBsYWJlbCA9PT0gJyZUb29sIEJhcicpKTtcblxuICAgIGNvbnN0IHBvc2l0aW9uc01lbnUgPSB0b29sQmFyTWVudSAmJiB0b29sQmFyTWVudS5zdWJtZW51LmZpbmQoKHtsYWJlbH0pID0+XG4gICAgICAobGFiZWwgPT09ICdQb3NpdGlvbicgfHwgbGFiZWwgPT09ICcmUG9zaXRpb24nKSk7XG5cbiAgICBjb25zdCBwb3NpdGlvbk1lbnUgPSBwb3NpdGlvbk1lbnUgJiYgcG9zaXRpb25zTWVudS5zdWJtZW51LmZpbmQoKHtsYWJlbH0pID0+XG4gICAgICBsYWJlbCA9PT0gcG9zaXRpb24pO1xuXG4gICAgaWYgKHBvc2l0aW9uTWVudSkge1xuICAgICAgcG9zaXRpb25NZW51LmNoZWNrZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGRyYXdHdXR0ZXIgKCkge1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdndXR0ZXItdG9wJywgJ2d1dHRlci1ib3R0b20nKTtcblxuICAgIGNvbnN0IHZpc2libGVIZWlnaHQgPSB0aGlzLmVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgIGNvbnN0IHNjcm9sbEhlaWdodCA9IHRoaXMuZWxlbWVudC5zY3JvbGxIZWlnaHQ7XG4gICAgY29uc3QgaGlkZGVuSGVpZ2h0ID0gc2Nyb2xsSGVpZ2h0IC0gdmlzaWJsZUhlaWdodDtcblxuICAgIGlmICh2aXNpYmxlSGVpZ2h0IDwgc2Nyb2xsSGVpZ2h0KSB7XG4gICAgICBpZiAodGhpcy5lbGVtZW50LnNjcm9sbFRvcCA+IDApIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2d1dHRlci10b3AnKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmVsZW1lbnQuc2Nyb2xsVG9wIDwgaGlkZGVuSGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdndXR0ZXItYm90dG9tJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGlkZSAoKSB7XG4gICAgaWYgKHRoaXMucGFuZWwgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMuZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudCk7XG4gICAgICB9XG4gICAgICB0aGlzLnBhbmVsLmRlc3Ryb3koKTtcbiAgICAgIHRoaXMucGFuZWwgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHNob3cgKCkge1xuICAgIHRoaXMuaGlkZSgpO1xuICAgIHRoaXMudXBkYXRlUG9zaXRpb24oYXRvbS5jb25maWcuZ2V0KCd0b29sLWJhci5wb3NpdGlvbicpKTtcbiAgICB0aGlzLnVwZGF0ZVNpemUoYXRvbS5jb25maWcuZ2V0KCd0b29sLWJhci5pY29uU2l6ZScpKTtcbiAgfVxuXG4gIHRvZ2dsZSAoKSB7XG4gICAgaWYgKHRoaXMuZWxlbWVudC5wYXJlbnROb2RlKSB7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICAgIGF0b20uY29uZmlnLnNldCgndG9vbC1iYXIudmlzaWJsZScsIGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaG93KCk7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ3Rvb2wtYmFyLnZpc2libGUnLCB0cnVlKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/tool-bar/lib/tool-bar-view.js
