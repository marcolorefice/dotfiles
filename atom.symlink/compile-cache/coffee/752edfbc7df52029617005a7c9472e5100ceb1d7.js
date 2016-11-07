(function() {
  var LB, chai, defaultConfig, expect, fs, grammarTest, path, temp;

  chai = require('../node_modules/chai');

  expect = chai.expect;

  fs = require('fs-plus');

  path = require('path');

  defaultConfig = require('./default-config');

  grammarTest = require('atom-grammar-test');

  temp = require('temp');

  LB = 'language-babel';

  describe('language-babel', function() {
    var config, lb;
    lb = null;
    config = {};
    beforeEach(function() {
      temp.cleanup();
      waitsForPromise(function() {
        return atom.packages.activatePackage(LB);
      });
      config = JSON.parse(JSON.stringify(defaultConfig));
      return runs(function() {
        return lb = atom.packages.getActivePackage(LB).mainModule.transpiler;
      });
    });
    describe('Reading real config', function() {
      return it('should read all possible configuration keys', function() {
        var key, realConfig, value, _results;
        realConfig = lb.getConfig();
        _results = [];
        for (key in config) {
          value = config[key];
          _results.push(expect(realConfig).to.contain.all.keys(key));
        }
        return _results;
      });
    });
    describe(':getPaths', function() {
      if (!process.platform.match(/^win/)) {
        it('returns paths for a named sourcefile with default config', function() {
          var ret, tempProj1, tempProj2;
          tempProj1 = temp.mkdirSync();
          tempProj2 = temp.mkdirSync();
          atom.project.setPaths([tempProj1, tempProj2]);
          ret = lb.getPaths(tempProj1 + '/source/dira/fauxfile.js', config);
          expect(ret.sourceFile).to.equal(tempProj1 + '/source/dira/fauxfile.js');
          expect(ret.sourceFileDir).to.equal(tempProj1 + '/source/dira');
          expect(ret.mapFile).to.equal(tempProj1 + '/source/dira/fauxfile.js.map');
          expect(ret.transpiledFile).to.equal(tempProj1 + '/source/dira/fauxfile.js');
          expect(ret.sourceRoot).to.equal(tempProj1);
          return expect(ret.projectPath).to.equal(tempProj1);
        });
        it('returns paths config with target & source paths set', function() {
          var ret, tempProj1, tempProj2;
          tempProj1 = temp.mkdirSync();
          tempProj2 = temp.mkdirSync();
          atom.project.setPaths([tempProj1, tempProj2]);
          config.babelSourcePath = '/source';
          config.babelMapsPath = 'mapspath';
          config.babelTranspilePath = '/transpath';
          ret = lb.getPaths(tempProj1 + '/source/dira/fauxfile.js', config);
          expect(ret.sourceFile).to.equal(tempProj1 + '/source/dira/fauxfile.js');
          expect(ret.sourceFileDir).to.equal(tempProj1 + '/source/dira');
          expect(ret.mapFile).to.equal(tempProj1 + '/mapspath/dira/fauxfile.js.map');
          expect(ret.transpiledFile).to.equal(tempProj1 + '/transpath/dira/fauxfile.js');
          expect(ret.sourceRoot).to.equal(tempProj1 + '/source');
          return expect(ret.projectPath).to.equal(tempProj1);
        });
        it('returns correct paths with project in root directory', function() {
          var ret, tempProj1, tempProj2;
          tempProj1 = temp.mkdirSync();
          tempProj2 = temp.mkdirSync();
          atom.project.setPaths(['/']);
          config.babelSourcePath = 'source';
          config.babelMapsPath = 'mapspath';
          config.babelTranspilePath = 'transpath';
          ret = lb.getPaths('/source/dira/fauxfile.js', config);
          expect(ret.sourceFile).to.equal('/source/dira/fauxfile.js');
          expect(ret.sourceFileDir).to.equal('/source/dira');
          expect(ret.mapFile).to.equal('/mapspath/dira/fauxfile.js.map');
          expect(ret.transpiledFile).to.equal('/transpath/dira/fauxfile.js');
          expect(ret.sourceRoot).to.equal('/source');
          return expect(ret.projectPath).to.equal('/');
        });
      }
      if (process.platform.match(/^win/)) {
        it('returns paths for a named sourcefile with default config', function() {
          var ret, tempProj1, tempProj2;
          tempProj1 = temp.mkdirSync();
          tempProj2 = temp.mkdirSync();
          atom.project.setPaths([tempProj1, tempProj2]);
          ret = lb.getPaths(tempProj1 + '\\source\\dira\\fauxfile.js', config);
          expect(ret.sourceFile).to.equal(tempProj1 + '\\source\\dira\\fauxfile.js');
          expect(ret.sourceFileDir).to.equal(tempProj1 + '\\source\\dira');
          expect(ret.mapFile).to.equal(tempProj1 + '\\source\\dira\\fauxfile.js.map');
          expect(ret.transpiledFile).to.equal(tempProj1 + '\\source\\dira\\fauxfile.js');
          expect(ret.sourceRoot).to.equal(tempProj1);
          return expect(ret.projectPath).to.equal(tempProj1);
        });
        it('returns paths config with target & source paths set', function() {
          var ret, tempProj1, tempProj2;
          tempProj1 = temp.mkdirSync();
          tempProj2 = temp.mkdirSync();
          atom.project.setPaths([tempProj1, tempProj2]);
          config.babelSourcePath = '\\source';
          config.babelMapsPath = 'mapspath';
          config.babelTranspilePath = '\\transpath';
          ret = lb.getPaths(tempProj1 + '\\source\\dira\\fauxfile.js', config);
          expect(ret.sourceFile).to.equal(tempProj1 + '\\source\\dira\\fauxfile.js');
          expect(ret.sourceFileDir).to.equal(tempProj1 + '\\source\\dira');
          expect(ret.mapFile).to.equal(tempProj1 + '\\mapspath\\dira\\fauxfile.js.map');
          expect(ret.transpiledFile).to.equal(tempProj1 + '\\transpath\\dira\\fauxfile.js');
          expect(ret.sourceRoot).to.equal(tempProj1 + '\\source');
          return expect(ret.projectPath).to.equal(tempProj1);
        });
        return it('returns correct paths with project in root directory', function() {
          var ret;
          atom.project.setPaths(['C:\\']);
          config.babelSourcePath = 'source';
          config.babelMapsPath = 'mapspath';
          config.babelTranspilePath = 'transpath';
          ret = lb.getPaths('C:\\source\\dira\\fauxfile.js', config);
          expect(ret.sourceFile).to.equal('C:\\source\\dira\\fauxfile.js');
          expect(ret.sourceFileDir).to.equal('C:\\source\\dira');
          expect(ret.mapFile).to.equal('C:\\mapspath\\dira\\fauxfile.js.map');
          expect(ret.transpiledFile).to.equal('C:\\transpath\\dira\\fauxfile.js');
          expect(ret.sourceRoot).to.equal('C:\\source');
          return expect(ret.projectPath).to.equal('C:\\');
        });
      }
    });
    return describe(':transpile', function() {
      var notification, notificationSpy, writeFileName, writeFileStub;
      notificationSpy = null;
      notification = null;
      writeFileStub = null;
      writeFileName = null;
      beforeEach(function() {
        notificationSpy = jasmine.createSpy('notificationSpy');
        notification = atom.notifications.onDidAddNotification(notificationSpy);
        writeFileName = null;
        return writeFileStub = spyOn(fs, 'writeFileSync').andCallFake(function(path) {
          return writeFileName = path;
        });
      });
      afterEach(function() {
        return notification.dispose();
      });
      describe('when transpileOnSave is false', function() {
        return it('does nothing', function() {
          config.transpileOnSave = false;
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile('somefilename');
          expect(notificationSpy.callCount).to.equal(0);
          return expect(writeFileStub.callCount).to.equal(0);
        });
      });
      describe('When a source file is outside the "babelSourcePath" & suppress msgs false', function() {
        return it('notifies sourcefile is not inside sourcepath', function() {
          var msg, type;
          atom.project.setPaths([__dirname]);
          config.babelSourcePath = 'fixtures';
          config.babelTranspilePath = 'fixtures';
          config.babelMapsPath = 'fixtures';
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile(__dirname + '/fake.js');
          expect(notificationSpy.callCount).to.equal(1);
          msg = notificationSpy.calls[0].args[0].message;
          type = notificationSpy.calls[0].args[0].type;
          expect(msg).to.match(/^LB: Babel file is not inside/);
          return expect(writeFileStub.callCount).to.equal(0);
        });
      });
      describe('When a source file is outside the "babelSourcePath" & suppress msgs true', function() {
        return it('exects no notifications', function() {
          atom.project.setPaths([__dirname]);
          config.babelSourcePath = 'fixtures';
          config.babelTranspilePath = 'fixtures';
          config.babelMapsPath = 'fixtures';
          config.suppressSourcePathMessages = true;
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile(__dirname + '/fake.js');
          expect(notificationSpy.callCount).to.equal(0);
          return expect(writeFileStub.callCount).to.equal(0);
        });
      });
      describe('When a js files is transpiled and gets an error', function() {
        return it('it issues a notification error message', function() {
          atom.project.setPaths([__dirname]);
          config.babelSourcePath = 'fixtures';
          config.babelTranspilePath = 'fixtures';
          config.babelMapsPath = 'fixtures';
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile(path.resolve(__dirname, 'fixtures/dira/dira.1/dira.2/bad.js'));
          waitsFor(function() {
            return notificationSpy.callCount;
          });
          return runs(function() {
            var msg;
            expect(notificationSpy.callCount).to.equal(1);
            msg = notificationSpy.calls[0].args[0].message;
            expect(msg).to.match(/^LB: Babel.*Transpiler Error/);
            return expect(writeFileStub.callCount).to.equal(0);
          });
        });
      });
      describe('When a js file saved but no output is set', function() {
        return it('calls the transpiler but doesnt save output', function() {
          atom.project.setPaths([__dirname]);
          config.babelSourcePath = 'fixtures';
          config.babelTranspilePath = 'fixtures';
          config.babelMapsPath = 'fixtures';
          config.createTranspiledCode = false;
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile(path.resolve(__dirname, 'fixtures/dira/dira.1/dira.2/react.jsx'));
          waitsFor(function() {
            return notificationSpy.callCount > 1;
          });
          return runs(function() {
            var msg;
            expect(notificationSpy.callCount).to.equal(2);
            msg = notificationSpy.calls[0].args[0].message;
            expect(msg).to.match(/^LB: Babel.*Transpiler Success/);
            msg = notificationSpy.calls[1].args[0].message;
            expect(msg).to.match(/^LB: No transpiled output configured/);
            return expect(writeFileStub.callCount).to.equal(0);
          });
        });
      });
      describe('When a js file saved but no transpile path is set', function() {
        return it('calls the transpiler and transpiles OK but doesnt save and issues msg', function() {
          atom.project.setPaths([__dirname]);
          config.babelSourcePath = 'fixtures';
          config.babelTranspilePath = 'fixtures';
          config.babelMapsPath = 'fixtures';
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile(path.resolve(__dirname, 'fixtures/dira/dira.1/dira.2/good.js'));
          waitsFor(function() {
            return notificationSpy.callCount > 1;
          });
          return runs(function() {
            var msg;
            expect(notificationSpy.callCount).to.equal(2);
            msg = notificationSpy.calls[0].args[0].message;
            expect(msg).to.match(/^LB: Babel.*Transpiler Success/);
            msg = notificationSpy.calls[1].args[0].message;
            expect(msg).to.match(/^LB: Transpiled file would overwrite source file/);
            return expect(writeFileStub.callCount).to.equal(0);
          });
        });
      });
      describe('When a jsx file saved,transpile path is set, source maps enabled', function() {
        return it('calls the transpiler and transpiles OK, saves as .js and issues msg', function() {
          atom.project.setPaths([__dirname]);
          config.babelSourcePath = 'fixtures';
          config.babelTranspilePath = 'fixtures-transpiled';
          config.babelMapsPath = 'fixtures-maps';
          config.createMap = true;
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile(path.resolve(__dirname, 'fixtures/dira/dira.1/dira.2/react.jsx'));
          waitsFor(function() {
            return writeFileStub.callCount;
          });
          return runs(function() {
            var expectedFileName, msg, savedFilename;
            expect(notificationSpy.callCount).to.equal(1);
            msg = notificationSpy.calls[0].args[0].message;
            expect(msg).to.match(/^LB: Babel.*Transpiler Success/);
            expect(writeFileStub.callCount).to.equal(2);
            savedFilename = writeFileStub.calls[0].args[0];
            expectedFileName = path.resolve(__dirname, 'fixtures-transpiled/dira/dira.1/dira.2/react.js');
            expect(savedFilename).to.equal(expectedFileName);
            savedFilename = writeFileStub.calls[1].args[0];
            expectedFileName = path.resolve(__dirname, 'fixtures-maps/dira/dira.1/dira.2/react.js.map');
            return expect(savedFilename).to.equal(expectedFileName);
          });
        });
      });
      describe('When a jsx file saved,transpile path is set, source maps enabled, success suppressed', function() {
        return it('calls the transpiler and transpiles OK, saves as .js and issues msg', function() {
          atom.project.setPaths([__dirname]);
          config.babelSourcePath = 'fixtures';
          config.babelTranspilePath = 'fixtures-transpiled';
          config.babelMapsPath = 'fixtures-maps';
          config.createMap = true;
          config.suppressTranspileOnSaveMessages = true;
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile(path.resolve(__dirname, 'fixtures/dira/dira.1/dira.2/react.jsx'));
          waitsFor(function() {
            return writeFileStub.callCount;
          });
          return runs(function() {
            var expectedFileName, savedFilename;
            expect(notificationSpy.callCount).to.equal(0);
            expect(writeFileStub.callCount).to.equal(2);
            savedFilename = writeFileStub.calls[0].args[0];
            expectedFileName = path.resolve(__dirname, 'fixtures-transpiled/dira/dira.1/dira.2/react.js');
            expect(savedFilename).to.equal(expectedFileName);
            savedFilename = writeFileStub.calls[1].args[0];
            expectedFileName = path.resolve(__dirname, 'fixtures-maps/dira/dira.1/dira.2/react.js.map');
            return expect(savedFilename).to.equal(expectedFileName);
          });
        });
      });
      describe('When a js file saved , babelrc in path and flag disableWhenNoBabelrcFileInPath is set', function() {
        return it('calls the transpiler', function() {
          atom.project.setPaths([__dirname]);
          config.babelSourcePath = 'fixtures';
          config.babelTranspilePath = 'fixtures';
          config.babelMapsPath = 'fixtures';
          config.createTranspiledCode = false;
          config.disableWhenNoBabelrcFileInPath = true;
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile(path.resolve(__dirname, 'fixtures/dira/dira.1/dira.2/good.js'));
          waitsFor(function() {
            return notificationSpy.callCount;
          });
          return runs(function() {
            var msg;
            expect(notificationSpy.callCount).to.equal(2);
            msg = notificationSpy.calls[0].args[0].message;
            expect(msg).to.match(/^LB: Babel.*Transpiler Success/);
            msg = notificationSpy.calls[1].args[0].message;
            expect(msg).to.match(/^LB: No transpiled output configured/);
            return expect(writeFileStub.callCount).to.equal(0);
          });
        });
      });
      describe('When a js file saved , babelrc in not in path and flag disableWhenNoBabelrcFileInPath is set', function() {
        return it('does nothing', function() {
          atom.project.setPaths([__dirname]);
          config.babelSourcePath = 'fixtures';
          config.babelTranspilePath = 'fixtures';
          config.babelMapsPath = 'fixtures';
          config.createTranspiledCode = false;
          config.disableWhenNoBabelrcFileInPath = true;
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          lb.transpile(path.resolve(__dirname, 'fixtures/dirb/good.js'));
          expect(notificationSpy.callCount).to.equal(0);
          return expect(writeFileStub.callCount).to.equal(0);
        });
      });
      describe('When a js file saved in a nested project', function() {
        return it('creates a file in the correct location based upon .languagebabel', function() {
          var sourceFile, targetFile;
          atom.project.setPaths([__dirname]);
          config.allowLocalOverride = true;
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          sourceFile = path.resolve(__dirname, 'fixtures/projectRoot/src/test.js');
          targetFile = path.resolve(__dirname, 'fixtures/projectRoot/test.js');
          lb.transpile(sourceFile);
          waitsFor(function() {
            return writeFileStub.callCount;
          });
          return runs(function() {
            return expect(writeFileName).to.equal(targetFile);
          });
        });
      });
      return describe('When a directory is compiled', function() {
        return it('transpiles the js,jsx,es,es6,babel files but ignores minified files', function() {
          var sourceDir;
          atom.project.setPaths([__dirname]);
          config.allowLocalOverride = true;
          spyOn(lb, 'getConfig').andCallFake(function() {
            return config;
          });
          sourceDir = path.resolve(__dirname, 'fixtures/projectRoot/src/');
          lb.transpileDirectory({
            directory: sourceDir
          });
          waitsFor(function() {
            return writeFileStub.callCount >= 5;
          });
          return runs(function() {
            return expect(writeFileStub.callCount).to.equal(5);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvc3RlZmFuby8uYXRvbS9wYWNrYWdlcy9sYW5ndWFnZS1iYWJlbC9zcGVjL3RyYW5zcGlsZS1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0REFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsc0JBQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsTUFBQSxHQUFTLElBQUksQ0FBQyxNQURkLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FGTCxDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUlBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSLENBSmhCLENBQUE7O0FBQUEsRUFLQSxXQUFBLEdBQWMsT0FBQSxDQUFRLG1CQUFSLENBTGQsQ0FBQTs7QUFBQSxFQU1BLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQU5QLENBQUE7O0FBQUEsRUFRQSxFQUFBLEdBQUssZ0JBUkwsQ0FBQTs7QUFBQSxFQWdCQSxRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQSxHQUFBO0FBQ3pCLFFBQUEsVUFBQTtBQUFBLElBQUEsRUFBQSxHQUFLLElBQUwsQ0FBQTtBQUFBLElBQ0EsTUFBQSxHQUFVLEVBRFYsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBSSxDQUFDLE9BQUwsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLEVBQTlCLEVBRGM7TUFBQSxDQUFoQixDQURBLENBQUE7QUFBQSxNQUdBLE1BQUEsR0FBUyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQUksQ0FBQyxTQUFMLENB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

//# sourceURL=/home/stefano/.atom/packages/language-babel/spec/transpile-spec.coffee
