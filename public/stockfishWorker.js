// Load Stockfish from CDN
importScripts('https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js');

// Stockfish on CDN is a ready-to-use Worker-compatible object
// No need to call a function like Stockfish()

onmessage = function (e) {
  stockfish.postMessage(e.data);
};

stockfish.onmessage = function (e) {
  postMessage(e.data);
};
