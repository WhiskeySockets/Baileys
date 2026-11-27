# Run from this folder so the relative paths below work no matter where the script is called from
# (e.g. `yarn gen:protobuf` runs it from the repository root).
cd "$(dirname "$0")" || exit 1

yarn pbjs -t static-module --no-beautify -w es6 --no-bundle --no-delimited --no-verify --no-comments -o ./index.js ./WAProto.proto;
yarn pbjs -t static-module --no-beautify -w es6 --no-bundle --no-delimited --no-verify ./WAProto.proto | yarn pbts --no-comments -o ./index.d.ts -;
node ./fix-imports.js
