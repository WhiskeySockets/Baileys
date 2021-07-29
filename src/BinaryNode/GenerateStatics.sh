yarn pbjs -t static-module -w commonjs -o ./WAMessage/index.js ./src/BinaryNode/WAMessage.proto;
yarn pbts -o ./WAMessage/index.d.ts ./WAMessage/index.js;

#protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_opt=env=node,useOptionals=true,forceLong=long --ts_proto_out=. ./src/Binary/WAMessage.proto;