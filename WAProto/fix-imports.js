import { readFileSync, writeFileSync } from 'fs';
import { exit } from 'process';

const filePath = './index.js';

try {
  // Read the file
  let content = readFileSync(filePath, 'utf8');

  // Fix the import statement
  content = content.replace(
    /import \* as (\$protobuf) from/g,
    'import $1 from'
  );

  // add missing extension to the import
  content = content.replace(
    /(['"])protobufjs\/minimal(['"])/g,
    '$1protobufjs/minimal.js$2'
  );

  // Write back
  writeFileSync(filePath, content, 'utf8');

  console.log(`✅ Fixed imports in ${filePath}`);
} catch (error) {
  console.error(`❌ Error fixing imports: ${error.message}`);
  exit(1);
}
