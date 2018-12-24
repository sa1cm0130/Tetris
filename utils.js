function repeat(value, count) {
  const valueGenerator = (typeof value == 'function') ? value : () => value;
  const array = [];
  for (let i = 0; i < count; ++i) {
    array.push(valueGenerator());
  }
  return array;
}

function new2DArray(columns, rows, initialValue = 0) {
  return repeat(() => repeat(initialValue, columns), rows);
}

function onClick(elementId, callback) {
  document.getElementById(elementId).addEventListener('click', callback);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function forEach2DArray(board, callback) {
  board.forEach((array, y) => {
    array.forEach((value, x) => callback(value, x, y));
  });
}

function isValidCoordinate(board, x, y) {
  return y >= 0 && y < board.length && x >= 0 && x < board[y].length;
}