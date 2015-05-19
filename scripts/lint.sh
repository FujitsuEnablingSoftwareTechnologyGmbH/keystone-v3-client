#!/usr/bin/env bash

## se

./node_modules/.bin/jshint $(find ./lib ./test -type f -name "*.js") \
--reporter checkstyle >> ./lint_checkstyle.xml \
--verbose \
--config ./.jshintrc;

true;
