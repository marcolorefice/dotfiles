(function() {
  var logTokens, makeNestedTokens, makeTokenWithScopes,
    __slice = [].slice;

  makeTokenWithScopes = function() {
    var scopes, value;
    value = arguments[0], scopes = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return {
      value: value,
      scopes: ["source.graphql"].concat(scopes)
    };
  };

  makeNestedTokens = function() {
    var nestedScopes;
    nestedScopes = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return function() {
      var allScopes, scopes, value;
      value = arguments[0], scopes = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      allScopes = nestedScopes.concat(scopes);
      return makeTokenWithScopes.apply(null, [value].concat(__slice.call(allScopes)));
    };
  };

  logTokens = function(tokens) {
    var idx, t, _i, _len, _results;
    _results = [];
    for (idx = _i = 0, _len = tokens.length; _i < _len; idx = ++_i) {
      t = tokens[idx];
      _results.push(console.log("" + idx + ": " + t.value + " (" + (t.scopes.join(", ")) + ")"));
    }
    return _results;
  };

  describe("GraphQL grammar", function() {
    var getTokens, grammar;
    grammar = null;
    getTokens = function(line) {
      var tokens;
      tokens = grammar.tokenizeLine(line).tokens;
      return tokens;
    };
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-graphql");
      });
      return runs(function() {
        return grammar = atom.grammars.grammarForScopeName("source.graphql");
      });
    });
    it("parses the grammar", function() {
      expect(grammar).toBeTruthy();
      return expect(grammar.scopeName).toBe("source.graphql");
    });
    it("tokenizes fragment definitions", function() {
      var makeFragmentToken, tokens;
      tokens = getTokens('fragment myFragment on User');
      makeFragmentToken = makeNestedTokens("meta.fragment");
      expect(tokens[0]).toEqual(makeFragmentToken("fragment", "storage.type"));
      expect(tokens[2]).toEqual(makeFragmentToken("myFragment", "variable.other"));
      expect(tokens[4]).toEqual(makeFragmentToken("on", "keyword.operator"));
      return expect(tokens[6]).toEqual(makeFragmentToken("User", "support.class"));
    });
    it("tokenizes operation definitions", function() {
      var makeOperationToken, tokens;
      tokens = getTokens('mutation wreckStuff');
      makeOperationToken = makeNestedTokens("meta.operation");
      expect(tokens[0]).toEqual(makeOperationToken("mutation", "storage.type"));
      return expect(tokens[2]).toEqual(makeOperationToken("wreckStuff", "variable.other"));
    });
    it("tokenizes argument lists", function() {
      var makeArgToken, tokens;
      tokens = getTokens('(str: "abc", bool: true, var: $myVar, int: 123, float: 12.3e15, enum: MY_ENUM)');
      makeArgToken = makeNestedTokens("meta.arguments");
      expect(tokens[1]).toEqual(makeArgToken("str:", 'variable.parameter'));
      expect(tokens[4]).toEqual(makeArgToken('abc', 'string.quoted.double'));
      expect(tokens[9]).toEqual(makeArgToken('true', 'constant.language.boolean'));
      expect(tokens[13]).toEqual(makeArgToken('$myVar', 'constant.other.symbol'));
      expect(tokens[17]).toEqual(makeArgToken('123', 'constant.numeric'));
      expect(tokens[21]).toEqual(makeArgToken('12.3e15', 'constant.numeric'));
      return expect(tokens[25]).toEqual(makeArgToken('MY_ENUM', 'support.constant.enum'));
    });
    it("tokenizes selection sets", function() {
      var makeArgToken, makeToken, tokens;
      tokens = getTokens("{ id @skip(if: false), ... myFields, ... on User { name } }");
      makeToken = makeNestedTokens("meta.selections");
      makeArgToken = makeNestedTokens("meta.selections", "meta.arguments");
      expect(tokens[2]).toEqual(makeToken("@skip", 'storage.modifier'));
      expect(tokens[4]).toEqual(makeArgToken("if:", "variable.parameter"));
      expect(tokens[9]).toEqual(makeToken("...", 'keyword.operator'));
      expect(tokens[11]).toEqual(makeToken("myFields", 'variable.other'));
      expect(tokens[15]).toEqual(makeToken("on", 'keyword.operator'));
      expect(tokens[17]).toEqual(makeToken("User", 'support.class'));
      return expect(tokens[20]).toEqual(makeToken(" name ", "meta.selections"));
    });
    it("tokenizes unnamed queries", function() {
      var makeToken, tokens;
      tokens = getTokens("{ __schema { types { name }}}");
      makeToken = makeNestedTokens("meta.selections");
      return expect(tokens[2]).toEqual(makeToken("__schema", "keyword.other.graphql"));
    });
    it("tokenizes strings with escaped characters", function() {
      var makeToken, tokens;
      tokens = getTokens('{ field(str: "my\\"Str\\u0025")}');
      makeToken = makeNestedTokens("meta.selections", "meta.arguments", "string.quoted.double");
      expect(tokens[6]).toEqual(makeToken('my'));
      expect(tokens[7]).toEqual(makeToken('\\"', 'constant.character.escape.graphql'));
      expect(tokens[8]).toEqual(makeToken('Str'));
      return expect(tokens[9]).toEqual(makeToken('\\u0025', 'constant.character.escape.graphql'));
    });
    return it("tokenizes field aliases", function() {
      var makeToken, tokens;
      tokens = getTokens('{ myAlias: field}');
      makeToken = makeNestedTokens("meta.selections");
      return expect(tokens[2]).toEqual(makeToken("myAlias:", "variable.other.alias.graphql"));
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc3RlZmFuby8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1ncmFwaHFsL3NwZWMvZ3JhbW1hcnMvZ3JhcGhxbC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxnREFBQTtJQUFBLGtCQUFBOztBQUFBLEVBQUEsbUJBQUEsR0FBc0IsU0FBQSxHQUFBO0FBQ3BCLFFBQUEsYUFBQTtBQUFBLElBRHFCLHNCQUFPLGdFQUM1QixDQUFBO1dBQUE7QUFBQSxNQUNFLEtBQUEsRUFBTyxLQURUO0FBQUEsTUFFRSxNQUFBLEVBQVEsQ0FBQyxnQkFBRCxDQUFrQixDQUFDLE1BQW5CLENBQTBCLE1BQTFCLENBRlY7TUFEb0I7RUFBQSxDQUF0QixDQUFBOztBQUFBLEVBTUEsZ0JBQUEsR0FBbUIsU0FBQSxHQUFBO0FBQ2pCLFFBQUEsWUFBQTtBQUFBLElBRGtCLHNFQUNsQixDQUFBO1dBQUEsU0FBQSxHQUFBO0FBQ0UsVUFBQSx3QkFBQTtBQUFBLE1BREQsc0JBQU8sZ0VBQ04sQ0FBQTtBQUFBLE1BQUEsU0FBQSxHQUFZLFlBQVksQ0FBQyxNQUFiLENBQW9CLE1BQXBCLENBQVosQ0FBQTthQUNBLG1CQUFBLGFBQW9CLENBQUEsS0FBTyxTQUFBLGFBQUEsU0FBQSxDQUFBLENBQTNCLEVBRkY7SUFBQSxFQURpQjtFQUFBLENBTm5CLENBQUE7O0FBQUEsRUFXQSxTQUFBLEdBQVksU0FBQyxNQUFELEdBQUE7QUFDVixRQUFBLDBCQUFBO0FBQUE7U0FBQSx5REFBQTtzQkFBQTtBQUNFLG9CQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksRUFBQSxHQUFHLEdBQUgsR0FBTyxJQUFQLEdBQVcsQ0FBQyxDQUFDLEtBQWIsR0FBbUIsSUFBbkIsR0FBc0IsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQVQsQ0FBYyxJQUFkLENBQUQs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

//# sourceURL=/home/stefano/.atom/packages/language-graphql/spec/grammars/graphql-spec.coffee
