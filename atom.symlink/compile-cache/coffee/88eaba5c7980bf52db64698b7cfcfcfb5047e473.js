(function() {
  var AutoIndent, Point, Range, fs, path, _ref;

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point;

  fs = require('fs-plus');

  path = require('path');

  AutoIndent = require('../lib/auto-indent');

  describe('auto-indent', function() {
    var autoIndent, editor, notifications, sourceCode, sourceCodeRange, _ref1;
    _ref1 = [], autoIndent = _ref1[0], editor = _ref1[1], notifications = _ref1[2], sourceCode = _ref1[3], sourceCodeRange = _ref1[4];
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.packages.activatePackage('language-babel');
      });
    });
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open('non-existent.js').then(function(o) {
          return editor = o;
        });
      });
      return runs(function() {
        autoIndent = new AutoIndent(editor);
        return notifications = atom.notifications;
      });
    });
    describe('::constructor', function() {
      return it(' should setup some valid indentation defaults', function() {
        var expectedResult;
        expectedResult = {
          jsxIndent: [1, 1],
          jsxIndentProps: [1, 1],
          jsxClosingBracketLocation: [
            1, {
              selfClosing: 'tag-aligned',
              nonEmpty: 'tag-aligned'
            }
          ]
        };
        return expect(autoIndent.eslintIndentOptions).toEqual(expectedResult);
      });
    });
    describe('::getEslintrcFilename', function() {
      it('returns a correct project path for the source file', function() {
        return expect(path.dirname(autoIndent.getEslintrcFilename())).toEqual(path.dirname(editor.getPath()));
      });
      return it('returns a .eslintrc file name', function() {
        return expect(path.basename(autoIndent.getEslintrcFilename())).toEqual('.eslintrc');
      });
    });
    return describe('::readEslintrcOptions', function() {
      it('returns an empty object on a missing .eslintrc', function() {
        return expect(autoIndent.readEslintrcOptions('.missing')).toEqual({});
      });
      it('returns and empty Object and a notification message on bad eslint', function() {
        var obj;
        spyOn(fs, 'existsSync').andReturn(true);
        spyOn(fs, 'readFileSync').andReturn('{');
        spyOn(notifications, 'addError').andCallThrough();
        obj = autoIndent.readEslintrcOptions();
        expect(notifications.addError).toHaveBeenCalled();
        return expect(obj).toEqual({});
      });
      it('returns an empty Object when eslint with no rules is read', function() {
        var obj;
        spyOn(fs, 'existsSync').andReturn(true);
        spyOn(fs, 'readFileSync').andReturn('{}');
        spyOn(notifications, 'addError').andCallThrough();
        obj = autoIndent.readEslintrcOptions();
        expect(notifications.addError).not.toHaveBeenCalled();
        return expect(obj).toEqual({});
      });
      describe('::translateIndentOptions', function() {
        it('should return expected defaults when no object is input', function() {
          var expectedResult, result;
          result = autoIndent.translateIndentOptions();
          expectedResult = {
            jsxIndent: [1, 1],
            jsxIndentProps: [1, 1],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tag-aligned',
                nonEmpty: 'tag-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
        it('should return expected defaults when no valid object is input', function() {
          var expectedResult, result;
          result = autoIndent.translateIndentOptions({});
          expectedResult = {
            jsxIndent: [1, 1],
            jsxIndentProps: [1, 1],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tag-aligned',
                nonEmpty: 'tag-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
        it('should return two tab markers for jsx and props when an indent of 4 spaces is found', function() {
          var expectedResult, result, rules;
          rules = {
            "indent": [1, 4]
          };
          result = autoIndent.translateIndentOptions(rules);
          expectedResult = {
            jsxIndent: [1, 2],
            jsxIndentProps: [1, 2],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tag-aligned',
                nonEmpty: 'tag-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
        it('should return one tab markers for jsx and props when an indent "tab" is found', function() {
          var expectedResult, result, rules;
          rules = {
            "indent": [1, "tab"]
          };
          result = autoIndent.translateIndentOptions(rules);
          expectedResult = {
            jsxIndent: [1, 1],
            jsxIndentProps: [1, 1],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tag-aligned',
                nonEmpty: 'tag-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
        it('should return jsxIndent of 2 tabs and jsxIndentProps of 3', function() {
          var expectedResult, result, rules;
          rules = {
            "indent": [1, 6],
            "react/jsx-indent": ["warn", 4]
          };
          result = autoIndent.translateIndentOptions(rules);
          expectedResult = {
            jsxIndent: ['warn', 2],
            jsxIndentProps: [1, 3],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tag-aligned',
                nonEmpty: 'tag-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
        it('should return jsxIndent of 2 tabs and jsxIndentProps of 2', function() {
          var expectedResult, result, rules;
          rules = {
            "indent": [1, 6],
            "react/jsx-indent": ["warn", 4],
            "react/jsx-indent-props": [2, 4]
          };
          result = autoIndent.translateIndentOptions(rules);
          expectedResult = {
            jsxIndent: ['warn', 2],
            jsxIndentProps: [2, 2],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tag-aligned',
                nonEmpty: 'tag-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
        it('should return jsxIndent of 2 tabs and jsxIndentProps of 2, line-aligned', function() {
          var expectedResult, result, rules;
          rules = {
            "indent": [1, 6],
            "react/jsx-indent": ["warn", 4],
            "react/jsx-indent-props": [2, 4],
            'react/jsx-closing-bracket-location': [1, 'line-aligned']
          };
          result = autoIndent.translateIndentOptions(rules);
          expectedResult = {
            jsxIndent: ['warn', 2],
            jsxIndentProps: [2, 2],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'line-aligned',
                nonEmpty: 'line-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
        return it('should return jsxIndent of 2 tabs and jsxIndentProps of 2, line-aligned and props-aligned', function() {
          var expectedResult, result, rules;
          rules = {
            "indent": [1, 6],
            "react/jsx-indent": ["warn", 4],
            "react/jsx-indent-props": [2, 4],
            "react/jsx-closing-bracket-location": [
              1, {
                "nonEmpty": "props-aligned",
                "selfClosing": "line-aligned"
              }
            ]
          };
          result = autoIndent.translateIndentOptions(rules);
          expectedResult = {
            jsxIndent: ['warn', 2],
            jsxIndentProps: [2, 2],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'line-aligned',
                nonEmpty: 'props-aligned'
              }
            ]
          };
          return expect(result).toEqual(expectedResult);
        });
      });
      describe('::indentJSX', function() {
        beforeEach(function() {
          sourceCode = "<div className={rootClass}>\n{this._renderPlaceholder()}\n<div\nclassName={cx('DraftEditor/editorContainer')}\nkey={'editor' + this.state.containerKey}\nref=\"editorContainer\"\n>\n<div\naria-activedescendant={\nreadOnly ? null : this.props.ariaActiveDescendantID\n}\naria-autocomplete={readOnly ? null : this.props.ariaAutoComplete}\n>\n{this._renderPlaceholder()}\n<Component p1\np2\n/>\n</div>\n{ // tests inline JSX\nif (a) {\nreturn (\n<div></div>\n)\n}\nelse (b) {\nswitch (a) {\ncase 1:\nreturn (\n<div></div>\n)\ndefault:\n}\n}\n}\n</div>\n</div>";
          editor.insertText(sourceCode);
          return sourceCodeRange = new Range(new Point(0, 0), new Point(35, 6));
        });
        it('should indent JSX according to eslint rules', function() {
          var indentedCode;
          indentedCode = "<div className={rootClass}>\n    {this._renderPlaceholder()}\n    <div\n        className={cx('DraftEditor/editorContainer')}\n        key={'editor' + this.state.containerKey}\n        ref=\"editorContainer\"\n    >\n        <div\n            aria-activedescendant={\n                readOnly ? null : this.props.ariaActiveDescendantID\n            }\n            aria-autocomplete={readOnly ? null : this.props.ariaAutoComplete}\n        >\n            {this._renderPlaceholder()}\n            <Component p1\n                p2\n            />\n        </div>\n        { // tests inline JSX\n            if (a) {\n                return (\n                    <div></div>\n                )\n            }\n            else (b) {\n                switch (a) {\n                    case 1:\n                        return (\n                            <div></div>\n                        )\n                    default:\n                }\n            }\n        }\n    </div>\n</div>";
          autoIndent.eslintIndentOptions = {
            jsxIndent: [1, 2],
            jsxIndentProps: [1, 2],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tag-aligned',
                nonEmpty: 'tag-aligned'
              }
            ]
          };
          autoIndent.autoJsx = true;
          autoIndent.indentJSX(sourceCodeRange);
          return expect(editor.getTextInBufferRange(sourceCodeRange)).toEqual(indentedCode);
        });
        return it('should indent JSX according to eslint rules and tag closing alignment', function() {
          var indentedCode;
          indentedCode = "<div className={rootClass}>\n    {this._renderPlaceholder()}\n    <div\n        className={cx('DraftEditor/editorContainer')}\n        key={'editor' + this.state.containerKey}\n        ref=\"editorContainer\"\n        >\n        <div\n            aria-activedescendant={\n                readOnly ? null : this.props.ariaActiveDescendantID\n            }\n            aria-autocomplete={readOnly ? null : this.props.ariaAutoComplete}\n            >\n            {this._renderPlaceholder()}\n            <Component p1\n                p2\n                />\n        </div>\n        { // tests inline JSX\n            if (a) {\n                return (\n                    <div></div>\n                )\n            }\n            else (b) {\n                switch (a) {\n                    case 1:\n                        return (\n                            <div></div>\n                        )\n                    default:\n                }\n            }\n        }\n    </div>\n</div>";
          autoIndent.eslintIndentOptions = {
            jsxIndent: [1, 2],
            jsxIndentProps: [1, 2],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'props-aligned',
                nonEmpty: 'props-aligned'
              }
            ]
          };
          autoIndent.autoJsx = true;
          autoIndent.indentJSX(sourceCodeRange);
          return expect(editor.getTextInBufferRange(sourceCodeRange)).toEqual(indentedCode);
        });
      });
      return describe('insert-nl-jsx', function() {
        return it('should insert two new lines and position cursor between JSX tags', function() {
          autoIndent.eslintIndentOptions = {
            jsxIndent: [1, 1],
            jsxIndentProps: [1, 1],
            jsxClosingBracketLocation: [
              1, {
                selfClosing: 'tabs-aligned',
                nonEmpty: 'tabs-aligned'
              }
            ]
          };
          autoIndent.autoJsx = true;
          editor.insertText('<div></div>');
          editor.setCursorBufferPosition([0, 5]);
          editor.insertText('\n');
          expect(editor.getTextInBufferRange([[0, 0], [0, 5]])).toEqual("<div>");
          expect(editor.getTextInBufferRange([[1, 0], [1, 2]])).toEqual("  ");
          expect(editor.getTextInBufferRange([[2, 0], [2, 6]])).toEqual("</div>");
          return expect(editor.getCursorBufferPosition()).toEqual([1, 2]);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc3RlZmFuby8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1iYWJlbC9zcGVjL2F1dG8taW5kZW50LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBRUE7QUFBQSxNQUFBLHdDQUFBOztBQUFBLEVBQUEsT0FBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxhQUFBLEtBQUQsRUFBUSxhQUFBLEtBQVIsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxvQkFBUixDQUhiLENBQUE7O0FBQUEsRUFLQSxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBLEdBQUE7QUFDdEIsUUFBQSxxRUFBQTtBQUFBLElBQUEsUUFBbUUsRUFBbkUsRUFBQyxxQkFBRCxFQUFhLGlCQUFiLEVBQXFCLHdCQUFyQixFQUFvQyxxQkFBcEMsRUFBZ0QsMEJBQWhELENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFDVCxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixnQkFBOUIsRUFEYztNQUFBLENBQWhCLEVBRFM7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBTUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsaUJBQXBCLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsU0FBQyxDQUFELEdBQUE7aUJBQU8sTUFBQSxHQUFTLEVBQWhCO1FBQUEsQ0FBNUMsRUFEYztNQUFBLENBQWhCLENBQUEsQ0FB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

//# sourceURL=/home/stefano/.atom/packages/language-babel/spec/auto-indent-spec.coffee
