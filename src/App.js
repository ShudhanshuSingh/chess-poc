import React, { useEffect, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

export default function App() {
  const [game, setGame] = useState(new Chess());
  const stockfishRef = useRef(null);

  useEffect(() => {
    // Create Web Worker directly from CDN
    stockfishRef.current = new Worker(
      'https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js'
    );

    stockfishRef.current.onmessage = (event) => {
      const message = event.data;
      console.log('[Stockfish]', message);
      if (typeof message === 'string' && message.startsWith('bestmove')) {
        const move = message.split(' ')[1];
        alert(`♟️ Best move: ${move}`);
      }
    };

    // Initialize the engine
    stockfishRef.current.postMessage('uci');

    return () => stockfishRef.current.terminate();
  }, []);

  const onDrop = (sourceSquare, targetSquare) => {
    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    };

    const gameCopy = new Chess(game.fen());
    const result = gameCopy.move(move);

    if (result) {
      setGame(gameCopy);
      const fen = gameCopy.fen();
      stockfishRef.current.postMessage(`position fen ${fen}`);
      stockfishRef.current.postMessage('go depth 30');
      return true;
    }

    return false;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 50 }}>
      <h2>♜ React + Stockfish (CDN Worker)</h2>
      <Chessboard position={game.fen()} onPieceDrop={onDrop} />
    </div>
  );
}
