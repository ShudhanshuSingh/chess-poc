importScripts('/stockfish.wasm.js');

const engine = typeof Stockfish === 'function' ? Stockfish() : stockfish;

onmessage = function (e) {
  engine.postMessage(e.data);
};

engine.onmessage = function (e) {
  postMessage(e.data);
};
