'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ToolBarSpacerView = (function () {
  function ToolBarSpacerView(options) {
    var _element$classList;

    _classCallCheck(this, ToolBarSpacerView);

    this.element = document.createElement('hr');
    this.priority = options && options.priority;
    var classNames = ['tool-bar-spacer'];
    if (this.priority < 0) {
      classNames.push('tool-bar-item-align-end');
    }
    (_element$classList = this.element.classList).add.apply(_element$classList, classNames);
  }

  _createClass(ToolBarSpacerView, [{
    key: 'destroy',
    value: function destroy() {
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
      this.element = null;
    }
  }]);

  return ToolBarSpacerView;
})();

exports['default'] = ToolBarSpacerView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdGVmYW5vLmNvcmFsbG8vLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy90b29sLWJhci9saWIvdG9vbC1iYXItc3BhY2VyLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7O0lBRVMsaUJBQWlCO0FBQ3hCLFdBRE8saUJBQWlCLENBQ3ZCLE9BQU8sRUFBRTs7OzBCQURILGlCQUFpQjs7QUFFbEMsUUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVDLFFBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUM7QUFDNUMsUUFBTSxVQUFVLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3ZDLFFBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUU7QUFDckIsZ0JBQVUsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQztLQUM1QztBQUNELDBCQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFDLEdBQUcsTUFBQSxxQkFBSSxVQUFVLENBQUMsQ0FBQztHQUMzQzs7ZUFUa0IsaUJBQWlCOztXQVc1QixtQkFBRztBQUNULFVBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7QUFDM0IsWUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztPQUNuRDtBQUNELFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0tBQ3JCOzs7U0FoQmtCLGlCQUFpQjs7O3FCQUFqQixpQkFBaUIiLCJmaWxlIjoiL1VzZXJzL3N0ZWZhbm8uY29yYWxsby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL3Rvb2wtYmFyL2xpYi90b29sLWJhci1zcGFjZXItdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb29sQmFyU3BhY2VyVmlldyB7XG4gIGNvbnN0cnVjdG9yIChvcHRpb25zKSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaHInKTtcbiAgICB0aGlzLnByaW9yaXR5ID0gb3B0aW9ucyAmJiBvcHRpb25zLnByaW9yaXR5O1xuICAgIGNvbnN0IGNsYXNzTmFtZXMgPSBbJ3Rvb2wtYmFyLXNwYWNlciddO1xuICAgIGlmICh0aGlzLnByaW9yaXR5IDwgMCkge1xuICAgICAgY2xhc3NOYW1lcy5wdXNoKCd0b29sLWJhci1pdGVtLWFsaWduLWVuZCcpO1xuICAgIH1cbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCguLi5jbGFzc05hbWVzKTtcbiAgfVxuXG4gIGRlc3Ryb3kgKCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnQucGFyZW50Tm9kZSkge1xuICAgICAgdGhpcy5lbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KTtcbiAgICB9XG4gICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcbiAgfVxufVxuIl19
//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/tool-bar/lib/tool-bar-spacer-view.js
