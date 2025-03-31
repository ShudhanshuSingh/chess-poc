importScripts('https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.wasm.js');

// Detect if Stockfish is a function (i.e., Stockfish() returns the engine)
// OR just a preloaded Worker object
const engine = typeof Stockfish === 'function' ? Stockfish() : (typeof stockfish !== 'undefined' ? stockfish : null);

if (!engine) {
  throw new Error("Stockfish engine could not be initialized.");
}

onmessage = function (e) {
  engine.postMessage(e.data);
};

engine.onmessage = function (e) {
  postMessage(e.data);
};
