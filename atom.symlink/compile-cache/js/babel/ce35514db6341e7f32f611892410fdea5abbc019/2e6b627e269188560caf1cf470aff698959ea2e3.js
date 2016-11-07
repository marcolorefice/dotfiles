Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.insertAutocompleteToken = insertAutocompleteToken;
exports.promisedExec = promisedExec;
exports.processAutocompleteItem = processAutocompleteItem;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _atomLinter = require('atom-linter');

function insertAutocompleteToken(contents, line, col) {
  var lines = contents.split('\n');
  var theLine = lines[line];
  theLine = theLine.substring(0, col) + 'AUTO332' + theLine.substring(col);
  lines[line] = theLine;
  return lines.join('\n');
}

function promisedExec(cmdString, args, options, file) {
  return (0, _atomLinter.exec)(cmdString, args, Object.assign({}, options, { stdin: file })).then(JSON.parse).then(function (obj) {
    return Array.isArray(obj) ? obj : obj.result;
  });
}

function processAutocompleteItem(replacementPrefix, flowItem) {
  var result = { description: flowItem['type'],
    displayText: flowItem['name'],
    replacementPrefix: replacementPrefix
  };
  var funcDetails = flowItem['func_details'];
  if (funcDetails) {
    // The parameters turned into snippet strings.
    var snippetParamStrings = funcDetails['params'].map(function (param, i) {
      return '${' + (i + 1) + ':' + param['name'] + '}';
    });
    // The parameters in human-readable form for use on the right label.
    var rightParamStrings = funcDetails['params'].map(function (param) {
      return param['name'] + ': ' + param['type'];
    });
    result = _extends({}, result, { leftLabel: funcDetails['return_type'],
      rightLabel: '(' + rightParamStrings.join(', ') + ')',
      snippet: flowItem['name'] + '(' + snippetParamStrings.join(', ') + ')',
      type: 'function'
    });
  } else {
    result = _extends({}, result, { rightLabel: flowItem['type'],
      text: flowItem['name']
    });
  }
  return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3N0ZWZhbm8vLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWZsb3cvc3JjL2hlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OzZCQUNlLGVBQWU7Ozs7MEJBQ1gsYUFBYTs7QUFFekIsU0FBUyx1QkFBdUIsQ0FBQyxRQUFnQixFQUFFLElBQVksRUFBRSxHQUFXLEVBQVU7QUFDM0YsTUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNoQyxNQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDekIsU0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ3hFLE9BQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUE7QUFDckIsU0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0NBQ3hCOztBQUVNLFNBQVMsWUFBWSxDQUFDLFNBQWlCLEVBQUUsSUFBbUIsRUFBRSxPQUFlLEVBQUUsSUFBWSxFQUFtQjtBQUNuSCxTQUFPLHNCQUFLLFNBQVMsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsQ0FDcEUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FDaEIsSUFBSSxDQUFDLFVBQUEsR0FBRztXQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxNQUFNO0dBQUEsQ0FBQyxDQUFBO0NBQ3REOztBQUVNLFNBQVMsdUJBQXVCLENBQUMsaUJBQXlCLEVBQUUsUUFBZ0IsRUFBVTtBQUMzRixNQUFJLE1BQU0sR0FDUixFQUFFLFdBQVcsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDO0FBQzdCLGVBQVcsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDO0FBQzdCLHFCQUFpQixFQUFqQixpQkFBaUI7R0FDbEIsQ0FBQTtBQUNILE1BQUksV0FBVyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUMxQyxNQUFJLFdBQVcsRUFBRTs7QUFFZixRQUFJLG1CQUFtQixHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FDNUMsR0FBRyxDQUFDLFVBQUMsS0FBSyxFQUFFLENBQUM7cUJBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQSxTQUFJLEtBQUssQ0FBQyxNQUFNLENBQUM7S0FBRyxDQUFDLENBQUE7O0FBRXJELFFBQUksaUJBQWlCLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUMxQyxHQUFHLENBQUMsVUFBQSxLQUFLO2FBQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFLLEtBQUssQ0FBQyxNQUFNLENBQUM7S0FBRSxDQUFDLENBQUE7QUFDckQsVUFBTSxnQkFDQyxNQUFNLElBQ1QsU0FBUyxFQUFFLFdBQVcsQ0FBQyxhQUFhLENBQUM7QUFDckMsZ0JBQVUsUUFBTSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQUc7QUFDL0MsYUFBTyxFQUFLLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBSSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQUc7QUFDakUsVUFBSSxFQUFFLFVBQVU7TUFDakIsQ0FBQTtHQUNKLE1BQU07QUFDTCxVQUFNLGdCQUNDLE1BQU0sSUFDVCxVQUFVLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQztBQUM1QixVQUFJLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQztNQUN2QixDQUFBO0dBQ0o7QUFDRCxTQUFPLE1BQU0sQ0FBQTtDQUNkIiwiZmlsZSI6Ii9ob21lL3N0ZWZhbm8vLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWZsb3cvc3JjL2hlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuaW1wb3J0IGNwIGZyb20gJ2NoaWxkX3Byb2Nlc3MnXG5pbXBvcnQge2V4ZWN9IGZyb20gJ2F0b20tbGludGVyJ1xuXG5leHBvcnQgZnVuY3Rpb24gaW5zZXJ0QXV0b2NvbXBsZXRlVG9rZW4oY29udGVudHM6IHN0cmluZywgbGluZTogbnVtYmVyLCBjb2w6IG51bWJlcik6IHN0cmluZyB7XG4gIHZhciBsaW5lcyA9IGNvbnRlbnRzLnNwbGl0KCdcXG4nKVxuICB2YXIgdGhlTGluZSA9IGxpbmVzW2xpbmVdXG4gIHRoZUxpbmUgPSB0aGVMaW5lLnN1YnN0cmluZygwLCBjb2wpICsgJ0FVVE8zMzInICsgdGhlTGluZS5zdWJzdHJpbmcoY29sKVxuICBsaW5lc1tsaW5lXSA9IHRoZUxpbmVcbiAgcmV0dXJuIGxpbmVzLmpvaW4oJ1xcbicpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9taXNlZEV4ZWMoY21kU3RyaW5nOiBzdHJpbmcsIGFyZ3M6IEFycmF5PHN0cmluZz4sIG9wdGlvbnM6IE9iamVjdCwgZmlsZTogc3RyaW5nKTogUHJvbWlzZTxPYmplY3Q+IHtcbiAgcmV0dXJuIGV4ZWMoY21kU3RyaW5nLCBhcmdzLCBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zLCB7c3RkaW46IGZpbGV9KSlcbiAgICAudGhlbihKU09OLnBhcnNlKVxuICAgIC50aGVuKG9iaiA9PiBBcnJheS5pc0FycmF5KG9iaikgPyBvYmogOiBvYmoucmVzdWx0KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvY2Vzc0F1dG9jb21wbGV0ZUl0ZW0ocmVwbGFjZW1lbnRQcmVmaXg6IHN0cmluZywgZmxvd0l0ZW06IE9iamVjdCk6IE9iamVjdCB7XG4gIHZhciByZXN1bHQgPVxuICAgIHsgZGVzY3JpcHRpb246IGZsb3dJdGVtWyd0eXBlJ11cbiAgICAsIGRpc3BsYXlUZXh0OiBmbG93SXRlbVsnbmFtZSddXG4gICAgLCByZXBsYWNlbWVudFByZWZpeFxuICAgIH1cbiAgdmFyIGZ1bmNEZXRhaWxzID0gZmxvd0l0ZW1bJ2Z1bmNfZGV0YWlscyddXG4gIGlmIChmdW5jRGV0YWlscykge1xuICAgIC8vIFRoZSBwYXJhbWV0ZXJzIHR1cm5lZCBpbnRvIHNuaXBwZXQgc3RyaW5ncy5cbiAgICB2YXIgc25pcHBldFBhcmFtU3RyaW5ncyA9IGZ1bmNEZXRhaWxzWydwYXJhbXMnXVxuICAgICAgLm1hcCgocGFyYW0sIGkpID0+IGBcXCR7JHtpICsgMX06JHtwYXJhbVsnbmFtZSddfX1gKVxuICAgIC8vIFRoZSBwYXJhbWV0ZXJzIGluIGh1bWFuLXJlYWRhYmxlIGZvcm0gZm9yIHVzZSBvbiB0aGUgcmlnaHQgbGFiZWwuXG4gICAgdmFyIHJpZ2h0UGFyYW1TdHJpbmdzID0gZnVuY0RldGFpbHNbJ3BhcmFtcyddXG4gICAgICAubWFwKHBhcmFtID0+IGAke3BhcmFtWyduYW1lJ119OiAke3BhcmFtWyd0eXBlJ119YClcbiAgICByZXN1bHQgPVxuICAgICAgeyAuLi5yZXN1bHRcbiAgICAgICwgbGVmdExhYmVsOiBmdW5jRGV0YWlsc1sncmV0dXJuX3R5cGUnXVxuICAgICAgLCByaWdodExhYmVsOiBgKCR7cmlnaHRQYXJhbVN0cmluZ3Muam9pbignLCAnKX0pYFxuICAgICAgLCBzbmlwcGV0OiBgJHtmbG93SXRlbVsnbmFtZSddfSgke3NuaXBwZXRQYXJhbVN0cmluZ3Muam9pbignLCAnKX0pYFxuICAgICAgLCB0eXBlOiAnZnVuY3Rpb24nXG4gICAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0ID1cbiAgICAgIHsgLi4ucmVzdWx0XG4gICAgICAsIHJpZ2h0TGFiZWw6IGZsb3dJdGVtWyd0eXBlJ11cbiAgICAgICwgdGV4dDogZmxvd0l0ZW1bJ25hbWUnXVxuICAgICAgfVxuICB9XG4gIHJldHVybiByZXN1bHRcbn1cbiJdfQ==
//# sourceURL=/home/stefano/.atom/packages/autocomplete-flow/src/helpers.js
