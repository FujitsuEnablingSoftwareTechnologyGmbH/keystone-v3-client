#!/usr/bin/env bash

NODE_PATH=lib node_modules/.bin/mocha \
  --colors \
  --sort \
  --recursive \
  --ui bdd \
  --expose-gc \
  --check-leaks \
  ./test/
