class Block {

  constructor(shape, color, size) {
    this.size_ = size;
    this.shape_ = new2DArray(this.size_, this.size_, false);
    for (let i = 0; i < shape.length; ++i) {
      for (let j = 0; j < shape[i].length; ++j) {
        this.shape_[i][j] = shape[i].charAt(j) === 'O';
      }
    }
    this.color_ = color;
  }

  getShape() {
    return this.shape_;
  }

  getColor() {
    return this.color_;
  }

  getSize() {
    return this.size_;
  }
}

class RotatableBlock {

  constructor(block) {
    this.block_ = block;
    this.shape_ = new2DArray(block.getSize(), block.getSize(), false);
    forEach2DArray(
      block.getShape(), (value, x, y) => this.shape_[y][x] = value);
  }

  rotate() {
    const size = this.block_.getSize();
    const rotatedShape = new2DArray(size, size, false);
    forEach2DArray(
      this.shape_, (value, x, y) => rotatedShape[x][size - y - 1] = value);
    this.shape_ = rotatedShape;
  }

  reverseRotate() {
    const size = this.block_.getSize();
    const rotatedShape = new2DArray(size, size, false);
    forEach2DArray(
      this.shape_,
      (value, x, y) => rotatedShape[size - x - 1][y] = value);
    this.shape_ = rotatedShape;
  }

  getShape() {
    return this.shape_;
  }

  getColor() {
    return this.block_.getColor();
  }

  getSize() {
    return this.block_.getSize();
  }
}

class Tetris {

  constructor() {
    this.blocks_ =
      BLOCKS.map((block) => new Block(block.shape, block.color, block.size));
      this.canvas_ = null;
      this.scoreCallback_ = null;
      this.messageCallback_ = null;
      this.initializeValues_()
  }

  start() {
    if (this.timerKey_) {
      return;
    }
    this.printMessage_('Start the game.');
    this.started_ = true;
    this.timerKey_ = setInterval(() => this.tick_(), this.speed_);
    this.switchToNextBlock_();
    this.render_();
  }

  stop() {
    if (this.timerKey_) {
      clearInterval(this.timerKey_);
      this.timerKey_ = null;
    }
    this.printMessage_('Stop the game.');
    this.started_ = false;
  }

  reset() {
    this.stop();
    this.initializeValues_();
    this.render_();
    this.updateScore_();
  }

  streamGameTo(canvas) {
    this.canvas_ = canvas;
    this.drawBorder_();
    this.render_();
  }

  setScoreCallback(callback) {
    this.scoreCallback_ = callback;
    callback(this.score_);
  }

  setMessageCallback(callback) {
    this.messageCallback_ = callback;
  }

  up() {
    if (!this.started_) {
      return;
    }
    this.currentBlock_.rotate();
    if (this.canMove_(0, 0)) {
      this.render_();
      return;
    }
    //In order to make the I shape block rotatable from the beginning.
    if (this.blockY_ < 0 && this.canMove_(0, -this.blockY_)) {
      this.blockY_ = 0;
      this.render_();
      return;
    }
    this.currentBlock_.reverseRotate()
  }

  downAll() {
    if (!this.started_) {
      return;
    }
    this.restartTimer_();
    while (this.canMove_(0, 1)) {
      ++this.blockY_;
    }
    this.nextRound_();
    this.render_();
  }

  down() {
    this.tryMove_(0, 1);
  }

  left() {
    this.tryMove_(-1, 0);
  }

  right() {
    this.tryMove_(1, 0);
  }

  tryMove_(deltaX, deltaY) {
    if (!this.started_) {
      return;
    }
    if (!this.canMove_(deltaX, deltaY)) {
      return;
    }
    this.blockX_ += deltaX;
    this.blockY_ += deltaY;
    this.render_();
  }

  render_() {
    if (!this.canvas_) {
      return;
    }

    forEach2DArray(
      this.board_, (color, x, y) => this.drawBoardPixel_(x, y, color || ''));

    if (this.currentBlock_) {
      forEach2DArray(
        this.currentBlock_.getShape(),
        (value, x, y) => {
          const relativeX = x + this.blockX_;
          const relativeY = y + this.blockY_;
          if (!value || !isValidCoordinate(this.board_, relativeX, relativeY)) {
            return;
          }
          this.drawBoardPixel_(
            relativeX, relativeY, this.currentBlock_.getColor());
        });
    }

    if (this.nextBlock_) {
      const left = BOARD_WIDTH + 3;
      const top = 5;
      for (let y = 0; y < 4; ++y) {
        for (let x = 0; x < 4; ++x) {
          this.canvas_.setColor(x + left, y + top, '');
        }
      }
      forEach2DArray(
        this.nextBlock_.getShape(),
        (value, x, y) => {
          const relativeX = x + left;
          const relativeY = y + top;
          if (value) {
            this.canvas_.setColor(relativeX, relativeY, this.nextBlock_.getColor());
          }
        }
      )
    }
  }

