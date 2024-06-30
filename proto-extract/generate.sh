#!/bin/bash
cd $(dirname $0)
set -euo pipefail
if [[ ! -f "protos.js" ]]; then
	echo "Please download the WhatsApp JavaScript modules with protobuf schemas into protos.js first"
	exit 1
fi
node index.js
node generateStatics.js
