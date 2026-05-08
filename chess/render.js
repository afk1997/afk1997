const fs = require('fs');
const path = require('path');

// Pure-JS SVG chess board renderer.
// Reads chess/state.fen and writes chess/board.svg.
// No native deps — uses Unicode chess glyphs styled inside an SVG.

const PIECE_GLYPH = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟',
};

const SIZE = 480;
const SQUARE = SIZE / 8;
const LIGHT = '#eeeed2';
const DARK = '#769656';
const COORD_COLOR = '#586c41';

function parseFenBoard(fen) {
  const placement = fen.trim().split(/\s+/)[0];
  const ranks = placement.split('/');
  if (ranks.length !== 8) {
    throw new Error(`invalid FEN: expected 8 ranks, got ${ranks.length}`);
  }
  // Build an 8x8 grid: [row][col] where row 0 = rank 8 (top), col 0 = file a (left)
  const board = [];
  for (const rank of ranks) {
    const row = [];
    for (const ch of rank) {
      if (/[1-8]/.test(ch)) {
        for (let i = 0; i < parseInt(ch, 10); i++) row.push(null);
      } else {
        row.push(ch);
      }
    }
    if (row.length !== 8) {
      throw new Error(`invalid FEN rank "${rank}": resolved to ${row.length} files`);
    }
    board.push(row);
  }
  return board;
}

function renderSvg(board) {
  const parts = [];
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" font-family="'DejaVu Sans','Segoe UI Symbol','Noto Sans Symbols',sans-serif">`);

  // Squares + pieces
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const x = col * SQUARE;
      const y = row * SQUARE;
      const isLight = (row + col) % 2 === 0;
      parts.push(`<rect x="${x}" y="${y}" width="${SQUARE}" height="${SQUARE}" fill="${isLight ? LIGHT : DARK}"/>`);
      const piece = board[row][col];
      if (piece) {
        const glyph = PIECE_GLYPH[piece];
        const cx = x + SQUARE / 2;
        const cy = y + SQUARE / 2 + SQUARE * 0.08; // slight visual nudge
        // Heavy text shadow for legibility against either background
        parts.push(
          `<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle" ` +
          `font-size="${SQUARE * 0.78}" fill="${piece === piece.toUpperCase() ? '#ffffff' : '#000000'}" ` +
          `stroke="${piece === piece.toUpperCase() ? '#000000' : '#ffffff'}" stroke-width="1.2">${glyph}</text>`
        );
      }
    }
  }

  // File coordinates (a-h) along the bottom
  for (let col = 0; col < 8; col++) {
    const file = String.fromCharCode('a'.charCodeAt(0) + col);
    const x = col * SQUARE + 4;
    const y = SIZE - 4;
    parts.push(`<text x="${x}" y="${y}" font-size="14" fill="${COORD_COLOR}" font-weight="600">${file}</text>`);
  }
  // Rank coordinates (1-8) along the right side
  for (let row = 0; row < 8; row++) {
    const rank = 8 - row;
    const x = SIZE - 14;
    const y = row * SQUARE + 18;
    parts.push(`<text x="${x}" y="${y}" font-size="14" fill="${COORD_COLOR}" font-weight="600">${rank}</text>`);
  }

  parts.push('</svg>');
  return parts.join('\n');
}

function main() {
  const fenPath = path.join(__dirname, 'state.fen');
  const outPath = path.join(__dirname, 'board.svg');
  const fen = fs.readFileSync(fenPath, 'utf8').trim();
  const board = parseFenBoard(fen);
  const svg = renderSvg(board);
  fs.writeFileSync(outPath, svg);
  console.log('rendered board.svg from FEN:', fen);
}

main();
