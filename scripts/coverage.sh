#!/usr/bin/env bash

NODE_PATH=lib node_modules/.bin/istanbul cover \
  --include-all-sources \
  ./node_modules/.bin/_mocha -- -R spec test/unit/**/*