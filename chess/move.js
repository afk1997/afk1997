const fs = require('fs');
const path = require('path');
const { Chess } = require('chess.js');

const STATE_PATH = path.join(__dirname, 'state.fen');
const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

function readFen() {
  return fs.readFileSync(STATE_PATH, 'utf8').trim();
}

function writeFen(fen) {
  fs.writeFileSync(STATE_PATH, fen);
}

function pickRandomMove(chess) {
  const moves = chess.moves({ verbose: true });
  if (moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
}

function gameOverReason(chess) {
  if (chess.isCheckmate()) return 'checkmate';
  if (chess.isStalemate()) return 'stalemate';
  if (chess.isDraw()) return 'draw';
  return 'game over';
}

function main() {
  const moveString = process.argv[2];
  if (!moveString || !/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(moveString)) {
    console.error('Usage: node chess/move.js <from><to>[promotion]   e.g., e2e4 or e7e8q');
    process.exit(2);
  }

  const from = moveString.slice(0, 2);
  const to = moveString.slice(2, 4);
  const promotion = moveString.length === 5 ? moveString[4] : undefined;

  const chess = new Chess(readFen());

  // Apply player's move
  let playerMove;
  try {
    playerMove = chess.move({ from, to, promotion });
  } catch (err) {
    console.error(`illegal move: ${moveString} on FEN ${chess.fen()}`);
    process.exit(3);
  }
  if (!playerMove) {
    console.error(`illegal move: ${moveString} on FEN ${chess.fen()}`);
    process.exit(3);
  }
  console.log(`player: ${playerMove.san}`);

  if (chess.isGameOver()) {
    console.log(`game over (${gameOverReason(chess)}). resetting.`);
    writeFen(STARTING_FEN);
    return;
  }

  // Bot makes a random legal counter-move
  const botMove = pickRandomMove(chess);
  if (botMove) {
    chess.move(botMove);
    console.log(`bot:    ${botMove.san}`);
  }

  if (chess.isGameOver()) {
    console.log(`game over (${gameOverReason(chess)}). resetting.`);
    writeFen(STARTING_FEN);
    return;
  }

  writeFen(chess.fen());
  console.log('new FEN:', chess.fen());
}

main();
