var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomTernjsView = require('./atom-ternjs-view');

var _atomTernjsView2 = _interopRequireDefault(_atomTernjsView);

'use babel';

var RenameView = (function (_TernView) {
  _inherits(RenameView, _TernView);

  function RenameView() {
    _classCallCheck(this, RenameView);

    _get(Object.getPrototypeOf(RenameView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(RenameView, [{
    key: 'createdCallback',
    value: function createdCallback() {
      var _this = this;

      this.classList.add('atom-ternjs-rename');

      var container = document.createElement('div');
      var wrapper = document.createElement('div');

      var title = document.createElement('h1');
      title.innerHTML = 'Rename';

      var sub = document.createElement('h2');
      sub.innerHTML = 'Rename a variable in a scope-aware way. (experimental)';

      var buttonClose = document.createElement('button');
      buttonClose.innerHTML = 'Close';
      buttonClose.id = 'close';
      buttonClose.classList.add('btn');
      buttonClose.classList.add('atom-ternjs-rename-close');

      buttonClose.addEventListener('click', function (e) {

        _this.model.hide();
      });

      this.nameEditor = document.createElement('atom-text-editor');
      this.nameEditor.setAttribute('mini', true);
      this.nameEditor.addEventListener('core:confirm', this.rename.bind(this));

      var buttonRename = document.createElement('button');
      buttonRename.innerHTML = 'Rename';
      buttonRename.id = 'close';
      buttonRename.classList.add('btn');
      buttonRename.classList.add('mt');
      buttonRename.addEventListener('click', this.rename.bind(this));

      wrapper.appendChild(title);
      wrapper.appendChild(sub);
      wrapper.appendChild(this.nameEditor);
      wrapper.appendChild(buttonClose);
      wrapper.appendChild(buttonRename);
      container.appendChild(wrapper);

      this.appendChild(container);
    }
  }, {
    key: 'rename',
    value: function rename() {

      var text = this.nameEditor.getModel().getBuffer().getText();

      if (!text) {

        return;
      }

      this.model.updateAllAndRename(text);
    }
  }]);

  return RenameView;
})(_atomTernjsView2['default']);

module.exports = document.registerElement('atom-ternjs-rename', {

  prototype: RenameView.prototype
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdGVmYW5vLmNvcmFsbG8vLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtcmVuYW1lLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs4QkFFcUIsb0JBQW9COzs7O0FBRnpDLFdBQVcsQ0FBQzs7SUFJTixVQUFVO1lBQVYsVUFBVTs7V0FBVixVQUFVOzBCQUFWLFVBQVU7OytCQUFWLFVBQVU7OztlQUFWLFVBQVU7O1dBRUMsMkJBQUc7OztBQUVoQixVQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDOztBQUV6QyxVQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hELFVBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRTlDLFVBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekMsV0FBSyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7O0FBRTNCLFVBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkMsU0FBRyxDQUFDLFNBQVMsR0FBRyx3REFBd0QsQ0FBQzs7QUFFekUsVUFBSSxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNuRCxpQkFBVyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7QUFDaEMsaUJBQVcsQ0FBQyxFQUFFLEdBQUcsT0FBTyxDQUFDO0FBQ3pCLGlCQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNqQyxpQkFBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUMsQ0FBQzs7QUFFdEQsaUJBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBQyxDQUFDLEVBQUs7O0FBRTNDLGNBQUssS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO09BQ25CLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUM3RCxVQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDM0MsVUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFFekUsVUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNwRCxrQkFBWSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7QUFDbEMsa0JBQVksQ0FBQyxFQUFFLEdBQUcsT0FBTyxDQUFDO0FBQzFCLGtCQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNsQyxrQkFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakMsa0JBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFFL0QsYUFBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzQixhQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pCLGFBQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3JDLGFBQU8sQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDakMsYUFBTyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNsQyxlQUFTLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUUvQixVQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzdCOzs7V0FFSyxrQkFBRzs7QUFFUCxVQUFNLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUU5RCxVQUFJLENBQUMsSUFBSSxFQUFFOztBQUVULGVBQU87T0FDUjs7QUFFRCxVQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3JDOzs7U0F6REcsVUFBVTs7O0FBNERoQixNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsb0JBQW9CLEVBQUU7O0FBRTlELFdBQVMsRUFBRSxVQUFVLENBQUMsU0FBUztDQUNoQyxDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL3N0ZWZhbm8uY29yYWxsby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1yZW5hbWUtdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgVGVyblZpZXcgZnJvbSAnLi9hdG9tLXRlcm5qcy12aWV3JztcblxuY2xhc3MgUmVuYW1lVmlldyBleHRlbmRzIFRlcm5WaWV3IHtcblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG5cbiAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2F0b20tdGVybmpzLXJlbmFtZScpO1xuXG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgbGV0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDEnKTtcbiAgICB0aXRsZS5pbm5lckhUTUwgPSAnUmVuYW1lJztcblxuICAgIGxldCBzdWIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICAgIHN1Yi5pbm5lckhUTUwgPSAnUmVuYW1lIGEgdmFyaWFibGUgaW4gYSBzY29wZS1hd2FyZSB3YXkuIChleHBlcmltZW50YWwpJztcblxuICAgIGxldCBidXR0b25DbG9zZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGJ1dHRvbkNsb3NlLmlubmVySFRNTCA9ICdDbG9zZSc7XG4gICAgYnV0dG9uQ2xvc2UuaWQgPSAnY2xvc2UnO1xuICAgIGJ1dHRvbkNsb3NlLmNsYXNzTGlzdC5hZGQoJ2J0bicpO1xuICAgIGJ1dHRvbkNsb3NlLmNsYXNzTGlzdC5hZGQoJ2F0b20tdGVybmpzLXJlbmFtZS1jbG9zZScpO1xuXG4gICAgYnV0dG9uQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXG4gICAgICB0aGlzLm1vZGVsLmhpZGUoKTtcbiAgICB9KTtcblxuICAgIHRoaXMubmFtZUVkaXRvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F0b20tdGV4dC1lZGl0b3InKTtcbiAgICB0aGlzLm5hbWVFZGl0b3Iuc2V0QXR0cmlidXRlKCdtaW5pJywgdHJ1ZSk7XG4gICAgdGhpcy5uYW1lRWRpdG9yLmFkZEV2ZW50TGlzdGVuZXIoJ2NvcmU6Y29uZmlybScsIHRoaXMucmVuYW1lLmJpbmQodGhpcykpO1xuXG4gICAgbGV0IGJ1dHRvblJlbmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGJ1dHRvblJlbmFtZS5pbm5lckhUTUwgPSAnUmVuYW1lJztcbiAgICBidXR0b25SZW5hbWUuaWQgPSAnY2xvc2UnO1xuICAgIGJ1dHRvblJlbmFtZS5jbGFzc0xpc3QuYWRkKCdidG4nKTtcbiAgICBidXR0b25SZW5hbWUuY2xhc3NMaXN0LmFkZCgnbXQnKTtcbiAgICBidXR0b25SZW5hbWUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnJlbmFtZS5iaW5kKHRoaXMpKTtcblxuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQodGl0bGUpO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoc3ViKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHRoaXMubmFtZUVkaXRvcik7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChidXR0b25DbG9zZSk7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChidXR0b25SZW5hbWUpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcblxuICAgIHRoaXMuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgfVxuXG4gIHJlbmFtZSgpIHtcblxuICAgIGNvbnN0IHRleHQgPSB0aGlzLm5hbWVFZGl0b3IuZ2V0TW9kZWwoKS5nZXRCdWZmZXIoKS5nZXRUZXh0KCk7XG5cbiAgICBpZiAoIXRleHQpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubW9kZWwudXBkYXRlQWxsQW5kUmVuYW1lKHRleHQpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdhdG9tLXRlcm5qcy1yZW5hbWUnLCB7XG5cbiAgcHJvdG90eXBlOiBSZW5hbWVWaWV3LnByb3RvdHlwZVxufSk7XG4iXX0=
//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/atom-ternjs/lib/atom-ternjs-rename-view.js
