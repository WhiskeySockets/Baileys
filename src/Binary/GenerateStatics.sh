yarn pbjs -t static-module -w commonjs -o ./WAMessage/WAMessage.js ./src/Binary/WAMessage.proto;
yarn pbts -o ./WAMessage/WAMessage.d.ts ./WAMessage/WAMessage.js;

#protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_opt=env=node,useOptionals=true,forceLong=long --ts_proto_out=. ./src/Binary/WAMessage.proto;