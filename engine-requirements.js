const major = parseInt(process.versions.node.split('.')[0], 10);

if (major < 22) {
  console.error(
    `\n❌ This package requires Node.js 22+ to run reliably.\n` +
    `   You are using Node.js ${process.versions.node}.\n` +
    `   Please upgrade to Node.js 22+ to proceed.\n`
  );
  process.exit(1);
}
