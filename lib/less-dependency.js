'use strict';

var _ = require('lodash');
var path = require('path');
var less = require('less');

var LessDependency = function(options) {
    this.options = _.clone(options || {});
    this.options.paths = (this.options.paths || []).map(function(dir) {
        return path.resolve(process.cwd(), dir);
    });
    this.dependents = {};
};
LessDependency.prototype.depend = function(dependent, on) {
    var list = _.uniq((this.dependents[on] || []).concat([dependent]));
    this.dependents[on] = list;
};
LessDependency.prototype.parseImports = function(input) {
    var filename = input.path;
    var entryPath = filename.replace(/[^\/\\]*$/, '');
    var context = new less.contexts.Parse(this.options);
    var rootFileInfo = this.options.rootFileInfo || {
        filename: filename,
        relativeUrls: context.relativeUrls,
        rootpath: context.rootpath || '',
        currentDirectory: entryPath,
        entryPath: entryPath,
        rootFilename: filename
    };
    var imports = new less.ImportManager(context, rootFileInfo);
    var parser = new less.Parser(context, imports, rootFileInfo);
    parser.parse(input.contents.toString(), function(err /* , tree */) {
        if (!err) {
            for (var file in imports.files) {
                if (!imports.files.hasOwnProperty(file) ||
                    file === imports.rootFilename) continue;
                this.depend(
                    filename,
                    path.resolve(path.dirname(filename), file)
                );
            }
        }
    }.bind(this));
};
LessDependency.prototype.accumulateDependentsOn = function(path) {
    if (this.dependents[path]) {
        return this.dependents[path].reduce(function(r, f) {
            return r.concat(this.accumulateDependentsOn(f));
        }.bind(this), [path]);
    } else {
        return [path];
    }
};

module.exports = LessDependency;
