(function() {
  var grammarTest, path;

  path = require('path');

  grammarTest = require('atom-grammar-test');

  describe('Grammar', function() {
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-babel');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-todo');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-hyperlink');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-mustache');
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage('language-html');
      });
    });
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/flow.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/js-class.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/js-functions.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/js-symbols.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/js-template-strings.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/jsx-attributes.jsx'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/jsx-es6.jsx'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/jsx-features.jsx'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/jsx-full-react-class.jsx'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/babel-sublime/jsx-text.jsx'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/declare.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/large files/browser-polyfill.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/large files/jquery-2.1.4.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/large files/bundle.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/large files/jquery-2.1.4.min.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/everythingJs/es2015-module.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/doc-keywords.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/flow-predicates.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/issues.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/misc.js'));
    grammarTest(path.join(__dirname, 'fixtures/grammar/es6module.js'));
    return grammarTest(path.join(__dirname, 'fixtures/grammar/graphql.js'));
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc3RlZmFuby8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1iYWJlbC9zcGVjL2dyYW1tYXItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsaUJBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxtQkFBUixDQURkLENBQUE7O0FBQUEsRUFHQSxRQUFBLENBQVMsU0FBVCxFQUFvQixTQUFBLEdBQUE7QUFDbEIsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixnQkFBOUIsRUFEYztNQUFBLENBQWhCLENBQUEsQ0FBQTtBQUFBLE1BRUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsZUFBOUIsRUFEYztNQUFBLENBQWhCLENBRkEsQ0FBQTtBQUFBLE1BSUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsb0JBQTlCLEVBRGM7TUFBQSxDQUFoQixDQUpBLENBQUE7QUFBQSxNQU1BLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLG1CQUE5QixFQURjO01BQUEsQ0FBaEIsQ0FOQSxDQUFBO2FBUUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsZUFBOUIsRUFEYztNQUFBLENBQWhCLEVBVFM7SUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLElBYUEsV0FBQSxDQUFZLElBQUksQ0FB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

//# sourceURL=/home/stefano/.atom/packages/language-babel/spec/grammar-spec.coffee
