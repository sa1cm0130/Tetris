class Pixel {

  constructor() {
    this.element_=null;
  }

  getElement(){
    if (!this.element_) {
      this.element_=document.createElement('div');
      this.element_.className = 'pixel';
    }
    return this.element_;
  }

  setColor(color) {
    this.getElement().style.backgroundColor = color;
  }

  clear() {
    this.getElement().style.backgroundColor = '';
  }
}

class Line {

  constructor(width) {
    this.width_ = width;
    this.pixels_ = repeat(() => new Pixel(), width);
    this.element_ = null;
  }

  getElement() {
    if (!this.element_) {
      const newElement = document.createElement('div');
      newElement.className = 'pixel-line';
      for (const pixel of this.pixels_) {
        newElement.appendChild(pixel.getElement());
      }
      this.element_ = newElement;
    }
    return this.element_;
  }

  setColor(index, color) {
    if (index < 0 || index >= this.width_) {
      console.error(
        'The given index is out of range. ' +
        `Expected [0, ${this.width_}] but given ${index}.`);
        return;
    }
    this.pixels_[index].setColor(color);
  }

  clear() {
    this.pixels_.forEach((pixel) => pixel.clear());
  }
}

class Canvas {

  constructor(width, height) {
    this.width_ = width;
    this.height_ = height;
    this.lines_ = repeat(() => new Line(width), height);
    this.element_ = null;
  }

  getElement() {
    if (!this.element_) {
      const newElement = document.createElement('div');
      newElement.className = 'canvas';
      for (const line of this.lines_) {
        newElement.appendChild(line.getElement());
      }
      this.element_ = newElement;
    }
    return this.element_;
  }

  setColor(x, y, color) {
    if (x < 0 || x>=this.width_ || y < 0 || y >= this.height_) {
      console.error(`The given coordinate (${x}, ${y} is out of range.`);
      return;
    }
    this.lines_[y].setColor(x, color);
  }

  clear() {
    this.lines_.forEach((line) => line.clear());
  }
}