  drawBoardPixel_(x, y, color) {
    this.canvas_.setColor(x + 1, y, color);
  }

  drawBorder_() {
    const borderColor = 'black';
    for (let y = 0; y < BOARD_HEIGHT; ++y) {
      this.canvas_.setColor(0, y, borderColor);
      this.canvas_.setColor(BOARD_WIDTH + 1, y, borderColor);
    }
    for (let x = 0; x < BOARD_WIDTH + 2; ++x) {
      this.canvas_.setColor(x, BOARD_HEIGHT, borderColor);
    }
  }

  printMessage_(message) {
    if (this.messageCallback_) {
      this.messageCallback_(message);
    }
  }

  restartTimer_() {
    if (this.timerKey_) {
      clearInterval(this.timerKey_);
    }
    this.timerKey_ = setInterval(() => this.tick_(), this.speed_);
  }

  tick_() {
    if (this.canMove_(0, 1)) {
      ++this.blockY_;
    } else {
      this.nextRound_()
    }
    this.render_();
  }

  canMove_(deltaX, deltaY) {
    return this.currentBlock_.getShape().every((line, y) => {
      return line.every((value, x) => {
        const relativeX = x + this.blockX_ + deltaX;
        const relativeY = y + this.blockY_ + deltaY;
        return !value || (isValidCoordinate(this.board_, relativeX, relativeY)
          && this.board_[relativeY][relativeX] === null);
      });
    });
  }

  nextRound_() {
    this.mergeBlock_();
    this.switchToNextBlock_();
    this.removeFullLines_();
    if (!this.canMove_(0, 0)) {
      this.printMessage_('Game over.');
      this.stop();
    }
    if (--this.remainingRoundsToNextSpeed_ <= 0) {
      this.remainingRoundsToNextSpeed_ = this.roundsToNextSpeed_;
      if (this.speed_ > 200) {
        this.speed_ -= 100;
        this.restartTimer_();
        this.printMessage_(`Your current speed is ${this.speed_}ms.`);
      }
    }
  }

  mergeBlock_() {
    if (!this.currentBlock_) {
      return;
    }
    this.increaseScore_(10);
    forEach2DArray(
      this.currentBlock_.getShape(),
      (value, x, y) => {
        const relativeX = x + this.blockX_;
        const relativeY = y + this.blockY_;
        if (!value || !isValidCoordinate(this.board_, relativeX, relativeY)) {
          return;
        }
        this.board_[relativeY][relativeX] = this.currentBlock_.getColor();
      });
  }

  switchToNextBlock_() {
    this.currentBlock_ = this.nextBlock_ || this.newRandomBlock_();
    this.nextBlock_ = this.newRandomBlock_();
    this.blockX_ = Math.floor((BOARD_WIDTH - this.currentBlock_.getSize()) / 2);

    let emptyLines = 0;
    const nextShape = this.currentBlock_.getShape();
    for (let y = 0; y < nextShape.length; ++y) {
      const line = nextShape[y];
      if (line.some((value) => value)) {
        break;
      }
      ++emptyLines;
    }
    this.blockY_ = -emptyLines;
  }

  newRandomBlock_() {
    return new RotatableBlock(this.blocks_[getRandomInt(this.blocks_.length)]);
  }

  increaseScore_(deltaScore) {
    this.score_ += deltaScore;
    this.updateScore_();
  }

  updateScore_() {
    this.scoreCallback_(this.score_);
  }

  removeFullLines_() {
    const removedBoard = new2DArray(BOARD_WIDTH, BOARD_HEIGHT, null);
    let removedLines = 0;
    for (let y = this.board_.length - 1; y >= 0; --y) {
      const line = this.board_[y];
      if (line.every((color) => color !== null)) {
        ++removedLines;
        continue;
      }
      for (let x = 0; x < line.length; ++x) {
        removedBoard[y + removedLines][x] = this.board_[y][x];
      }
    }
    this.increaseScore_(removedLines * removedLines * 100);
    this.board_ = removedBoard;
    if (removedLines > 0) {
      this.printMessage_(`Removed ${removedLines} line(s)`);
    }
  }

  initializeValues_() {
    this.board_ = new2DArray(BOARD_WIDTH, BOARD_HEIGHT, null);
    this.speed_ = 1000;
    this.timerKey_ = null;
    this.currentBlock_ = null;
    this.nextBlock_ = null;
    this.blockX_ = 0;
    this.blockY_ = 0;
    this.roundsToNextSpeed_ = 20;
    this.remainingRoundsToNextSpeed_ = this.roundsToNextSpeed_;
    this.score_ = 0;
    this.started_ = false;
  }
}

