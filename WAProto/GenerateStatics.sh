yarn pbjs -t static-module -w commonjs -o ./WAProto/index.js ./WAProto/WAProto.proto;
yarn pbts -o ./WAProto/index.d.ts ./WAProto/index.js;

#protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_opt=env=node,useOptionals=true,forceLong=long --ts_proto_out=. ./src/Binary/WAMessage.proto;