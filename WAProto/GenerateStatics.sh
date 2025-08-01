yarn pbjs -t static-module --no-convert --no-beautify -w es6 --no-bundle --no-delimited --no-verify --no-comments -o ./index.js ./WAProto.proto;
yarn pbjs -t static-module --no-convert --no-beautify -w es6 --no-bundle --no-delimited --no-verify ./WAProto.proto | yarn pbts --no-comments -o ./index.d.ts -;
node ./fix-imports.js
