
/*
Requires http://pear.php.net/package/PHP_Beautifier
 */

(function() {
  "use strict";
  var fs, possibleOptions, temp;

  fs = require("fs");

  temp = require("temp").track();

  possibleOptions = require("./possible-options.json");

  module.exports = function(options, cb) {
    var ic, isPossible, k, text, v, vs;
    text = "";
    options.output_tab_size = options.output_tab_size || options.indent_size;
    options.input_tab_size = options.input_tab_size || options.indent_size;
    delete options.indent_size;
    ic = options.indent_char;
    if (options.indent_with_tabs === 0 || options.indent_with_tabs === 1 || options.indent_with_tabs === 2) {
      null;
    } else if (ic === " ") {
      options.indent_with_tabs = 0;
    } else if (ic === "\t") {
      options.indent_with_tabs = 2;
    } else {
      options.indent_with_tabs = 1;
    }
    delete options.indent_char;
    delete options.languageOverride;
    delete options.configPath;
    for (k in options) {
      isPossible = possibleOptions.indexOf(k) !== -1;
      if (isPossible) {
        v = options[k];
        vs = v;
        if (typeof vs === "boolean") {
          if (vs === true) {
            vs = "True";
          } else {
            vs = "False";
          }
        }
        text += k + " = " + vs + "\n";
      } else {
        delete options[k];
      }
    }
    return temp.open({
      suffix: ".cfg"
    }, function(err, info) {
      if (!err) {
        return fs.write(info.fd, text || "", function(err) {
          if (err) {
            return cb(err);
          }
          return fs.close(info.fd, function(err) {
            if (err) {
              return cb(err);
            }
            return cb(null, info.path);
          });
        });
      } else {
        return cb(err);
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL3N0ZWZhbm8uY29yYWxsby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3JjL2JlYXV0aWZpZXJzL3VuY3J1c3RpZnkvY2ZnLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUE7O0dBQUE7QUFBQTtBQUFBO0FBQUEsRUFHQSxZQUhBLENBQUE7QUFBQSxNQUFBLHlCQUFBOztBQUFBLEVBSUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBSkwsQ0FBQTs7QUFBQSxFQUtBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFlLENBQUMsS0FBaEIsQ0FBQSxDQUxQLENBQUE7O0FBQUEsRUFNQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSx5QkFBUixDQU5sQixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxPQUFELEVBQVUsRUFBVixHQUFBO0FBQ2YsUUFBQSw4QkFBQTtBQUFBLElBQUEsSUFBQSxHQUFPLEVBQVAsQ0FBQTtBQUFBLElBR0EsT0FBTyxDQUFDLGVBQVIsR0FBMEIsT0FBTyxDQUFDLGVBQVIsSUFBMkIsT0FBTyxDQUFDLFdBSDdELENBQUE7QUFBQSxJQUlBLE9BQU8sQ0FBQyxjQUFSLEdBQXlCLE9BQU8sQ0FBQyxjQUFSLElBQTBCLE9BQU8sQ0FBQyxXQUozRCxDQUFBO0FBQUEsSUFLQSxNQUFBLENBQUEsT0FBYyxDQUFDLFdBTGYsQ0FBQTtBQUFBLElBYUEsRUFBQSxHQUFLLE9BQU8sQ0FBQyxXQWJiLENBQUE7QUFjQSxJQUFBLElBQUcsT0FBTyxDQUFDLGdCQUFSLEtBQTRCLENBQTVCLElBQWlDLE9BQU8sQ0FBQyxnQkFBUixLQUE0QixDQUE3RCxJQUFrRSxPQUFPLENBQUMsZ0JBQVIsS0FBNEIsQ0FBakc7QUFDRSxNQUFBLElBQUEsQ0FERjtLQUFBLE1BRUssSUFBRyxFQUFBLEtBQU0sR0FBVDtBQUNILE1BQUEsT0FBTyxDQUFDLGdCQUFSLEdBQTJCLENBQTNCLENBREc7S0FBQSxNQUVBLElBQUcsRUFBQSxLQUFNLElBQVQ7QUFDSCxNQUFBLE9BQU8sQ0FBQyxnQkFBUixHQUEyQixDQUEzQixDQURHO0tBQUEsTUFBQTtBQUdILE1BQUEsT0FBTyxDQUFDLGdCQUFSLEdBQTJCLENBQTNCLENBSEc7S0FsQkw7QUFBQSxJQXNCQSxNQUFBLENBQUEsT0FBYyxDQUFDLFdBdEJmLENBQUE7QUFBQSxJQTJCQSxNQUFBLENBQUEsT0FBYyxDQUFDLGdCQTNCZixDQUFBO0FBQUEsSUE0QkEsTUFBQSxDQUFBLE9BQWMsQ0FBQyxVQTVCZixDQUFBO0FBK0JBLFNBQUEsWUFBQSxHQUFBO0FBRUUsTUFBQSxVQUFBLEdBQWEsZUFBZSxDQUFDLE9BQWhCLENBQXdCLENBQXhCLENBQUEsS0FBZ0MsQ0FBQSxDQUE3QyxDQUFBO0FBQ0EsTUFBQSxJQUFHLFVBQUg7QUFDRSxRQUFBLENBQUEsR0FBSSxPQUFRLENBQUEsQ0FBQSxDQUFaLENBQUE7QUFBQSxRQUNBLEVBQUEsR0FBSyxDQURMLENBQUE7QUFFQSxRQUFBLElBQUcsTUFBQSxDQUFBLEVBQUEsS0FBYSxTQUFoQjtBQUNFLFVBQUEsSUFBRyxFQUFBLEtBQU0sSUFBVDtBQUNFLFlBQUEsRUFBQSxHQUFLLE1BQUwsQ0FERjtXQUFBLE1BQUE7QUFHRSxZQUFBLEVBQUEsR0FBSyxPQUFMLENBSEY7V0FERjtTQUZBO0FBQUEsUUFPQSxJQUFBLElBQVEsQ0FBQSxHQUFJLEtBQUosR0FBWSxFQUFaLEdBQWlCLElBUHpCLENBREY7T0FBQSxNQUFBO0FBV0UsUUFBQSxNQUFBLENBQUEsT0FBZSxDQUFBLENBQUEsQ0FBZixDQVhGO09BSEY7QUFBQSxLQS9CQTtXQWdEQSxJQUFJLENBQUMsSUFBTCxDQUNFO0FBQUEsTUFBQSxNQUFBLEVBQVEsTUFBUjtLQURGLEVBRUUsU0FBQyxHQUFELEVBQU0sSUFBTixHQUFBO0FBQ0EsTUFBQSxJQUFBLENBQUEsR0FBQTtlQUdFLEVBQUUsQ0FBQyxLQUFILENBQVMsSUFBSSxDQUFDLEVBQWQsRUFBa0IsSUFBQSxJQUFRLEVBQTFCLEVBQThCLFNBQUMsR0FBRCxHQUFBO0FBRzVCLFVBQUEsSUFBa0IsR0FBbEI7QUFBQSxtQkFBTyxFQUFBLENBQUcsR0FBSCxDQUFQLENBQUE7V0FBQTtpQkFDQSxFQUFFLENBQUMsS0FBSCxDQUFTLElBQUksQ0FBQyxFQUFkLEVBQWtCLFNBQUMsR0FBRCxHQUFBO0FBR2hCLFlBQUEsSUFBa0IsR0FBbEI7QUFBQSxxQkFBTyxFQUFBLENBQUcsR0FBSCxDQUFQLENBQUE7YUFBQTttQkFDQSxFQUFBLENBQUcsSUFBSCxFQUFTLElBQUksQ0FBQyxJQUFkLEVBSmdCO1VBQUEsQ0FBbEIsRUFKNEI7UUFBQSxDQUE5QixFQUhGO09BQUEsTUFBQTtlQWVFLEVBQUEsQ0FBRyxHQUFILEVBZkY7T0FEQTtJQUFBLENBRkYsRUFqRGU7RUFBQSxDQVBqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/atom-beautify/src/beautifiers/uncrustify/cfg.coffee
