pnpm exec pbjs -t static-module --no-beautify -w es6 --no-bundle --no-delimited --no-verify --no-comments -o ./index.js ./WAProto.proto;
pnpm exec pbjs -t static-module --no-beautify -w es6 --no-bundle --no-delimited --no-verify ./WAProto.proto | pnpm exec pbts --no-comments -o ./index.d.ts -;
node ./fix-imports.js
