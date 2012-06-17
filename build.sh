#!/bin/bash

DIST="dist"

# Instructions for making closure compiler an executable can be found at:
# https://gist.github.com/739724/ee4b7f60a9838ba9ad5370e703131d6394602fed

# This could also be changed to uglifyjs if that is available.
COMPRESSOR="closure --compilation_level ADVANCED_OPTIMIZATIONS"

# check for the compressor
command -v $COMPRESSOR >/dev/null 2>&1 || { echo >&2 "I require $COMPRESSOR but it's not installed.  Exiting."; exit 1; }

# create dist directory if it does not exist
if [ ! -d $DIST ]; then
  mkdir dist
fi

# concatinate all files together
cat src/stately.js src/class.js src/command.js src/state_machine.js > $DIST/stately.js

# compress!
$COMPRESSOR $DIST/stately.js > $DIST/stately.min.js
