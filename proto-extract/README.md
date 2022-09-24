# Proto Extract

Derived initially from `whatseow`'s proto extract, this version generates a predictable diff friendly protobuf. It also does not rely on a hardcoded set of modules to look for but finds all proto modules on its own and extracts the proto from there.

## Usage
1. Install dependencies with `yarn` (or `npm install`)
2. `yarn start`
3. The script will update `../WAProto/WAProto.proto` (except if something is broken)
