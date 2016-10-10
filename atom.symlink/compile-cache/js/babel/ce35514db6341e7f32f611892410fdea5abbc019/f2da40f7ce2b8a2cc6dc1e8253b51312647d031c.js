var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _configTernConfigDocs = require('../config/tern-config-docs');

var _configTernConfigDocs2 = _interopRequireDefault(_configTernConfigDocs);

var _configTernPluginsDefintionsJs = require('../config/tern-plugins-defintions.js');

var _configTernPluginsDefintionsJs2 = _interopRequireDefault(_configTernPluginsDefintionsJs);

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsView = require('./atom-ternjs-view');

var _atomTernjsView2 = _interopRequireDefault(_atomTernjsView);

'use babel';

var templateContainer = '\n\n  <div>\n    <div class="container">\n      <h1 class="title"></h1>\n      <div class="content"></div>\n      <button class="btn atom-ternjs-config-close">Save &amp; Restart Server</button>\n      <button class="btn atom-ternjs-config-close">Cancel</button>\n    </div>\n  </div>\n';

var ConfigView = (function (_TernView) {
  _inherits(ConfigView, _TernView);

  function ConfigView() {
    _classCallCheck(this, ConfigView);

    _get(Object.getPrototypeOf(ConfigView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ConfigView, [{
    key: 'createdCallback',
    value: function createdCallback() {

      this.getModel();

      this.classList.add('atom-ternjs-config');
      this.innerHTML = templateContainer;

      this.containerElement = this.querySelector('.container');
      this.contentElement = this.querySelector('.content');
      this.titleElement = this.querySelector('.title');
      this.buttonClose = this.querySelector('.atom-ternjs-config-close:first-of-type');
      this.buttonCancel = this.querySelector('.atom-ternjs-config-close:last-of-type');
    }
  }, {
    key: 'buildOptionsMarkup',
    value: function buildOptionsMarkup() {

      var projectDir = '';
      var projectConfig = this.getModel().config;

      if (_atomTernjsManager2['default'].client) {

        projectDir = _atomTernjsManager2['default'].client.projectDir;
      }

      this.titleElement.innerHTML = projectDir;

      this.contentElement.appendChild(this.buildRadio('ecmaVersion'));
      this.contentElement.appendChild(this.buildlibs('libs', projectConfig.libs));
      this.contentElement.appendChild(this.buildStringArray(projectConfig.loadEagerly, 'loadEagerly'));
      this.contentElement.appendChild(this.buildStringArray(projectConfig.dontLoad, 'dontLoad'));
      this.contentElement.appendChild(this.buildPlugins('plugins', projectConfig.plugins));
    }
  }, {
    key: 'buildSection',
    value: function buildSection(sectionTitle) {

      var section = document.createElement('section');
      section.classList.add(sectionTitle);

      var header = document.createElement('h2');
      header.innerHTML = sectionTitle;

      section.appendChild(header);

      var docs = _configTernConfigDocs2['default'][sectionTitle].doc;

      if (docs) {

        var doc = document.createElement('p');
        doc.innerHTML = docs;

        section.appendChild(doc);
      }

      return section;
    }
  }, {
    key: 'buildRadio',
    value: function buildRadio(sectionTitle) {
      var _this = this;

      var section = this.buildSection(sectionTitle);

      for (var key of Object.keys(this.getModel().config.ecmaVersions)) {

        var inputWrapper = document.createElement('div');
        inputWrapper.classList.add('input-wrapper');

        var label = document.createElement('span');
        label.innerHTML = key;

        var radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'ecmaVersions';
        radio.checked = this.getModel().config.ecmaVersions[key];
        radio.__ternjs_key = key;

        radio.addEventListener('change', function (e) {

          for (var _key of Object.keys(_this.getModel().config.ecmaVersions)) {

            _this.getModel().config.ecmaVersions[_key] = false;
          }

          _this.getModel().config.ecmaVersions[e.target.__ternjs_key] = e.target.checked;
        }, false);

        inputWrapper.appendChild(label);
        inputWrapper.appendChild(radio);
        section.appendChild(inputWrapper);
      }

      return section;
    }
  }, {
    key: 'buildStringArray',
    value: function buildStringArray(obj, sectionTitle) {

      var section = this.buildSection(sectionTitle);

      for (var path of obj) {

        section.appendChild(this.createInputWrapper(path, sectionTitle));
      }

      if (obj.length === 0) {

        section.appendChild(this.createInputWrapper(null, sectionTitle));
      }

      return section;
    }
  }, {
    key: 'buildPlugins',
    value: function buildPlugins(sectionTitle, availablePlugins) {

      var section = this.buildSection(sectionTitle);

      for (var key of Object.keys(availablePlugins)) {

        var wrapper = document.createElement('p');
        wrapper.appendChild(this.buildBoolean(key, availablePlugins));
        var doc = document.createElement('span');
        doc.innerHTML = _configTernPluginsDefintionsJs2['default'][key] && _configTernPluginsDefintionsJs2['default'][key].doc;
        wrapper.appendChild(doc);
        section.appendChild(wrapper);
      }

      return section;
    }
  }, {
    key: 'buildlibs',
    value: function buildlibs(sectionTitle, availableLibs) {

      var section = this.buildSection(sectionTitle);

      for (var key of Object.keys(availableLibs)) {

        section.appendChild(this.buildBoolean(key, availableLibs));
      }

      return section;
    }
  }, {
    key: 'buildBoolean',
    value: function buildBoolean(option, options) {

      var inputWrapper = document.createElement('div');
      var label = document.createElement('span');
      var checkbox = document.createElement('input');

      inputWrapper.classList.add('input-wrapper');
      label.innerHTML = option;
      checkbox.type = 'checkbox';
      checkbox.checked = options[option]._active;
      checkbox.__ternjs_key = option;
      checkbox.addEventListener('change', function (e) {

        options[e.target.__ternjs_key]._active = e.target.checked;
      }, false);

      inputWrapper.appendChild(label);
      inputWrapper.appendChild(checkbox);

      return inputWrapper;
    }
  }, {
    key: 'createInputWrapper',
    value: function createInputWrapper(path, sectionTitle) {

      var inputWrapper = document.createElement('div');
      var editor = this.createTextEditor(path);

      inputWrapper.classList.add('input-wrapper');
      editor.__ternjs_section = sectionTitle;
      inputWrapper.appendChild(editor);
      inputWrapper.appendChild(this.createAdd(sectionTitle));
      inputWrapper.appendChild(this.createSub(editor));

      return inputWrapper;
    }
  }, {
    key: 'createSub',
    value: function createSub(editor) {
      var _this2 = this;

      var sub = document.createElement('span');
      sub.classList.add('sub');
      sub.classList.add('inline-block');
      sub.classList.add('status-removed');
      sub.classList.add('icon');
      sub.classList.add('icon-diff-removed');

      sub.addEventListener('click', function (e) {

        _this2.getModel().removeEditor(editor);
        var inputWrapper = e.target.closest('.input-wrapper');
        inputWrapper.parentNode.removeChild(inputWrapper);
      }, false);

      return sub;
    }
  }, {
    key: 'createAdd',
    value: function createAdd(sectionTitle) {
      var _this3 = this;

      var add = document.createElement('span');
      add.classList.add('add');
      add.classList.add('inline-block');
      add.classList.add('status-added');
      add.classList.add('icon');
      add.classList.add('icon-diff-added');
      add.addEventListener('click', function (e) {

        e.target.closest('section').appendChild(_this3.createInputWrapper(null, sectionTitle));
      }, false);

      return add;
    }
  }, {
    key: 'createTextEditor',
    value: function createTextEditor(path) {

      var item = document.createElement('atom-text-editor');
      item.setAttribute('mini', true);

      if (path) {

        item.getModel().getBuffer().setText(path);
      }

      this.getModel().editors.push(item);

      return item;
    }
  }, {
    key: 'removeContent',
    value: function removeContent() {

      this.contentElement.innerHTML = '';
    }
  }, {
    key: 'getClose',
    value: function getClose() {

      return this.buttonClose;
    }
  }, {
    key: 'getCancel',
    value: function getCancel() {

      return this.buttonCancel;
    }
  }]);

  return ConfigView;
})(_atomTernjsView2['default']);

module.exports = document.registerElement('atom-ternjs-config', {

  prototype: ConfigView.prototype
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdGVmYW5vLmNvcmFsbG8vLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtY29uZmlnLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQ0FFMkIsNEJBQTRCOzs7OzZDQUN6QixzQ0FBc0M7Ozs7aUNBQ2hELHVCQUF1Qjs7Ozs4QkFDdEIsb0JBQW9COzs7O0FBTHpDLFdBQVcsQ0FBQzs7QUFPWixJQUFNLGlCQUFpQixrU0FVdEIsQ0FBQzs7SUFFSSxVQUFVO1lBQVYsVUFBVTs7V0FBVixVQUFVOzBCQUFWLFVBQVU7OytCQUFWLFVBQVU7OztlQUFWLFVBQVU7O1dBRUMsMkJBQUc7O0FBRWhCLFVBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7QUFFaEIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUN6QyxVQUFJLENBQUMsU0FBUyxHQUFHLGlCQUFpQixDQUFDOztBQUVuQyxVQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN6RCxVQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDckQsVUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ2pELFVBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO0FBQ2pGLFVBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0tBQ2xGOzs7V0FFaUIsOEJBQUc7O0FBRW5CLFVBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztBQUNwQixVQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxDQUFDOztBQUU3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QUFFOztBQUU5RCxXQUFTLEVBQUUsVUFBVSxDQUFDLFNBQVM7Q0FDaEMsQ0FBQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9zdGVmYW5vLmNvcmFsbG8vLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtY29uZmlnLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHRlcm5Db25maWdEb2NzIGZyb20gJy4uL2NvbmZpZy90ZXJuLWNvbmZpZy1kb2NzJztcbmltcG9ydCBwbHVnaW5EZWZpbml0aW9ucyBmcm9tICcuLi9jb25maWcvdGVybi1wbHVnaW5zLWRlZmludGlvbnMuanMnO1xuaW1wb3J0IG1hbmFnZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1tYW5hZ2VyJztcbmltcG9ydCBUZXJuVmlldyBmcm9tICcuL2F0b20tdGVybmpzLXZpZXcnO1xuXG5jb25zdCB0ZW1wbGF0ZUNvbnRhaW5lciA9IGBcblxuICA8ZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cbiAgICAgIDxoMSBjbGFzcz1cInRpdGxlXCI+PC9oMT5cbiAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50XCI+PC9kaXY+XG4gICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGF0b20tdGVybmpzLWNvbmZpZy1jbG9zZVwiPlNhdmUgJmFtcDsgUmVzdGFydCBTZXJ2ZXI8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYXRvbS10ZXJuanMtY29uZmlnLWNsb3NlXCI+Q2FuY2VsPC9idXR0b24+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuYDtcblxuY2xhc3MgQ29uZmlnVmlldyBleHRlbmRzIFRlcm5WaWV3IHtcblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG5cbiAgICB0aGlzLmdldE1vZGVsKCk7XG5cbiAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2F0b20tdGVybmpzLWNvbmZpZycpO1xuICAgIHRoaXMuaW5uZXJIVE1MID0gdGVtcGxhdGVDb250YWluZXI7XG5cbiAgICB0aGlzLmNvbnRhaW5lckVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5jb250YWluZXInKTtcbiAgICB0aGlzLmNvbnRlbnRFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcuY29udGVudCcpO1xuICAgIHRoaXMudGl0bGVFbGVtZW50ID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKTtcbiAgICB0aGlzLmJ1dHRvbkNsb3NlID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcuYXRvbS10ZXJuanMtY29uZmlnLWNsb3NlOmZpcnN0LW9mLXR5cGUnKTtcbiAgICB0aGlzLmJ1dHRvbkNhbmNlbCA9IHRoaXMucXVlcnlTZWxlY3RvcignLmF0b20tdGVybmpzLWNvbmZpZy1jbG9zZTpsYXN0LW9mLXR5cGUnKTtcbiAgfVxuXG4gIGJ1aWxkT3B0aW9uc01hcmt1cCgpIHtcblxuICAgIGxldCBwcm9qZWN0RGlyID0gJyc7XG4gICAgY29uc3QgcHJvamVjdENvbmZpZyA9IHRoaXMuZ2V0TW9kZWwoKS5jb25maWc7XG5cbiAgICBpZiAobWFuYWdlci5jbGllbnQpIHtcblxuICAgICAgcHJvamVjdERpciA9IG1hbmFnZXIuY2xpZW50LnByb2plY3REaXI7XG4gICAgfVxuXG4gICAgdGhpcy50aXRsZUVsZW1lbnQuaW5uZXJIVE1MID0gcHJvamVjdERpcjtcblxuICAgIHRoaXMuY29udGVudEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5idWlsZFJhZGlvKCdlY21hVmVyc2lvbicpKTtcbiAgICB0aGlzLmNvbnRlbnRFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuYnVpbGRsaWJzKCdsaWJzJywgcHJvamVjdENvbmZpZy5saWJzKSk7XG4gICAgdGhpcy5jb250ZW50RWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmJ1aWxkU3RyaW5nQXJyYXkocHJvamVjdENvbmZpZy5sb2FkRWFnZXJseSwgJ2xvYWRFYWdlcmx5JykpO1xuICAgIHRoaXMuY29udGVudEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5idWlsZFN0cmluZ0FycmF5KHByb2plY3RDb25maWcuZG9udExvYWQsICdkb250TG9hZCcpKTtcbiAgICB0aGlzLmNvbnRlbnRFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuYnVpbGRQbHVnaW5zKCdwbHVnaW5zJywgcHJvamVjdENvbmZpZy5wbHVnaW5zKSk7XG4gIH1cblxuICBidWlsZFNlY3Rpb24oc2VjdGlvblRpdGxlKSB7XG5cbiAgICBsZXQgc2VjdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlY3Rpb24nKTtcbiAgICBzZWN0aW9uLmNsYXNzTGlzdC5hZGQoc2VjdGlvblRpdGxlKTtcblxuICAgIGxldCBoZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICAgIGhlYWRlci5pbm5lckhUTUwgPSBzZWN0aW9uVGl0bGU7XG5cbiAgICBzZWN0aW9uLmFwcGVuZENoaWxkKGhlYWRlcik7XG5cbiAgICBjb25zdCBkb2NzID0gdGVybkNvbmZpZ0RvY3Nbc2VjdGlvblRpdGxlXS5kb2M7XG5cbiAgICBpZiAoZG9jcykge1xuXG4gICAgICBsZXQgZG9jID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgZG9jLmlubmVySFRNTCA9IGRvY3M7XG5cbiAgICAgIHNlY3Rpb24uYXBwZW5kQ2hpbGQoZG9jKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VjdGlvbjtcbiAgfVxuXG4gIGJ1aWxkUmFkaW8oc2VjdGlvblRpdGxlKSB7XG5cbiAgICBsZXQgc2VjdGlvbiA9IHRoaXMuYnVpbGRTZWN0aW9uKHNlY3Rpb25UaXRsZSk7XG5cbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyh0aGlzLmdldE1vZGVsKCkuY29uZmlnLmVjbWFWZXJzaW9ucykpIHtcblxuICAgICAgbGV0IGlucHV0V3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgaW5wdXRXcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2lucHV0LXdyYXBwZXInKTtcblxuICAgICAgbGV0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgbGFiZWwuaW5uZXJIVE1MID0ga2V5O1xuXG4gICAgICBsZXQgcmFkaW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgcmFkaW8udHlwZSA9ICdyYWRpbyc7XG4gICAgICByYWRpby5uYW1lID0gJ2VjbWFWZXJzaW9ucyc7XG4gICAgICByYWRpby5jaGVja2VkID0gdGhpcy5nZXRNb2RlbCgpLmNvbmZpZy5lY21hVmVyc2lvbnNba2V5XTtcbiAgICAgIHJhZGlvLl9fdGVybmpzX2tleSA9IGtleTtcblxuICAgICAgcmFkaW8uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcblxuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyh0aGlzLmdldE1vZGVsKCkuY29uZmlnLmVjbWFWZXJzaW9ucykpIHtcblxuICAgICAgICAgIHRoaXMuZ2V0TW9kZWwoKS5jb25maWcuZWNtYVZlcnNpb25zW2tleV0gPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ2V0TW9kZWwoKS5jb25maWcuZWNtYVZlcnNpb25zW2UudGFyZ2V0Ll9fdGVybmpzX2tleV0gPSBlLnRhcmdldC5jaGVja2VkO1xuICAgICAgfSwgZmFsc2UpO1xuXG4gICAgICBpbnB1dFdyYXBwZXIuYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgICAgaW5wdXRXcmFwcGVyLmFwcGVuZENoaWxkKHJhZGlvKTtcbiAgICAgIHNlY3Rpb24uYXBwZW5kQ2hpbGQoaW5wdXRXcmFwcGVyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VjdGlvbjtcbiAgfVxuXG4gIGJ1aWxkU3RyaW5nQXJyYXkob2JqLCBzZWN0aW9uVGl0bGUpIHtcblxuICAgIGxldCBzZWN0aW9uID0gdGhpcy5idWlsZFNlY3Rpb24oc2VjdGlvblRpdGxlKTtcblxuICAgIGZvciAoY29uc3QgcGF0aCBvZiBvYmopIHtcblxuICAgICAgc2VjdGlvbi5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZUlucHV0V3JhcHBlcihwYXRoLCBzZWN0aW9uVGl0bGUpKTtcbiAgICB9XG5cbiAgICBpZiAob2JqLmxlbmd0aCA9PT0gMCkge1xuXG4gICAgICBzZWN0aW9uLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlSW5wdXRXcmFwcGVyKG51bGwsIHNlY3Rpb25UaXRsZSkpO1xuICAgIH1cblxuICAgIHJldHVybiBzZWN0aW9uO1xuICB9XG5cbiAgYnVpbGRQbHVnaW5zKHNlY3Rpb25UaXRsZSwgYXZhaWxhYmxlUGx1Z2lucykge1xuXG4gICAgbGV0IHNlY3Rpb24gPSB0aGlzLmJ1aWxkU2VjdGlvbihzZWN0aW9uVGl0bGUpO1xuXG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoYXZhaWxhYmxlUGx1Z2lucykpIHtcblxuICAgICAgbGV0IHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuYnVpbGRCb29sZWFuKGtleSwgYXZhaWxhYmxlUGx1Z2lucykpO1xuICAgICAgbGV0IGRvYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIGRvYy5pbm5lckhUTUwgPSBwbHVnaW5EZWZpbml0aW9uc1trZXldICYmIHBsdWdpbkRlZmluaXRpb25zW2tleV0uZG9jO1xuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZChkb2MpO1xuICAgICAgc2VjdGlvbi5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VjdGlvbjtcbiAgfVxuXG4gIGJ1aWxkbGlicyhzZWN0aW9uVGl0bGUsIGF2YWlsYWJsZUxpYnMpIHtcblxuICAgIGxldCBzZWN0aW9uID0gdGhpcy5idWlsZFNlY3Rpb24oc2VjdGlvblRpdGxlKTtcblxuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGF2YWlsYWJsZUxpYnMpKSB7XG5cbiAgICAgIHNlY3Rpb24uYXBwZW5kQ2hpbGQodGhpcy5idWlsZEJvb2xlYW4oa2V5LCBhdmFpbGFibGVMaWJzKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlY3Rpb247XG4gIH1cblxuICBidWlsZEJvb2xlYW4ob3B0aW9uLCBvcHRpb25zKSB7XG5cbiAgICBsZXQgaW5wdXRXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbGV0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGxldCBjaGVja2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5cbiAgICBpbnB1dFdyYXBwZXIuY2xhc3NMaXN0LmFkZCgnaW5wdXQtd3JhcHBlcicpO1xuICAgIGxhYmVsLmlubmVySFRNTCA9IG9wdGlvbjtcbiAgICBjaGVja2JveC50eXBlID0gJ2NoZWNrYm94JztcbiAgICBjaGVja2JveC5jaGVja2VkID0gb3B0aW9uc1tvcHRpb25dLl9hY3RpdmU7XG4gICAgY2hlY2tib3guX190ZXJuanNfa2V5ID0gb3B0aW9uO1xuICAgIGNoZWNrYm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChlKSA9PiB7XG5cbiAgICAgIG9wdGlvbnNbZS50YXJnZXQuX190ZXJuanNfa2V5XS5fYWN0aXZlID0gZS50YXJnZXQuY2hlY2tlZDtcblxuICAgIH0sIGZhbHNlKTtcblxuICAgIGlucHV0V3JhcHBlci5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgaW5wdXRXcmFwcGVyLmFwcGVuZENoaWxkKGNoZWNrYm94KTtcblxuICAgIHJldHVybiBpbnB1dFdyYXBwZXI7XG4gIH1cblxuICBjcmVhdGVJbnB1dFdyYXBwZXIocGF0aCwgc2VjdGlvblRpdGxlKSB7XG5cbiAgICBsZXQgaW5wdXRXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbGV0IGVkaXRvciA9IHRoaXMuY3JlYXRlVGV4dEVkaXRvcihwYXRoKTtcblxuICAgIGlucHV0V3JhcHBlci5jbGFzc0xpc3QuYWRkKCdpbnB1dC13cmFwcGVyJyk7XG4gICAgZWRpdG9yLl9fdGVybmpzX3NlY3Rpb24gPSBzZWN0aW9uVGl0bGU7XG4gICAgaW5wdXRXcmFwcGVyLmFwcGVuZENoaWxkKGVkaXRvcik7XG4gICAgaW5wdXRXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlQWRkKHNlY3Rpb25UaXRsZSkpO1xuICAgIGlucHV0V3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZVN1YihlZGl0b3IpKTtcblxuICAgIHJldHVybiBpbnB1dFdyYXBwZXI7XG4gIH1cblxuICBjcmVhdGVTdWIoZWRpdG9yKSB7XG5cbiAgICBsZXQgc3ViID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHN1Yi5jbGFzc0xpc3QuYWRkKCdzdWInKTtcbiAgICBzdWIuY2xhc3NMaXN0LmFkZCgnaW5saW5lLWJsb2NrJyk7XG4gICAgc3ViLmNsYXNzTGlzdC5hZGQoJ3N0YXR1cy1yZW1vdmVkJyk7XG4gICAgc3ViLmNsYXNzTGlzdC5hZGQoJ2ljb24nKTtcbiAgICBzdWIuY2xhc3NMaXN0LmFkZCgnaWNvbi1kaWZmLXJlbW92ZWQnKTtcblxuICAgIHN1Yi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG5cbiAgICAgIHRoaXMuZ2V0TW9kZWwoKS5yZW1vdmVFZGl0b3IoZWRpdG9yKTtcbiAgICAgIGNvbnN0IGlucHV0V3JhcHBlciA9IGUudGFyZ2V0LmNsb3Nlc3QoJy5pbnB1dC13cmFwcGVyJyk7XG4gICAgICBpbnB1dFdyYXBwZXIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChpbnB1dFdyYXBwZXIpO1xuXG4gICAgfSwgZmFsc2UpO1xuXG4gICAgcmV0dXJuIHN1YjtcbiAgfVxuXG4gIGNyZWF0ZUFkZChzZWN0aW9uVGl0bGUpIHtcblxuICAgIGxldCBhZGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgYWRkLmNsYXNzTGlzdC5hZGQoJ2FkZCcpO1xuICAgIGFkZC5jbGFzc0xpc3QuYWRkKCdpbmxpbmUtYmxvY2snKTtcbiAgICBhZGQuY2xhc3NMaXN0LmFkZCgnc3RhdHVzLWFkZGVkJyk7XG4gICAgYWRkLmNsYXNzTGlzdC5hZGQoJ2ljb24nKTtcbiAgICBhZGQuY2xhc3NMaXN0LmFkZCgnaWNvbi1kaWZmLWFkZGVkJyk7XG4gICAgYWRkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcblxuICAgICAgZS50YXJnZXQuY2xvc2VzdCgnc2VjdGlvbicpLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlSW5wdXRXcmFwcGVyKG51bGwsIHNlY3Rpb25UaXRsZSkpO1xuXG4gICAgfSwgZmFsc2UpO1xuXG4gICAgcmV0dXJuIGFkZDtcbiAgfVxuXG4gIGNyZWF0ZVRleHRFZGl0b3IocGF0aCkge1xuXG4gICAgbGV0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdG9tLXRleHQtZWRpdG9yJyk7XG4gICAgaXRlbS5zZXRBdHRyaWJ1dGUoJ21pbmknLCB0cnVlKTtcblxuICAgIGlmIChwYXRoKSB7XG5cbiAgICAgIGl0ZW0uZ2V0TW9kZWwoKS5nZXRCdWZmZXIoKS5zZXRUZXh0KHBhdGgpO1xuICAgIH1cblxuICAgIHRoaXMuZ2V0TW9kZWwoKS5lZGl0b3JzLnB1c2goaXRlbSk7XG5cbiAgICByZXR1cm4gaXRlbTtcbiAgfVxuXG4gIHJlbW92ZUNvbnRlbnQoKSB7XG5cbiAgICB0aGlzLmNvbnRlbnRFbGVtZW50LmlubmVySFRNTCA9ICcnO1xuICB9XG5cbiAgZ2V0Q2xvc2UoKSB7XG5cbiAgICByZXR1cm4gdGhpcy5idXR0b25DbG9zZTtcbiAgfVxuXG4gIGdldENhbmNlbCgpIHtcblxuICAgIHJldHVybiB0aGlzLmJ1dHRvbkNhbmNlbDtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnYXRvbS10ZXJuanMtY29uZmlnJywge1xuXG4gIHByb3RvdHlwZTogQ29uZmlnVmlldy5wcm90b3R5cGVcbn0pO1xuIl19
//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/atom-ternjs/lib/atom-ternjs-config-view.js
