#!/bin/sh
# Paths below are relative to this directory; `yarn gen:protobuf` runs the
# script from the repository root, so move here first. Stop at the first
# failing step so a bad WAProto.proto cannot leave a truncated index.d.ts
# behind while the script still exits 0.
set -eu
cd "$(dirname "$0")"
trap 'rm -f ./index.commented.tmp.js' EXIT

yarn pbjs -t static-module --no-beautify -w es6 --no-bundle --no-delimited --no-verify --no-comments -o ./index.js ./WAProto.proto
yarn pbjs -t static-module --no-beautify -w es6 --no-bundle --no-delimited --no-verify -o ./index.commented.tmp.js ./WAProto.proto
yarn pbts --no-comments -o ./index.d.ts ./index.commented.tmp.js
node ./fix-imports.js
