const fs = require('fs');
const path = require('path');
const { Chess } = require('chess.js');

const STATE_PATH = path.join(__dirname, 'state.fen');
const README_PATH = path.join(__dirname, '..', 'README.md');
const REPO = 'afk1997/afk1997';
const START_MARKER = '<!-- CHESS_START -->';
const END_MARKER = '<!-- CHESS_END -->';

function buildChessBlock() {
  const fen = fs.readFileSync(STATE_PATH, 'utf8').trim();
  const chess = new Chess(fen);
  const turn = chess.turn() === 'w' ? 'White' : 'Black';

  // Group legal moves by from-square
  const moves = chess.moves({ verbose: true });
  const grouped = new Map();
  for (const m of moves) {
    if (!grouped.has(m.from)) grouped.set(m.from, []);
    grouped.get(m.from).push(m);
  }

  // Build the moves table
  let table = '| FROM | TO (click to play) |\n| --- | --- |\n';
  for (const [from, list] of [...grouped.entries()].sort()) {
    const links = list.map((m) => {
      const promo = m.promotion ? m.promotion : '';
      const moveCode = `${m.from}${m.to}${promo}`;
      const title = encodeURIComponent(`chess|move|${moveCode}`);
      const body = encodeURIComponent("Just hit 'Submit new issue'. The bot will play back automatically.");
      const url = `https://github.com/${REPO}/issues/new?title=${title}&body=${body}`;
      const label = `${m.to}${m.promotion ? '=' + m.promotion.toUpperCase() : ''}`;
      return `[${label}](${url})`;
    });
    table += `| **${from.toUpperCase()}** | ${links.join(' · ')} |\n`;
  }

  let footer = '';
  if (chess.isGameOver()) {
    const reason = chess.isCheckmate() ? 'checkmate'
                 : chess.isStalemate() ? 'stalemate'
                 : chess.isDraw()      ? 'draw'
                 : 'game over';
    footer = `\n_${reason}. the next move resets the board._\n`;
  }

  return `## play chess against me

![chess board](https://raw.githubusercontent.com/${REPO}/main/chess/board.svg?cachebust=${Date.now()})

**${turn}** to move. Click any link below to play that move — opens a pre-filled GitHub issue, the bot replies automatically.

${table}${footer}`;
}

function main() {
  const block = buildChessBlock();
  const readme = fs.readFileSync(README_PATH, 'utf8');

  if (!readme.includes(START_MARKER) || !readme.includes(END_MARKER)) {
    console.error('chess markers missing from README.md');
    process.exit(1);
  }

  const before = readme.split(START_MARKER)[0];
  const after = readme.split(END_MARKER)[1];
  const next = `${before}${START_MARKER}\n\n${block}\n\n${END_MARKER}${after}`;
  fs.writeFileSync(README_PATH, next);
  const moveCount = (block.match(/issues\/new/g) || []).length;
  console.log(`readme updated. moves available: ${moveCount}`);
}

main();
