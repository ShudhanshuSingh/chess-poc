import React, { useEffect, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

const App = () => {
  const [game, setGame] = useState(new Chess());
  const stockfishRef = useRef(null);
  let depth = 0
  
  useEffect(() => {
    stockfishRef.current = new Worker('/stockfishWorker.js');
    const cores = navigator.hardwareConcurrency || 4;
    const threads = Math.min(cores, 8);
  
    stockfishRef.current.onmessage = (event) => {
      const message = event.data;
      console.log('[Stockfish]', message);
        // 🎯 Track depth from info lines
  if (typeof message === 'string' && message.startsWith('info depth')) {
    const parts = message.split(' ');
    const depthIndex = parts.indexOf('depth');
    if (depthIndex !== -1 && !isNaN(parts[depthIndex + 1])) {
      depth = parts[depthIndex + 1];
    }
  }
      if (typeof message === 'string' && message.startsWith('bestmove')) {
        alert(`♟️ Best move: ${message.split(' ')[1]} with depth: ${depth}`);
        depth = 0;
      }
    };
  
    stockfishRef.current.postMessage('uci');
    // 🚀 Speed booster settings
stockfishRef.current.postMessage(`setoption name Threads value ${threads}`);    // Use 4 CPU threads
stockfishRef.current.postMessage('setoption name Hash value 1024');     // Use 256MB RAM
stockfishRef.current.postMessage('setoption name MultiPV value 1');
stockfishRef.current.postMessage('setoption name Ponder value false');
// stockfishRef.current.postMessage('setoption name UCI_LimitStrength value false'); // Max strength
// stockfishRef.current.postMessage('setoption name UCI_Elo value 2850'); // Unleash full rating
    return () => {
      stockfishRef.current.terminate();
    };
  }, []);

  const onDrop = (source, target) => {
    const move = {
      from: source,
      to: target,
      promotion: 'q',
    };

    const gameCopy = new Chess(game.fen());
    const result = gameCopy.move(move);

    if (result) {
      setGame(gameCopy);
      const fen = gameCopy.fen();
      stockfishRef.current.postMessage('isready');
      stockfishRef.current.postMessage(`position fen ${fen}`);
      stockfishRef.current.postMessage('go movetime 5000');
      return true;
    }

    return false;
  };

  return (
    <div>
      <h1>React Chess with Stockfish</h1>
      <Chessboard position={game.fen()} onPieceDrop={onDrop} boardWidth={500}/>
    </div>
  );
};

export default App;
