[gulp][]-less-dependents [![Build Status][travis-img]][travis]
====================
> Collect dependents of less files

Gives you a chance to recompile less files on modification of a file
which those files are depending on.

## Install

```
npm install gulp-less-dependents
```

## Usage

```javascript
var gulp = require('gulp');
var watch = require('gulp-watch');
var lessDependents = require('gulp-less-dependents');
var less = require('gulp-less');

gulp.task('less', function() {
    gulp.src('./less/**/*.less')
        .pipe(watch('./less/**/*.less'))
        .pipe(lessDependents())
        .pipe(less())
        .pipe(gulp.dest('./public/css'));
});
```

`lessDependents()` analyzes dependencies of files passed from the
upstream, and passes files that are (1) passed from the upstream, or
(2) depending on files from the upstream.  For the files of (2), they
must be once a target of analysis earlier; it means that files of (2)
are included in those of (1) for the first time.  In the example above
shows that `src()` gives files of (1), and files of (2) are triggered
by [`watch()`][gulp-watch] after the first run.

If you wish to exclude the depended files from compilation but want to
watch them for recompilation of the dependents, use
[`gulp-filter`](https://github.com/sindresorhus/gulp-filter) for the
exclusion.  For example, if you have depended files in
`./less/includes`, the task may look like the following.

```javascript
var gulp = require('gulp');
var watch = require('gulp-watch');
var gulpFilter = require('gulp-filter');
var lessDependents = require('gulp-less-dependents');
var less = require('gulp-less');

gulp.task('less', function() {
    gulp.src('./less/**/*.less')
        .pipe(watch('./less/**/*.less'))
        .pipe(lessDependents())
        .pipe(gulpFilter([ '*', '!less/includes/*.less' ]))
        .pipe(less())
        .pipe(gulp.dest('./public/css'));
});
```

## API

### lessDependents([options])

#### options

This object is passed to
[`less.Parser`][lessjs] internally used for
dependency analysis.

## License

MIT (c) INA Lintaro (tarao.gnn@gmail.com)

[gulp]: http://gulpjs.com
[gulp-watch]: https://github.com/floatdrop/gulp-watch
[gulp-filter]: https://github.com/sindresorhus/gulp-filter
[lessjs]: https://github.com/less/less.js/

[travis]: https://travis-ci.org/tarao/gulp-less-dependents
[travis-img]: https://img.shields.io/travis/tarao/gulp-less-dependents.svg?branch=master&style=flat
