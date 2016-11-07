var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var EditorconfigWrapGuideElement = (function (_HTMLDivElement) {
	_inherits(EditorconfigWrapGuideElement, _HTMLDivElement);

	function EditorconfigWrapGuideElement() {
		_classCallCheck(this, EditorconfigWrapGuideElement);

		_get(Object.getPrototypeOf(EditorconfigWrapGuideElement.prototype), 'constructor', this).apply(this, arguments);
	}

	_createClass(EditorconfigWrapGuideElement, [{
		key: 'initialize',
		// eslint-disable-line no-undef
		value: function initialize(editor, editorElement) {
			this.classList.add('ecfg-wrap-guide');
			this.editorElement = editorElement;
			this.editor = editor;
			this.visible = true;

			this.attachToLines();
			this.update();
		}
	}, {
		key: 'attachToLines',
		value: function attachToLines() {
			var editorElement = this.editorElement;

			if (editorElement && editorElement.rootElement) {
				var lines = editorElement.rootElement.querySelector('.lines');
				if (lines) {
					lines.appendChild(this);
				}
			}
		}
	}, {
		key: 'update',
		value: function update() {
			var editorElement = this.editorElement;
			// eslint-disable-next-line camelcase
			var max_line_length = this.editor.getBuffer().editorconfig.settings.max_line_length;

			if (max_line_length === 'auto') {
				// eslint-disable-line camelcase
				this.style.display = 'none';
				this.visible = false;
			} else {
				// eslint-disable-next-line camelcase
				var columnWidth = editorElement.getDefaultCharacterWidth() * max_line_length;
				if (editorElement.logicalDisplayBuffer) {
					columnWidth -= editorElement.getScrollLeft();
				} else {
					columnWidth -= this.editor.getScrollLeft();
				}
				this.style.left = Math.round(columnWidth) + 'px';
				this.style.display = 'block';
				this.visible = true;
			}
		}
	}, {
		key: 'isVisible',
		value: function isVisible() {
			return this.visible === true;
		}
	}]);

	return EditorconfigWrapGuideElement;
})(HTMLDivElement);

