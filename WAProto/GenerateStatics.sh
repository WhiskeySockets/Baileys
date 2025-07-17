yarn pbjs -t static-module -w es6 --no-bundle -o ./WAProto/index.js ./WAProto/WAProto.proto;
yarn pbts -o ./WAProto/index.d.ts ./WAProto/index.js;
node ./fix-imports.js
