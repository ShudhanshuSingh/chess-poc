import React, { useEffect, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

function App() {
  const [game, setGame] = useState(new Chess());
  const stockfishWorker = useRef(null);

  useEffect(() => {
    stockfishWorker.current = new Worker('/stockfishWorker.js');

    stockfishWorker.current.onmessage = (event) => {
      const message = event.data;
      if (message.startsWith('bestmove')) {
        const move = message.split(' ')[1];
        alert(`Best Move: ${move}`);
      }
    };

    return () => {
      stockfishWorker.current.terminate();
    };
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
      stockfishWorker.current.postMessage(`position fen ${fen}`);
      stockfishWorker.current.postMessage('go depth 30');
      return true;
    }

    return false;
  };

  return (
    <div className="app">
      <h1>React + Stockfish</h1>
      <Chessboard position={game.fen()} onPieceDrop={onDrop} />
    </div>
  );
}

export default App;
