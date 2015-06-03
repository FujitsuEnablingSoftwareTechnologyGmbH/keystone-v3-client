#!/usr/bin/env bash

./node_modules/.bin/jsdoc $(find ./lib -type f -name "*.js") \
  --access all \
  --destination docs/code \
  --package ./package.json \
  --readme ./README.md

true;
