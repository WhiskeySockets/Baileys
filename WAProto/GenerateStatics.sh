yarn pbjs -t static-module -w es6 --no-bundle -o ./index.js ./WAProto.proto;
yarn pbts -o ./index.d.ts ./index.js;
node ./fix-imports.js
