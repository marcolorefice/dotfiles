(function() {
  var AFTERPROPS, AutoIndent, BRACE_CLOSE, BRACE_OPEN, CompositeDisposable, File, InsertNlJsx, JSXBRACE_CLOSE, JSXBRACE_OPEN, JSXTAG_CLOSE, JSXTAG_CLOSE_ATTRS, JSXTAG_OPEN, JSXTAG_SELFCLOSE_END, JSXTAG_SELFCLOSE_START, JS_ELSE, JS_IF, LINEALIGNED, NO_TOKEN, PROPSALIGNED, Point, Range, SWITCH_BRACE_CLOSE, SWITCH_BRACE_OPEN, SWITCH_CASE, SWITCH_DEFAULT, TAGALIGNED, TERNARY_ELSE, TERNARY_IF, YAML, autoCompleteJSX, fs, path, stripJsonComments, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, File = _ref.File, Range = _ref.Range, Point = _ref.Point;

  fs = require('fs-plus');

  path = require('path');

  autoCompleteJSX = require('./auto-complete-jsx');

  InsertNlJsx = require('./insert-nl-jsx');

  stripJsonComments = require('strip-json-comments');

  YAML = require('js-yaml');

  NO_TOKEN = 0;

  JSXTAG_SELFCLOSE_START = 1;

  JSXTAG_SELFCLOSE_END = 2;

  JSXTAG_OPEN = 3;

  JSXTAG_CLOSE_ATTRS = 4;

  JSXTAG_CLOSE = 5;

  JSXBRACE_OPEN = 6;

  JSXBRACE_CLOSE = 7;

  BRACE_OPEN = 8;

  BRACE_CLOSE = 9;

  TERNARY_IF = 10;

  TERNARY_ELSE = 11;

  JS_IF = 12;

  JS_ELSE = 13;

  SWITCH_BRACE_OPEN = 14;

  SWITCH_BRACE_CLOSE = 15;

  SWITCH_CASE = 16;

  SWITCH_DEFAULT = 17;

  TAGALIGNED = 'tag-aligned';

  LINEALIGNED = 'line-aligned';

  AFTERPROPS = 'after-props';

  PROPSALIGNED = 'props-aligned';

  module.exports = AutoIndent = (function() {
    function AutoIndent(editor) {
      this.editor = editor;
      this.onMouseUp = __bind(this.onMouseUp, this);
      this.onMouseDown = __bind(this.onMouseDown, this);
      this.handleOnDidStopChanging = __bind(this.handleOnDidStopChanging, this);
      this.changedCursorPosition = __bind(this.changedCursorPosition, this);
      this.insertNlJsx = new InsertNlJsx(this.editor);
      this.autoJsx = atom.config.get('language-babel').autoIndentJSX;
      this.JSXREGEXP = /(<)([$_A-Za-z](?:[$_.:\-A-Za-z0-9])*)|(\/>)|(<\/)([$_A-Za-z](?:[$._:\-A-Za-z0-9])*)(>)|(>)|({)|(})|(\?)|(:)|(if)|(else)|(case)|(default)/g;
      this.mouseUp = true;
      this.multipleCursorTrigger = 1;
      this.disposables = new CompositeDisposable();
      this.eslintIndentOptions = this.getIndentOptions();
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'language-babel:auto-indent-jsx-on': (function(_this) {
          return function(event) {
            _this.autoJsx = true;
            return _this.eslintIndentOptions = _this.getIndentOptions();
          };
        })(this)
      }));
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'language-babel:auto-indent-jsx-off': (function(_this) {
          return function(event) {
            return _this.autoJsx = false;
          };
        })(this)
      }));
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'language-babel:toggle-auto-indent-jsx': (function(_this) {
          return function(event) {
            _this.autoJsx = !_this.autoJsx;
            if (_this.autoJsx) {
              return _this.eslintIndentOptions = _this.getIndentOptions();
            }
          };
        })(this)
      }));
      document.addEventListener('mousedown', this.onMouseDown);
      document.addEventListener('mouseup', this.onMouseUp);
      this.disposables.add(this.editor.onDidChangeCursorPosition((function(_this) {
        return function(event) {
          return _this.changedCursorPosition(event);
        };
      })(this)));
      this.handleOnDidStopChanging();
    }

    AutoIndent.prototype.destroy = function() {
      this.disposables.dispose();
      this.onDidStopChangingHandler.dispose();
      document.removeEventListener('mousedown', this.onMouseDown);
      return document.removeEventListener('mouseup', this.onMouseUp);
    };

    AutoIndent.prototype.changedCursorPosition = function(event) {
      var blankLineEndPos, bufferRow, columnToMoveTo, cursorPosition, cursorPositions, endPointOfJsx, previousRow, startPointOfJsx, _i, _len, _ref1, _ref2;
      if (!this.autoJsx) {
        return;
      }
      if (!this.mouseUp) {
        return;
      }
      if (event.oldBufferPosition.row === event.newBufferPosition.row) {
        return;
      }
      bufferRow = event.newBufferPosition.row;
      if (this.editor.hasMultipleCursors()) {
        cursorPositions = this.editor.getCursorBufferPositions();
        if (cursorPositions.length === this.multipleCursorTrigger) {
          this.multipleCursorTrigger = 1;
          bufferRow = 0;
          for (_i = 0, _len = cursorPositions.length; _i < _len; _i++) {
            cursorPosition = cursorPositions[_i];
            if (cursorPosition.row > bufferRow) {
              bufferRow = cursorPosition.row;
            }
          }
        } else {
          this.multipleCursorTrigger++;
          return;
        }
      } else {
        cursorPosition = event.newBufferPosition;
      }
      previousRow = event.oldBufferPosition.row;
      if (this.jsxInScope(previousRow)) {
        blankLineEndPos = (_ref1 = /^\s*$/.exec(this.editor.lineTextForBufferRow(previousRow))) != null ? _ref1[0].length : void 0;
        if (blankLineEndPos != null) {
          this.indentRow({
            row: previousRow,
            blockIndent: 0
          });
        }
      }
      if (!this.jsxInScope(bufferRow)) {
        return;
      }
      endPointOfJsx = new Point(bufferRow, 0);
      startPointOfJsx = autoCompleteJSX.getStartOfJSX(this.editor, cursorPosition);
      this.indentJSX(new Range(startPointOfJsx, endPointOfJsx));
      columnToMoveTo = (_ref2 = /^\s*$/.exec(this.editor.lineTextForBufferRow(bufferRow))) != null ? _ref2[0].length : void 0;
      if (columnToMoveTo != null) {
        return this.editor.setCursorBufferPosition([bufferRow, columnToMoveTo]);
      }
    };

    AutoIndent.prototype.didStopChanging = function() {
      var endPointOfJsx, highestRow, lowestRow, selectedRange, startPointOfJsx;
      if (!this.autoJsx) {
        return;
      }
      if (!this.mouseUp) {
        return;
      }
      selectedRange = this.editor.getSelectedBufferRange();
      if (selectedRange.start.row === selectedRange.end.row && selectedRange.start.column === selectedRange.end.column && __indexOf.call(this.editor.scopeDescriptorForBufferPosition([selectedRange.start.row, selectedRange.start.column]).getScopesArray(), 'JSXStartTagEnd') >= 0) {
        return;
      }
      highestRow = Math.max(selectedRange.start.row, selectedRange.end.row);
      lowestRow = Math.min(selectedRange.start.row, selectedRange.end.row);
      this.onDidStopChangingHandler.dispose();
      while (highestRow >= lowestRow) {
        if (this.jsxInScope(highestRow)) {
          endPointOfJsx = new Point(highestRow, 0);
          startPointOfJsx = autoCompleteJSX.getStartOfJSX(this.editor, endPointOfJsx);
          this.indentJSX(new Range(startPointOfJsx, endPointOfJsx));
          highestRow = startPointOfJsx.row - 1;
        } else {
          highestRow = highestRow - 1;
        }
      }
      setTimeout(this.handleOnDidStopChanging, 300);
    };

    AutoIndent.prototype.handleOnDidStopChanging = function() {
      return this.onDidStopChangingHandler = this.editor.onDidStopChanging((function(_this) {
        return function() {
          return _this.didStopChanging();
        };
      })(this));
    };

    AutoIndent.prototype.jsxInScope = function(bufferRow) {
      var scopes;
      scopes = this.editor.scopeDescriptorForBufferPosition([bufferRow, 0]).getScopesArray();
      return __indexOf.call(scopes, 'meta.tag.jsx') >= 0;
    };

    AutoIndent.prototype.indentJSX = function(range) {
      var blankLineEndPos, firstCharIndentation, firstTagInLineIndentation, idxOfToken, indent, indentRecalc, isFirstTagOfBlock, isFirstTokenOfLine, line, match, matchColumn, matchPointEnd, matchPointStart, matchRange, parentTokenIdx, row, stackOfTokensStillOpen, token, tokenIndentation, tokenOnThisLine, tokenStack, _i, _ref1, _ref2, _ref3, _results;
      tokenStack = [];
      idxOfToken = 0;
      stackOfTokensStillOpen = [];
      indent = 0;
      isFirstTagOfBlock = true;
      this.JSXREGEXP.lastIndex = 0;
      _results = [];
      for (row = _i = _ref1 = range.start.row, _ref2 = range.end.row; _ref1 <= _ref2 ? _i <= _ref2 : _i >= _ref2; row = _ref1 <= _ref2 ? ++_i : --_i) {
        isFirstTokenOfLine = true;
        tokenOnThisLine = false;
        indentRecalc = false;
        line = this.editor.lineTextForBufferRow(row);
        while ((match = this.JSXREGEXP.exec(line)) !== null) {
          matchColumn = match.index;
          matchPointStart = new Point(row, matchColumn);
          matchPointEnd = new Point(row, matchColumn + match[0].length - 1);
          matchRange = new Range(matchPointStart, matchPointEnd);
          if (!(token = this.getToken(row, match))) {
            continue;
          }
          firstCharIndentation = this.editor.indentationForBufferRow(row);
          if (this.editor.getSoftTabs()) {
            tokenIndentation = matchColumn / this.editor.getTabLength();
          } else {
            tokenIndentation = (function(editor) {
              var charsFound, hardTabsFound, i, _j;
              this.editor = editor;
              hardTabsFound = charsFound = 0;
              for (i = _j = 0; 0 <= matchColumn ? _j < matchColumn : _j > matchColumn; i = 0 <= matchColumn ? ++_j : --_j) {
                if ((line.substr(i, 1)) === '\t') {
                  hardTabsFound++;
                } else {
                  charsFound++;
                }
              }
              return hardTabsFound + (charsFound / this.editor.getTabLength());
            })(this.editor);
          }
          if (isFirstTokenOfLine) {
            firstTagInLineIndentation = tokenIndentation;
          }
          switch (token) {
            case JSXTAG_OPEN:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                if (isFirstTagOfBlock && (parentTokenIdx != null) && tokenStack[parentTokenIdx].type === BRACE_OPEN && tokenStack[parentTokenIdx].row === (row - 1)) {
                  tokenIndentation = firstCharIndentation = firstTagInLineIndentation = this.eslintIndentOptions.jsxIndent[1] + this.getIndentOfPreviousRow(row);
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: firstCharIndentation
                  });
                } else if (isFirstTagOfBlock && (parentTokenIdx != null)) {
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: this.getIndentOfPreviousRow(row),
                    jsxIndent: 1
                  });
                } else if (parentTokenIdx != null) {
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: tokenStack[parentTokenIdx].firstCharIndentation,
                    jsxIndent: 1
                  });
                }
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTokenOfLine = false;
              isFirstTagOfBlock = false;
              stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
              tokenStack.push({
                type: JSXTAG_OPEN,
                name: match[2],
                row: row,
                firstTagInLineIndentation: firstTagInLineIndentation,
                tokenIndentation: tokenIndentation,
                firstCharIndentation: firstCharIndentation,
                parentTokenIdx: parentTokenIdx,
                termsThisTagsAttributesIdx: null,
                termsThisTagIdx: null
              });
              stackOfTokensStillOpen.push(idxOfToken);
              idxOfToken++;
              break;
            case JSXTAG_CLOSE:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                indentRecalc = this.indentRow({
                  row: row,
                  blockIndent: tokenStack[parentTokenIdx].firstCharIndentation
                });
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTokenOfLine = false;
              isFirstTagOfBlock = false;
              parentTokenIdx = stackOfTokensStillOpen.pop();
              tokenStack.push({
                type: JSXTAG_CLOSE,
                name: match[5],
                row: row,
                parentTokenIdx: parentTokenIdx
              });
              if (parentTokenIdx >= 0) {
                tokenStack[parentTokenIdx].termsThisTagIdx = idxOfToken;
              }
              idxOfToken++;
              break;
            case JSXTAG_SELFCLOSE_END:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                if (firstTagInLineIndentation === firstCharIndentation) {
                  indentRecalc = this.indentForClosingBracket(row, tokenStack[parentTokenIdx], this.eslintIndentOptions.jsxClosingBracketLocation[1].selfClosing);
                } else {
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: tokenStack[parentTokenIdx].firstTagInLineIndentation,
                    jsxIndentProps: 1
                  });
                }
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTagOfBlock = false;
              isFirstTokenOfLine = false;
              parentTokenIdx = stackOfTokensStillOpen.pop();
              tokenStack.push({
                type: JSXTAG_SELFCLOSE_END,
                name: tokenStack[parentTokenIdx].name,
                row: row,
                parentTokenIdx: parentTokenIdx
              });
              if (parentTokenIdx >= 0) {
                tokenStack[parentTokenIdx].termsThisTagsAttributesIdx = idxOfToken;
                tokenStack[parentTokenIdx].type = JSXTAG_SELFCLOSE_START;
                tokenStack[parentTokenIdx].termsThisTagIdx = idxOfToken;
              }
              idxOfToken++;
              break;
            case JSXTAG_CLOSE_ATTRS:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                if (firstTagInLineIndentation === firstCharIndentation) {
                  indentRecalc = this.indentForClosingBracket(row, tokenStack[parentTokenIdx], this.eslintIndentOptions.jsxClosingBracketLocation[1].nonEmpty);
                } else {
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: tokenStack[parentTokenIdx].firstTagInLineIndentation,
                    jsxIndentProps: 1
                  });
                }
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTagOfBlock = false;
              isFirstTokenOfLine = false;
              stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
              tokenStack.push({
                type: JSXTAG_CLOSE_ATTRS,
                name: tokenStack[parentTokenIdx].name,
                row: row,
                parentTokenIdx: parentTokenIdx
              });
              if (parentTokenIdx >= 0) {
                tokenStack[parentTokenIdx].termsThisTagsAttributesIdx = idxOfToken;
              }
              idxOfToken++;
              break;
            case JSXBRACE_OPEN:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                if (parentTokenIdx != null) {
                  if (tokenStack[parentTokenIdx].type === JSXTAG_OPEN && tokenStack[parentTokenIdx].termsThisTagsAttributesIdx === null) {
                    indentRecalc = this.indentRow({
                      row: row,
                      blockIndent: tokenStack[parentTokenIdx].firstCharIndentation,
                      jsxIndentProps: 1
                    });
                  } else {
                    indentRecalc = this.indentRow({
                      row: row,
                      blockIndent: tokenStack[parentTokenIdx].firstCharIndentation,
                      jsxIndent: 1
                    });
                  }
                }
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTagOfBlock = true;
              isFirstTokenOfLine = false;
              stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
              tokenStack.push({
                type: JSXBRACE_OPEN,
                name: '',
                row: row,
                firstTagInLineIndentation: firstTagInLineIndentation,
                tokenIndentation: tokenIndentation,
                firstCharIndentation: firstCharIndentation,
                parentTokenIdx: parentTokenIdx,
                termsThisTagsAttributesIdx: null,
                termsThisTagIdx: null
              });
              stackOfTokensStillOpen.push(idxOfToken);
              idxOfToken++;
              break;
            case JSXBRACE_CLOSE:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                indentRecalc = this.indentRow({
                  row: row,
                  blockIndent: tokenStack[parentTokenIdx].firstCharIndentation
                });
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTagOfBlock = false;
              isFirstTokenOfLine = false;
              parentTokenIdx = stackOfTokensStillOpen.pop();
              tokenStack.push({
                type: JSXBRACE_CLOSE,
                name: '',
                row: row,
                parentTokenIdx: parentTokenIdx
              });
              if (parentTokenIdx >= 0) {
                tokenStack[parentTokenIdx].termsThisTagIdx = idxOfToken;
              }
              idxOfToken++;
              break;
            case BRACE_OPEN:
            case SWITCH_BRACE_OPEN:
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                if (isFirstTagOfBlock && (parentTokenIdx != null) && tokenStack[parentTokenIdx].type === token && tokenStack[parentTokenIdx].row === (row - 1)) {
                  tokenIndentation = firstCharIndentation = this.eslintIndentOptions.jsxIndent[1] + this.getIndentOfPreviousRow(row);
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: firstCharIndentation
                  });
                } else if (parentTokenIdx != null) {
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: tokenStack[parentTokenIdx].firstCharIndentation,
                    jsxIndent: 1
                  });
                }
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTokenOfLine = false;
              stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
              tokenStack.push({
                type: token,
                name: '',
                row: row,
                firstTagInLineIndentation: firstTagInLineIndentation,
                tokenIndentation: tokenIndentation,
                firstCharIndentation: firstCharIndentation,
                parentTokenIdx: parentTokenIdx,
                termsThisTagsAttributesIdx: null,
                termsThisTagIdx: null
              });
              stackOfTokensStillOpen.push(idxOfToken);
              idxOfToken++;
              break;
            case BRACE_CLOSE:
            case SWITCH_BRACE_CLOSE:
              if (token === SWITCH_BRACE_CLOSE) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                if (tokenStack[parentTokenIdx].type === SWITCH_CASE || tokenStack[parentTokenIdx].type === SWITCH_DEFAULT) {
                  stackOfTokensStillOpen.pop();
                }
              }
              tokenOnThisLine = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                if (parentTokenIdx != null) {
                  indentRecalc = this.indentRow({
                    row: row,
                    blockIndent: tokenStack[parentTokenIdx].firstCharIndentation
                  });
                }
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTokenOfLine = false;
              parentTokenIdx = stackOfTokensStillOpen.pop();
              if (parentTokenIdx != null) {
                tokenStack.push({
                  type: token,
                  name: '',
                  row: row,
                  parentTokenIdx: parentTokenIdx
                });
                if (parentTokenIdx >= 0) {
                  tokenStack[parentTokenIdx].termsThisTagIdx = idxOfToken;
                }
                idxOfToken++;
              }
              break;
            case SWITCH_CASE:
            case SWITCH_DEFAULT:
              tokenOnThisLine = true;
              isFirstTagOfBlock = true;
              if (isFirstTokenOfLine) {
                stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
                if (parentTokenIdx != null) {
                  if (tokenStack[parentTokenIdx].type === SWITCH_CASE || tokenStack[parentTokenIdx].type === SWITCH_DEFAULT) {
                    indentRecalc = this.indentRow({
                      row: row,
                      blockIndent: tokenStack[parentTokenIdx].firstCharIndentation
                    });
                    stackOfTokensStillOpen.pop();
                  } else if (tokenStack[parentTokenIdx].type === SWITCH_BRACE_OPEN) {
                    indentRecalc = this.indentRow({
                      row: row,
                      blockIndent: tokenStack[parentTokenIdx].firstCharIndentation,
                      jsxIndent: 1
                    });
                  }
                }
              }
              if (indentRecalc) {
                line = this.editor.lineTextForBufferRow(row);
                this.JSXREGEXP.lastIndex = 0;
                continue;
              }
              isFirstTokenOfLine = false;
              stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
              tokenStack.push({
                type: token,
                name: '',
                row: row,
                firstTagInLineIndentation: firstTagInLineIndentation,
                tokenIndentation: tokenIndentation,
                firstCharIndentation: firstCharIndentation,
                parentTokenIdx: parentTokenIdx,
                termsThisTagsAttributesIdx: null,
                termsThisTagIdx: null
              });
              stackOfTokensStillOpen.push(idxOfToken);
              idxOfToken++;
              break;
            case TERNARY_IF:
            case JS_IF:
            case JS_ELSE:
              isFirstTagOfBlock = true;
          }
        }
        if (idxOfToken && !tokenOnThisLine) {
          if (row !== range.end.row) {
            blankLineEndPos = (_ref3 = /^\s*$/.exec(this.editor.lineTextForBufferRow(row))) != null ? _ref3[0].length : void 0;
            if (blankLineEndPos != null) {
              _results.push(this.indentRow({
                row: row,
                blockIndent: 0
              }));
            } else {
              _results.push(this.indentUntokenisedLine(row, tokenStack, stackOfTokensStillOpen));
            }
          } else {
            _results.push(this.indentUntokenisedLine(row, tokenStack, stackOfTokensStillOpen));
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    AutoIndent.prototype.indentUntokenisedLine = function(row, tokenStack, stackOfTokensStillOpen) {
      var parentTokenIdx, token;
      stackOfTokensStillOpen.push(parentTokenIdx = stackOfTokensStillOpen.pop());
      token = tokenStack[parentTokenIdx];
      switch (token.type) {
        case JSXTAG_OPEN:
        case JSXTAG_SELFCLOSE_START:
          if (token.termsThisTagsAttributesIdx === null) {
            return this.indentRow({
              row: row,
              blockIndent: token.firstCharIndentation,
              jsxIndentProps: 1
            });
          } else {
            return this.indentRow({
              row: row,
              blockIndent: token.firstCharIndentation,
              jsxIndent: 1
            });
          }
          break;
        case JSXBRACE_OPEN:
          return this.indentRow({
            row: row,
            blockIndent: token.firstCharIndentation,
            jsxIndent: 1
          });
        case BRACE_OPEN:
        case SWITCH_BRACE_OPEN:
          return this.indentRow({
            row: row,
            blockIndent: token.firstCharIndentation,
            jsxIndent: 1
          });
        case JSXTAG_SELFCLOSE_END:
        case JSXBRACE_CLOSE:
        case JSXTAG_CLOSE_ATTRS:
          return this.indentRow({
            row: row,
            blockIndent: tokenStack[token.parentTokenIdx].firstCharIndentation,
            jsxIndentProps: 1
          });
        case BRACE_CLOSE:
        case SWITCH_BRACE_CLOSE:
          return this.indentRow({
            row: row,
            blockIndent: tokenStack[token.parentTokenIdx].firstCharIndentation,
            jsxIndent: 1
          });
        case SWITCH_CASE:
        case SWITCH_DEFAULT:
          return this.indentRow({
            row: row,
            blockIndent: token.firstCharIndentation,
            jsxIndent: 1
          });
      }
    };

    AutoIndent.prototype.getToken = function(bufferRow, match) {
      var scope;
      scope = this.editor.scopeDescriptorForBufferPosition([bufferRow, match.index]).getScopesArray().pop();
      if ('punctuation.definition.tag.jsx' === scope) {
        if (match[1] != null) {
          return JSXTAG_OPEN;
        } else if (match[3] != null) {
          return JSXTAG_SELFCLOSE_END;
        }
      } else if ('JSXEndTagStart' === scope) {
        if (match[4] != null) {
          return JSXTAG_CLOSE;
        }
      } else if ('JSXStartTagEnd' === scope) {
        if (match[7] != null) {
          return JSXTAG_CLOSE_ATTRS;
        }
      } else if (match[8] != null) {
        if ('punctuation.section.embedded.begin.jsx' === scope) {
          return JSXBRACE_OPEN;
        } else if ('meta.brace.curly.switchStart.js' === scope) {
          return SWITCH_BRACE_OPEN;
        } else if ('meta.brace.curly.js' === scope) {
          return BRACE_OPEN;
        }
      } else if (match[9] != null) {
        if ('punctuation.section.embedded.end.jsx' === scope) {
          return JSXBRACE_CLOSE;
        } else if ('meta.brace.curly.switchEnd.js' === scope) {
          return SWITCH_BRACE_CLOSE;
        } else if ('meta.brace.curly.js' === scope) {
          return BRACE_CLOSE;
        }
      } else if (match[10] != null) {
        if ('keyword.operator.ternary.js' === scope) {
          return TERNARY_IF;
        }
      } else if (match[11] != null) {
        if ('keyword.operator.ternary.js' === scope) {
          return TERNARY_ELSE;
        }
      } else if (match[12] != null) {
        if ('keyword.control.conditional.js' === scope) {
          return JS_IF;
        }
      } else if (match[13] != null) {
        if ('keyword.control.conditional.js' === scope) {
          return JS_ELSE;
        }
      } else if (match[14] != null) {
        if ('keyword.control.switch.js' === scope) {
          return SWITCH_CASE;
        }
      } else if (match[15] != null) {
        if ('keyword.control.switch.js' === scope) {
          return SWITCH_DEFAULT;
        }
      }
      return NO_TOKEN;
    };

    AutoIndent.prototype.getIndentOfPreviousRow = function(row) {
      var line, _i, _ref1;
      if (!row) {
        return 0;
      }
      for (row = _i = _ref1 = row - 1; _ref1 <= 0 ? _i < 0 : _i > 0; row = _ref1 <= 0 ? ++_i : --_i) {
        line = this.editor.lineTextForBufferRow(row);
        if (/.*\S/.test(line)) {
          return this.editor.indentationForBufferRow(row);
        }
      }
      return 0;
    };

    AutoIndent.prototype.getIndentOptions = function() {
      var eslintrcFilename;
      if (!this.autoJsx) {
        return this.translateIndentOptions();
      }
      if (eslintrcFilename = this.getEslintrcFilename()) {
        eslintrcFilename = new File(eslintrcFilename);
        return this.translateIndentOptions(this.readEslintrcOptions(eslintrcFilename.getPath()));
      } else {
        return this.translateIndentOptions({});
      }
    };

    AutoIndent.prototype.getEslintrcFilename = function() {
      var projectContainingSource;
      projectContainingSource = atom.project.relativizePath(this.editor.getPath());
      if (projectContainingSource[0] != null) {
        return path.join(projectContainingSource[0], '.eslintrc');
      }
    };

    AutoIndent.prototype.onMouseDown = function() {
      return this.mouseUp = false;
    };

    AutoIndent.prototype.onMouseUp = function() {
      return this.mouseUp = true;
    };

    AutoIndent.prototype.readEslintrcOptions = function(eslintrcFile) {
      var err, eslintRules, fileContent;
      if (fs.existsSync(eslintrcFile)) {
        fileContent = stripJsonComments(fs.readFileSync(eslintrcFile, 'utf8'));
        try {
          eslintRules = (YAML.safeLoad(fileContent)).rules;
          if (eslintRules) {
            return eslintRules;
          }
        } catch (_error) {
          err = _error;
          atom.notifications.addError("LB: Error reading .eslintrc at " + eslintrcFile, {
            dismissable: true,
            detail: "" + err.message
          });
        }
      }
      return {};
    };

    AutoIndent.prototype.translateIndentOptions = function(eslintRules) {
      var ES_DEFAULT_INDENT, defaultIndent, eslintIndentOptions, rule;
      eslintIndentOptions = {
        jsxIndent: [1, 1],
        jsxIndentProps: [1, 1],
        jsxClosingBracketLocation: [
          1, {
            selfClosing: TAGALIGNED,
            nonEmpty: TAGALIGNED
          }
        ]
      };
      if (typeof eslintRules !== "object") {
        return eslintIndentOptions;
      }
      ES_DEFAULT_INDENT = 4;
      rule = eslintRules['indent'];
      if (typeof rule === 'number' || typeof rule === 'string') {
        defaultIndent = ES_DEFAULT_INDENT / this.editor.getTabLength();
      } else if (typeof rule === 'object') {
        if (typeof rule[1] === 'number') {
          defaultIndent = rule[1] / this.editor.getTabLength();
        } else {
          defaultIndent = 1;
        }
      } else {
        defaultIndent = 1;
      }
      rule = eslintRules['react/jsx-indent'];
      if (typeof rule === 'number' || typeof rule === 'string') {
        eslintIndentOptions.jsxIndent[0] = rule;
        eslintIndentOptions.jsxIndent[1] = ES_DEFAULT_INDENT / this.editor.getTabLength();
      } else if (typeof rule === 'object') {
        eslintIndentOptions.jsxIndent[0] = rule[0];
        if (typeof rule[1] === 'number') {
          eslintIndentOptions.jsxIndent[1] = rule[1] / this.editor.getTabLength();
        } else {
          eslintIndentOptions.jsxIndent[1] = 1;
        }
      } else {
        eslintIndentOptions.jsxIndent[1] = defaultIndent;
      }
      rule = eslintRules['react/jsx-indent-props'];
      if (typeof rule === 'number' || typeof rule === 'string') {
        eslintIndentOptions.jsxIndentProps[0] = rule;
        eslintIndentOptions.jsxIndentProps[1] = ES_DEFAULT_INDENT / this.editor.getTabLength();
      } else if (typeof rule === 'object') {
        eslintIndentOptions.jsxIndentProps[0] = rule[0];
        if (typeof rule[1] === 'number') {
          eslintIndentOptions.jsxIndentProps[1] = rule[1] / this.editor.getTabLength();
        } else {
          eslintIndentOptions.jsxIndentProps[1] = 1;
        }
      } else {
        eslintIndentOptions.jsxIndentProps[1] = defaultIndent;
      }
      rule = eslintRules['react/jsx-closing-bracket-location'];
      eslintIndentOptions.jsxClosingBracketLocation[1].selfClosing = TAGALIGNED;
      eslintIndentOptions.jsxClosingBracketLocation[1].nonEmpty = TAGALIGNED;
      if (typeof rule === 'number' || typeof rule === 'string') {
        eslintIndentOptions.jsxClosingBracketLocation[0] = rule;
      } else if (typeof rule === 'object') {
        eslintIndentOptions.jsxClosingBracketLocation[0] = rule[0];
        if (typeof rule[1] === 'string') {
          eslintIndentOptions.jsxClosingBracketLocation[1].selfClosing = eslintIndentOptions.jsxClosingBracketLocation[1].nonEmpty = rule[1];
        } else {
          if (rule[1].selfClosing != null) {
            eslintIndentOptions.jsxClosingBracketLocation[1].selfClosing = rule[1].selfClosing;
          }
          if (rule[1].nonEmpty != null) {
            eslintIndentOptions.jsxClosingBracketLocation[1].nonEmpty = rule[1].nonEmpty;
          }
        }
      }
      return eslintIndentOptions;
    };

    AutoIndent.prototype.indentForClosingBracket = function(row, parentTag, closingBracketRule) {
      if (this.eslintIndentOptions.jsxClosingBracketLocation[0]) {
        if (closingBracketRule === TAGALIGNED) {
          return this.indentRow({
            row: row,
            blockIndent: parentTag.tokenIndentation
          });
        } else if (closingBracketRule === LINEALIGNED) {
          return this.indentRow({
            row: row,
            blockIndent: parentTag.firstCharIndentation
          });
        } else if (closingBracketRule === AFTERPROPS) {
          if (this.eslintIndentOptions.jsxIndentProps[0]) {
            return this.indentRow({
              row: row,
              blockIndent: parentTag.firstCharIndentation,
              jsxIndentProps: 1
            });
          } else {
            return this.indentRow({
              row: row,
              blockIndent: parentTag.firstCharIndentation
            });
          }
        } else if (closingBracketRule === PROPSALIGNED) {
          if (this.eslintIndentOptions.jsxIndentProps[0]) {
            return this.indentRow({
              row: row,
              blockIndent: parentTag.firstCharIndentation,
              jsxIndentProps: 1
            });
          } else {
            return this.indentRow({
              row: row,
              blockIndent: parentTag.firstCharIndentation
            });
          }
        }
      }
    };

    AutoIndent.prototype.indentRow = function(options) {
      var allowAdditionalIndents, blockIndent, jsxIndent, jsxIndentProps, row;
      row = options.row, allowAdditionalIndents = options.allowAdditionalIndents, blockIndent = options.blockIndent, jsxIndent = options.jsxIndent, jsxIndentProps = options.jsxIndentProps;
      if (jsxIndent) {
        if (this.eslintIndentOptions.jsxIndent[0]) {
          if (this.eslintIndentOptions.jsxIndent[1]) {
            blockIndent += jsxIndent * this.eslintIndentOptions.jsxIndent[1];
          }
        }
      }
      if (jsxIndentProps) {
        if (this.eslintIndentOptions.jsxIndentProps[0]) {
          if (this.eslintIndentOptions.jsxIndentProps[1]) {
            blockIndent += jsxIndentProps * this.eslintIndentOptions.jsxIndentProps[1];
          }
        }
      }
      if (allowAdditionalIndents) {
        if (this.editor.indentationForBufferRow(row) < blockIndent) {
          this.editor.setIndentationForBufferRow(row, blockIndent, {
            preserveLeadingWhitespace: false
          });
          return true;
        }
      } else {
        if (this.editor.indentationForBufferRow(row) !== blockIndent) {
          this.editor.setIndentationForBufferRow(row, blockIndent, {
            preserveLeadingWhitespace: false
          });
          return true;
        }
      }
      return false;
    };

    return AutoIndent;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3N0ZWZhbm8uY29yYWxsby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2xhbmd1YWdlLWJhYmVsL2xpYi9hdXRvLWluZGVudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMGJBQUE7SUFBQTt5SkFBQTs7QUFBQSxFQUFBLE9BQTRDLE9BQUEsQ0FBUSxNQUFSLENBQTVDLEVBQUMsMkJBQUEsbUJBQUQsRUFBc0IsWUFBQSxJQUF0QixFQUE0QixhQUFBLEtBQTVCLEVBQW1DLGFBQUEsS0FBbkMsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsZUFBQSxHQUFrQixPQUFBLENBQVEscUJBQVIsQ0FIbEIsQ0FBQTs7QUFBQSxFQUlBLFdBQUEsR0FBYyxPQUFBLENBQVEsaUJBQVIsQ0FKZCxDQUFBOztBQUFBLEVBS0EsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHFCQUFSLENBTHBCLENBQUE7O0FBQUEsRUFNQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFNBQVIsQ0FOUCxDQUFBOztBQUFBLEVBU0EsUUFBQSxHQUEwQixDQVQxQixDQUFBOztBQUFBLEVBVUEsc0JBQUEsR0FBMEIsQ0FWMUIsQ0FBQTs7QUFBQSxFQVdBLG9CQUFBLEdBQTBCLENBWDFCLENBQUE7O0FBQUEsRUFZQSxXQUFBLEdBQTBCLENBWjFCLENBQUE7O0FBQUEsRUFhQSxrQkFBQSxHQUEwQixDQWIxQixDQUFBOztBQUFBLEVBY0EsWUFBQSxHQUEwQixDQWQxQixDQUFBOztBQUFBLEVBZUEsYUFBQSxHQUEwQixDQWYxQixDQUFBOztBQUFBLEVBZ0JBLGNBQUEsR0FBMEIsQ0FoQjFCLENBQUE7O0FB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

//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/language-babel/lib/auto-indent.coffee
