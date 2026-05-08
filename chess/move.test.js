// Smoke test for move.js — run via `node chess/move.test.js`.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const STATE = path.join(__dirname, 'state.fen');
const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// reset state to starting position
fs.writeFileSync(STATE, STARTING_FEN);

// apply white move e2e4 — should succeed and trigger a black bot move
const result = spawnSync('node', [path.join(__dirname, 'move.js'), 'e2e4'], { encoding: 'utf8' });

if (result.status !== 0) {
  console.error('move.js failed:', result.stdout, result.stderr);
  process.exit(1);
}

const newFen = fs.readFileSync(STATE, 'utf8').trim();
if (newFen === STARTING_FEN) {
  console.error('FEN did not change after move');
  process.exit(1);
}
if (!newFen.includes(' w ')) {
  console.error('expected white-to-move after bot counter-move; got:', newFen);
  process.exit(1);
}

console.log('✓ move test passed; new FEN:', newFen);
