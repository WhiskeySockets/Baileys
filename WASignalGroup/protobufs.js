const path = require('path');
const protobuf = require('protobufjs');

const protodir = path.resolve(__dirname);
const group = protobuf.loadSync(path.join(protodir, 'group.proto')).lookup('groupproto');

module.exports = {
    SenderKeyDistributionMessage: group.lookup('SenderKeyDistributionMessage'),
    SenderKeyMessage: group.lookup('SenderKeyMessage'),
    SenderKeyStateStructure: group.lookup('SenderKeyStateStructure'),
    SenderChainKey: group.lookup('SenderChainKey'),
    SenderSigningKey: group.lookup('SenderSigningKey'),
};
