// Reference: https://en.wikipedia.org/wiki/Tetris
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const BLOCKS = [
  {
    shape: [
      '    ',
      'OOOO',
      '    ',
      '    ',
    ],
    color: '#FF4136',
    size: 4,
  },
  {
    shape: [
      'OOO',
      '  O',
      '   ',
    ],
    color: '#85144b',
    size: 3,
  },
  {
    shape: [
      'OOO',
      'O  ',
      '   ',
    ],
    color: '#FFDC00',
    size: 3,
  },
  {
    shape: [
      'OO',
      'OO',
    ],
    color: '#7FDBFF',
    size: 2,
  },
  {
    shape: [
      ' OO',
      'OO ',
      '   ',
    ],
    color: '#0074D9',
    size: 3,
  },
  {
    shape: [
      'OOO',
      ' O ',
      '   ',
    ],
    color: '#AAAAAA',
    size: 3,
  },
  {
    shape: [
      'OO ',
      ' OO',
      '   ',
    ],
    color: '#2ECC40',
    size: 3,
  },
];
