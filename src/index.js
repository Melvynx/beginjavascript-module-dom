import { io } from 'socket.io-client';

class Game {
  static COLORS = [
    '#ff4500',
    '#00cc78',
    '#2450a5',
    '#821f9f',
    '#fed734',
    '#f9fafc',
    '#000000',
  ];
  static BOARD_SIZE = [25, 25];
  static PIXEL_SIZE = 20;
  static TIME_TO_WAIT = 5000;

  lastPixelAddedDate = null;

  constructor() {
    this.warning = new Warning();
    this.colorPicker = new ColorPicker(Game.COLORS, Game.COLORS[0]);
    this.interval = null;
  }

  init() {
    this.board = document.querySelector('#board');
    this.timeLeft = document.querySelector('#time-left');
    this.board.style.gridTemplateColumns = `repeat(${Game.BOARD_SIZE[0]}, ${Game.PIXEL_SIZE}px)`;
    this.colorPicker.init();
    this.warning.init();
    this.pixels = [];

    this.socket = io('https://beginjavascript-module-dom-production.up.railway.app');
    this.socket.on('init', (initialBoardState) =>
      this.initializeBoard(initialBoardState)
    );
    this.socket.on('pixel change', (data) => this.updatePixel(data));
  }

  updatePixel(data) {
    this.pixels[data.pixelIndex].color = data.color;
  }

  initializeBoard(values) {
    for (let i = 0; i < values.length; i++) {
      const currentValue = values[i];
      const pixel = new Pixel(currentValue, i);
      this.pixels.push(pixel);
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

    this.toggleTimeLeft(this.lastPixelAddedDate);

    this.socket.emit('pixel change', {
      pixelIndex: pixel.index,
      color: this.colorPicker.currentColor,
      userAgent: navigator.userAgent,
    });
  }

  startCountdown() {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      const now = new Date();
      const diff = now - this.lastPixelAddedDate;
      const seconds = Math.floor(diff / 1000);
      this.timeLeft.innerText = `${5 - seconds}s`;

      if (seconds >= Game.TIME_TO_WAIT / 1000) {
        clearInterval(this.interval);
        this.timeLeft.innerText = '';
      }
    }, 1000);
  }

  toggleTimeLeft() {
    this.timeLeft.innerText = '5s';
    this.startCountdown();
  }
}

class Warning {
  constructor() {
    this.interval = null;
  }

  init() {
    this.element = document.querySelector('#warning');
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

  constructor(color, index) {
    this.index = index;
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
    this.interval = null;
  }

  init() {
    this.element = document.querySelector('#color-picker');
    this.timeLeft = document.querySelector('#time-left');

    for (const color of this.colors) {
      const pixel = new Pixel(color);
      this.pixels.push(pixel);
      pixel.element.classList.add(Pixel.PIXEL_PICKER_CLASS);

      if (color === this.currentColor) {
        pixel.element.classList.add('active');
      }

      pixel.element.addEventListener('click', () => {
        this.onColocPickerClick(color);
      });

      this.element.append(pixel.element);
    }
  }

  onColocPickerClick(color) {
    this.currentColor = color;
    this.updateActiveColor();
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
