class Game {
  static COLORS = ['#ff4500', '#00cc78', '#2450a5', '#fed734', '#f9fafc'];
  static BOARD_SIZE = [25, 25];
  static PIXEL_SIZE = 20;
  static TIME_TO_WAIT = 5000;

  constructor() {
    this.colorPicker = new ColorPicker(Game.COLORS, Game.COLORS[0]);
  }

  init() {
    this.board = document.querySelector('#board');
    this.board.style.gridTemplateColumns = `repeat(${Game.BOARD_SIZE[0]}, ${Game.PIXEL_SIZE}px)`;
    this.initPixels();
    this.colorPicker.init();
  }

  initPixels() {
    for (let i = 0; i < Game.BOARD_SIZE[0] * Game.BOARD_SIZE[1]; i++) {
      const pixel = new Pixel(Game.COLORS[Game.COLORS.length - 1]);
      pixel.element.addEventListener('click', () => this.onPixelClick(pixel));
      this.board.append(pixel.element);
    }
  }

  onPixelClick(pixel) {
    pixel.color = this.colorPicker.currentColor;
  }
}

class Pixel {
  static PIXEL_CLASS = 'pixel';
  static PIXEL_PICKER_CLASS = 'pixel-picker';

  constructor(color) {
    this._color = color;
    this.element = document.createElement('div');
    this.element.classList.add(Pixel.PIXEL_CLASS);
    this.element.style.background = color;
  }

  set color(newColor) {
    this._color = newColor;
    this.element.style.background = newColor;
  }

  get color() {
    return this._color;
  }
}

class ColorPicker {
  constructor(colors, currentColor) {
    this.colors = colors;
    this.currentColor = currentColor;
    this.pixels = [];
  }

  init() {
    this.element = document.querySelector('#color-picker');

    for (const color of this.colors) {
      const pixel = new Pixel(color);
      this.pixels.push(pixel);
      pixel.element.classList.add(Pixel.PIXEL_PICKER_CLASS);

      if (color === this.currentColor) {
        pixel.element.classList.add('active');
      }

      pixel.element.addEventListener('click', () => {
        this.onColorPixelClick(pixel);
      });

      this.element.appendChild(pixel.element);
    }
  }

  onColorPixelClick(pixel) {
    this.currentColor = pixel.color;
    this.updateActiveColor();
  }

  updateActiveColor() {
    for (const pixel of this.pixels) {
      pixel.element.classList.toggle('active', pixel.color === this.currentColor);
    }
  }
}

const game = new Game();
game.init();
