const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const README = path.join(__dirname, '..', 'README.md');

const original = fs.readFileSync(README, 'utf8');

const result = spawnSync('node', [path.join(__dirname, 'update-readme.js')], { encoding: 'utf8' });
if (result.status !== 0) {
  console.error('update-readme.js failed:', result.stdout, result.stderr);
  process.exit(1);
}

const updated = fs.readFileSync(README, 'utf8');

// Restore original (keeps repo clean if test runs locally)
fs.writeFileSync(README, original);

const hasBoardImage = /chess\/board\.svg/.test(updated);
const hasMovesTable = /\| FROM \| TO/.test(updated);
const hasIssueLink  = /issues\/new\?title=chess%7Cmove%7C/.test(updated);
const hasMarkers    = updated.includes('<!-- CHESS_START -->') && updated.includes('<!-- CHESS_END -->');

if (!hasBoardImage) { console.error('missing board image'); process.exit(1); }
if (!hasMovesTable) { console.error('missing moves table'); process.exit(1); }
if (!hasIssueLink)  { console.error('missing issue link');  process.exit(1); }
if (!hasMarkers)    { console.error('chess markers were destroyed'); process.exit(1); }

console.log('✓ readme update test passed');
