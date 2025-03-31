importScripts('stockfish.js');

self.onmessage = function (e) {
  stockfish.postMessage(e.data);
};

stockfish.onmessage = function (e) {
  self.postMessage(e.data);
};
