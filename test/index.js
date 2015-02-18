require('should');
var lessDependents = require('..');
var LessDependency = require('../lib/less-dependency');
var util = require('gulp-util');
var fs = require('fs');
var path = require('path');

function createVinyl(lessFileName) {
    var base = path.join(__dirname, 'fixtures');
    var filePath = path.join(base, lessFileName);
    return new util.File({
        cwd: __dirname,
        base: base,
        path: filePath,
        contents: fs.readFileSync(filePath)
    });
}

describe('lessDependents()', function() {
    it('should pass through a file when it isNull()', function(done) {
        var stream = lessDependents();
        var emptyFile = {
            isNull: function() { return true; }
        };
        stream.on('data', function(data) {
            data.should.equal(emptyFile);
            done();
        });
        stream.write(emptyFile);
    });

    it('should pass a less file when it has no dependency', function(done) {
        var stream = lessDependents();
        var file = createVinyl('no-dependency.less');
        stream.on('data', function(data) {
            data.should.have.properties({
                path: file.path,
                base: file.base
            });
            done();
        });
        stream.write(file);
    });

    it('should pass a less file with dependency', function(done) {
        var stream = lessDependents();
        var file = createVinyl('with-dependency.less');
        stream.on('data', function(data) {
            data.should.have.properties({
                path: file.path,
                base: file.base
            });
            done();
        });
        stream.write(file);
    });

    var dependent = createVinyl('with-dependency.less');
    var dependency = new LessDependency();
    dependency.parseImports(dependent);

    it('should collect dependents', function(done) {
        var stream = lessDependents({ dependency: dependency });
        var file = createVinyl('lib/mixin.less');

        var collected = [];

        stream.on('data', function(data) {
            collected.push(data.relative);
        });
        stream.on('end', function() {
            collected.sort().should.eql([
                path.join('lib', 'mixin.less'),
                'with-dependency.less'
            ]);
            done();
        });

        stream.write(file);
        stream.end();
    });
});
