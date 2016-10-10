var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomTernjsView = require('./atom-ternjs-view');

var _atomTernjsView2 = _interopRequireDefault(_atomTernjsView);

var _atomTernjsPackageConfig = require('./atom-ternjs-package-config');

var _atomTernjsPackageConfig2 = _interopRequireDefault(_atomTernjsPackageConfig);

'use babel';

var TypeView = (function (_TernView) {
  _inherits(TypeView, _TernView);

  function TypeView() {
    _classCallCheck(this, TypeView);

    _get(Object.getPrototypeOf(TypeView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(TypeView, [{
    key: 'createdCallback',
    value: function createdCallback() {
      var _this = this;

      this.addEventListener('click', function () {

        _this.getModel().destroyOverlay();
      }, false);

      this.container = document.createElement('div');
      this.appendChild(this.container);
    }
  }, {
    key: 'setData',
    value: function setData(data) {

      if (_atomTernjsPackageConfig2['default'].options.inlineFnCompletionDocumentation) {

        this.container.innerHTML = data.doc ? data.type + '<br /><br />' + data.doc : '' + data.type;

        return;
      }

      this.container.innerHTML = data.type;
    }
  }]);

  return TypeView;
})(_atomTernjsView2['default']);

module.exports = document.registerElement('atom-ternjs-type', {

  prototype: TypeView.prototype
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdGVmYW5vLmNvcmFsbG8vLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtdHlwZS12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OEJBRXFCLG9CQUFvQjs7Ozt1Q0FDZiw4QkFBOEI7Ozs7QUFIeEQsV0FBVyxDQUFDOztJQUtOLFFBQVE7WUFBUixRQUFROztXQUFSLFFBQVE7MEJBQVIsUUFBUTs7K0JBQVIsUUFBUTs7O2VBQVIsUUFBUTs7V0FFRywyQkFBRzs7O0FBRWhCLFVBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBTTs7QUFFbkMsY0FBSyxRQUFRLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQztPQUVsQyxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUVWLFVBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMvQyxVQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUNsQzs7O1dBRU0saUJBQUMsSUFBSSxFQUFFOztBQUVaLFVBQUkscUNBQWMsT0FBTyxDQUFDLCtCQUErQixFQUFFOztBQUV6RCxZQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFNLElBQUksQ0FBQyxJQUFJLG9CQUFlLElBQUksQ0FBQyxHQUFHLFFBQVEsSUFBSSxDQUFDLElBQUksQUFBRSxDQUFDOztBQUU3RixlQUFPO09BQ1I7O0FBRUQsVUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztLQUN0Qzs7O1NBeEJHLFFBQVE7OztBQTJCZCxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsa0JBQWtCLEVBQUU7O0FBRTVELFdBQVMsRUFBRSxRQUFRLENBQUMsU0FBUztDQUM5QixDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL3N0ZWZhbm8uY29yYWxsby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy10eXBlLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IFRlcm5WaWV3IGZyb20gJy4vYXRvbS10ZXJuanMtdmlldyc7XG5pbXBvcnQgcGFja2FnZUNvbmZpZyBmcm9tICcuL2F0b20tdGVybmpzLXBhY2thZ2UtY29uZmlnJztcblxuY2xhc3MgVHlwZVZpZXcgZXh0ZW5kcyBUZXJuVmlldyB7XG5cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuXG4gICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblxuICAgICAgdGhpcy5nZXRNb2RlbCgpLmRlc3Ryb3lPdmVybGF5KCk7XG5cbiAgICB9LCBmYWxzZSk7XG5cbiAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXIpO1xuICB9XG5cbiAgc2V0RGF0YShkYXRhKSB7XG5cbiAgICBpZiAocGFja2FnZUNvbmZpZy5vcHRpb25zLmlubGluZUZuQ29tcGxldGlvbkRvY3VtZW50YXRpb24pIHtcblxuICAgICAgdGhpcy5jb250YWluZXIuaW5uZXJIVE1MID0gZGF0YS5kb2MgPyBgJHtkYXRhLnR5cGV9PGJyIC8+PGJyIC8+JHtkYXRhLmRvY31gIDogYCR7ZGF0YS50eXBlfWA7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbnRhaW5lci5pbm5lckhUTUwgPSBkYXRhLnR5cGU7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2F0b20tdGVybmpzLXR5cGUnLCB7XG5cbiAgcHJvdG90eXBlOiBUeXBlVmlldy5wcm90b3R5cGVcbn0pO1xuIl19
//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/atom-ternjs/lib/atom-ternjs-type-view.js
