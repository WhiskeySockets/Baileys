#!/bin/sh
# Run from the baileys package root regardless of the caller's CWD: `pnpm exec` only
# resolves the local .bin from a package root (it errors with ERR_PNPM_RECURSIVE_EXEC
# from inside WAProto/), and the paths below are relative to packages/baileys.
cd "$(dirname "$0")/.." || exit 1

pnpm exec pbjs -t static-module --no-beautify -w es6 --no-bundle --no-delimited --no-verify --no-comments -o ./WAProto/index.js ./WAProto/WAProto.proto;
pnpm exec pbjs -t static-module --no-beautify -w es6 --no-bundle --no-delimited --no-verify ./WAProto/WAProto.proto | pnpm exec pbts --no-comments -o ./WAProto/index.d.ts -;
node ./WAProto/fix-imports.js
