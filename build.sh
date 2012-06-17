#!/bin/bash

DIST="dist"
COMPRESSOR="uglifyjs"

# check for the compressor
command -v $COMPRESSOR >/dev/null 2>&1 || { echo >&2 "I require $COMPRESSOR but it's not installed.  Exiting."; exit 1; }


# create dist directory if it does not exist
if [ ! -d $DIST ]; then
  mkdir dist
fi

# concatinate all files together
cat src/stately.js src/class.js src/command.js src/state_machine.js > $DIST/stately.js

# use uglifyjs to concatinate.
$COMPRESSOR $DIST/stately.js > $DIST/stately.min.js

