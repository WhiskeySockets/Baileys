yarn pbjs -t static-module --no-comments -w es6 --no-bundle --no-delimited --no-verify -o ./index.js ./WAProto.proto;
yarn pbjs -t static-module -w es6 --no-bundle --no-delimited --no-verify ./WAProto.proto | yarn pbts --no-comments -o ./index.d.ts -;
node ./fix-imports.js
