#!/bin/sh
# Paths below are relative to this directory; `yarn gen:protobuf` runs the
# script from the repository root, so move here first.
cd "$(dirname "$0")" || exit 1

yarn pbjs -t static-module --no-beautify -w es6 --no-bundle --no-delimited --no-verify --no-comments -o ./index.js ./WAProto.proto;
yarn pbjs -t static-module --no-beautify -w es6 --no-bundle --no-delimited --no-verify ./WAProto.proto | yarn pbts --no-comments -o ./index.d.ts -;
node ./fix-imports.js