module.exports = document.registerElement('ecfg-wrap-guide', {
	'extends': 'div',
	prototype: EditorconfigWrapGuideElement.prototype
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3N0ZWZhbm8vLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy9lZGl0b3Jjb25maWcvbGliL3dyYXBndWlkZS12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFFTSw0QkFBNEI7V0FBNUIsNEJBQTRCOztVQUE1Qiw0QkFBNEI7d0JBQTVCLDRCQUE0Qjs7NkJBQTVCLDRCQUE0Qjs7O2NBQTVCLDRCQUE0Qjs7O1NBQ3ZCLG9CQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUU7QUFDakMsT0FBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN0QyxPQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztBQUNuQyxPQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyQixPQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQzs7QUFFcEIsT0FBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQ3JCLE9BQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztHQUNkOzs7U0FFWSx5QkFBRztBQUNmLE9BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7O0FBRXpDLE9BQUksYUFBYSxJQUNoQixhQUFhLENBQUMsV0FBVyxFQUFFO0FBQzNCLFFBQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2hFLFFBQUksS0FBSyxFQUFFO0FBQ1YsVUFBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN4QjtJQUNEO0dBQ0Q7OztTQUVLLGtCQUFHO0FBQ1IsT0FBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQzs7QUFFekMsT0FBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQzs7QUFFdEYsT0FBSSxlQUFlLEtBQUssTUFBTSxFQUFFOztBQUMvQixRQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDNUIsUUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDckIsTUFBTTs7QUFFTixRQUFJLFdBQVcsR0FBRyxhQUFhLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxlQUFlLENBQUM7QUFDN0UsUUFBSSxhQUFhLENBQUMsb0JBQW9CLEVBQUU7QUFDdkMsZ0JBQVcsSUFBSSxhQUFhLENBQUMsYUFBYSxFQUFFLENBQUM7S0FDN0MsTUFBTTtBQUNOLGdCQUFXLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztLQUMzQztBQUNELFFBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQUksQ0FBQztBQUNqRCxRQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDN0IsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDcEI7R0FDRDs7O1NBRVEscUJBQUc7QUFDWCxVQUFPLElBQUksQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDO0dBQzdCOzs7UUEvQ0ksNEJBQTRCO0dBQVMsY0FBYzs7QUFrRHpELE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsRUFBRTtBQUM1RCxZQUFTLEtBQUs7QUFDZCxVQUFTLEVBQUUsNEJBQTRCLENBQUMsU0FBUztDQUNqRCxDQUFDLENBQUMiLCJmaWxlIjoiL2hvbWUvc3RlZmFuby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2VkaXRvcmNvbmZpZy9saWIvd3JhcGd1aWRlLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmNsYXNzIEVkaXRvcmNvbmZpZ1dyYXBHdWlkZUVsZW1lbnQgZXh0ZW5kcyBIVE1MRGl2RWxlbWVudCB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcblx0aW5pdGlhbGl6ZShlZGl0b3IsIGVkaXRvckVsZW1lbnQpIHtcblx0XHR0aGlzLmNsYXNzTGlzdC5hZGQoJ2VjZmctd3JhcC1ndWlkZScpO1xuXHRcdHRoaXMuZWRpdG9yRWxlbWVudCA9IGVkaXRvckVsZW1lbnQ7XG5cdFx0dGhpcy5lZGl0b3IgPSBlZGl0b3I7XG5cdFx0dGhpcy52aXNpYmxlID0gdHJ1ZTtcblxuXHRcdHRoaXMuYXR0YWNoVG9MaW5lcygpO1xuXHRcdHRoaXMudXBkYXRlKCk7XG5cdH1cblxuXHRhdHRhY2hUb0xpbmVzKCkge1xuXHRcdGNvbnN0IGVkaXRvckVsZW1lbnQgPSB0aGlzLmVkaXRvckVsZW1lbnQ7XG5cblx0XHRpZiAoZWRpdG9yRWxlbWVudCAmJlxuXHRcdFx0ZWRpdG9yRWxlbWVudC5yb290RWxlbWVudCkge1xuXHRcdFx0Y29uc3QgbGluZXMgPSBlZGl0b3JFbGVtZW50LnJvb3RFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5saW5lcycpO1xuXHRcdFx0aWYgKGxpbmVzKSB7XG5cdFx0XHRcdGxpbmVzLmFwcGVuZENoaWxkKHRoaXMpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHVwZGF0ZSgpIHtcblx0XHRjb25zdCBlZGl0b3JFbGVtZW50ID0gdGhpcy5lZGl0b3JFbGVtZW50O1xuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjYW1lbGNhc2Vcblx0XHRjb25zdCBtYXhfbGluZV9sZW5ndGggPSB0aGlzLmVkaXRvci5nZXRCdWZmZXIoKS5lZGl0b3Jjb25maWcuc2V0dGluZ3MubWF4X2xpbmVfbGVuZ3RoO1xuXG5cdFx0aWYgKG1heF9saW5lX2xlbmd0aCA9PT0gJ2F1dG8nKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY2FtZWxjYXNlXG5cdFx0XHR0aGlzLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0XHR0aGlzLnZpc2libGUgPSBmYWxzZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNhbWVsY2FzZVxuXHRcdFx0bGV0IGNvbHVtbldpZHRoID0gZWRpdG9yRWxlbWVudC5nZXREZWZhdWx0Q2hhcmFjdGVyV2lkdGgoKSAqIG1heF9saW5lX2xlbmd0aDtcblx0XHRcdGlmIChlZGl0b3JFbGVtZW50LmxvZ2ljYWxEaXNwbGF5QnVmZmVyKSB7XG5cdFx0XHRcdGNvbHVtbldpZHRoIC09IGVkaXRvckVsZW1lbnQuZ2V0U2Nyb2xsTGVmdCgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29sdW1uV2lkdGggLT0gdGhpcy5lZGl0b3IuZ2V0U2Nyb2xsTGVmdCgpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5zdHlsZS5sZWZ0ID0gYCR7TWF0aC5yb3VuZChjb2x1bW5XaWR0aCl9cHhgO1xuXHRcdFx0dGhpcy5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblx0XHRcdHRoaXMudmlzaWJsZSA9IHRydWU7XG5cdFx0fVxuXHR9XG5cblx0aXNWaXNpYmxlKCkge1xuXHRcdHJldHVybiB0aGlzLnZpc2libGUgPT09IHRydWU7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2VjZmctd3JhcC1ndWlkZScsIHtcblx0ZXh0ZW5kczogJ2RpdicsXG5cdHByb3RvdHlwZTogRWRpdG9yY29uZmlnV3JhcEd1aWRlRWxlbWVudC5wcm90b3R5cGVcbn0pO1xuIl19
//# sourceURL=/home/stefano/.dotfiles/atom.symlink/packages/editorconfig/lib/wrapguide-view.js
