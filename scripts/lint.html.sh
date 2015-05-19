#!/usr/bin/env bash

rm -f ./test/lint_result.html >> /dev/null; true;

./node_modules/.bin/jshint $(find ./lib ./test -type f -name "*.js") \
--reporter node_modules/jshint-html-reporter/reporter.js >> ./lint_pretty.html \
--verbose \
--config ./.jshintrc;

true;
