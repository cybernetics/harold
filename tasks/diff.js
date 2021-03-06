const fs = require('fs');
const path = require('path');

const colorize = require('../lib/colorize');
const printBuildTime = require('../lib/print-build-time');
const printDiffFileTree = require('../lib/print-diff-file-tree');
const printDiffTotal = require('../lib/print-diff-total');
const printSnapshotInfo = require('../lib/print-snapshot-info');

module.exports = function diff(left, right) {
  const leftPath = path.resolve(left);
  const rightPath = path.resolve(right);

  const leftBuffer = fs.readFileSync(leftPath);
  const rightBuffer = fs.readFileSync(rightPath);

  if (leftBuffer.equals(rightBuffer)) {
    console.log('Snapshots are equal');
    process.exit(0);
  }

  const leftSnapshot = JSON.parse(leftBuffer.toString());
  const rightSnapshot = JSON.parse(rightBuffer.toString());

  console.log();

  // Snapshots info
  console.log(colorize('Snapshots:').cyan);
  printSnapshotInfo(leftSnapshot, 'Left');
  printSnapshotInfo(rightSnapshot, 'Right');
  console.log();

  // Build time
  console.log(colorize('Build time:').cyan);
  printBuildTime(leftSnapshot.buildTime, rightSnapshot.buildTime);
  console.log();

  // Total diff
  console.log(colorize('Diff by category:').cyan);
  printDiffTotal({
    left: leftSnapshot.total,
    right: rightSnapshot.total,
    leftCaption: path.parse(leftPath).name,
    rightCaption: path.parse(rightPath).name,
  });
  console.log();

  // File tree diff
  console.log(colorize('Diff by files:').cyan);
  printDiffFileTree(leftSnapshot.fsEntries, rightSnapshot.fsEntries);
  console.log();
};
