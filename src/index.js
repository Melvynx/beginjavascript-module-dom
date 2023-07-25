class Game {
  static COLORS = ['#ff4500', '#00cc78', '#2450a5', '#fed734', '#f9fafc'];
  static BOARD_SIZE = [25, 25];
  static PIXEL_SIZE = 20;
  static TIME_TO_WAIT = 5000;

  lastPixelAddedDate = null;

  constructor() {
    this.warning = new Warning();
    this.colorPicker = new ColorPicker(Game.COLORS, Game.COLORS[0]);
  }

  init() {
    this.board = document.querySelector('#board');
    this.board.style.gridTemplateColumns = `repeat(${Game.BOARD_SIZE[0]}, ${Game.PIXEL_SIZE}px)`;
    this.initPixel();
    this.colorPicker.initPixelPicker();
  }

  initPixel() {
    for (let i = 0; i < Game.BOARD_SIZE[0] * Game.BOARD_SIZE[1]; i++) {
      const pixel = new Pixel(Game.COLORS[Game.COLORS.length - 1]);
      pixel.element.addEventListener('click', (e) => this.onPixelClick(pixel));
      this.board.append(pixel.element);
    }
  }

  onPixelClick(pixel) {
    if (
      this.lastPixelAddedDate &&
      new Date() - this.lastPixelAddedDate < Game.TIME_TO_WAIT
    ) {
      this.warning.showWarning();
      return;
    }

    pixel.color = this.colorPicker.currentColor;
    this.lastPixelAddedDate = new Date();

    this.colorPicker.toggleTimeLeft(this.lastPixelAddedDate);
  }
}

class Warning {
  constructor() {
    this.element = document.querySelector('#warning');
    this.interval = null;
  }

  showWarning() {
    this.element.classList.remove('hidden');

    clearInterval(this.interval);
    this.interval = setTimeout(() => {
      this.element.classList.add('hidden');
    }, 4000);
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
    this.element = document.querySelector('#color-picker');
    this.timeLeft = document.querySelector('#time-left');
    this.pixels = [];
    this.interval = null;
  }

  initPixelPicker() {
    for (const color of this.colors) {
      const pixel = new Pixel(color);
      this.pixels.push(pixel);
      pixel.element.classList.add(Pixel.PIXEL_PICKER_CLASS);

      if (color === this.currentColor) {
        pixel.element.classList.add('active');
      }

      pixel.element.addEventListener('click', () => {
        this.currentColor = color;
        this.updateActiveColor();
      });

      this.element.append(pixel.element);
    }
  }

  startCountdown(dateOfPixelClick) {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      const now = new Date();
      const diff = now - dateOfPixelClick;
      const seconds = Math.floor(diff / 1000);
      this.timeLeft.innerText = `${5 - seconds}s`;

      if (seconds >= Game.TIME_TO_WAIT / 1000) {
        clearInterval(this.interval);
        this.timeLeft.innerText = '';
      }
    }, 1000);
  }

  toggleTimeLeft(dateOfPixelClick) {
    const timerWrapper = document.querySelector('#time-left');

    timerWrapper.innerText = '5s';

    this.startCountdown(dateOfPixelClick);
  }

  updateActiveColor() {
    for (const pixel of this.pixels) {
      if (pixel.color === this.currentColor) {
        pixel.element.classList.add('active');
      } else {
        pixel.element.classList.remove('active');
      }
    }
  }
}

const game = new Game();
game.init();
