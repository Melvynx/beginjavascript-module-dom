import { io } from 'socket.io-client';

// const wsUrl = 'https://beginjavascript-module-dom-production.up.railway.app';
const wsUrl = 'http://localhost:3044';

const socket = io(wsUrl);

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
  static TIME_TO_WAIT = 3000;

  lastPixelAddedDate = null;
  pixelBeforeEdition = null;

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

    this.socket = socket;
    this.socket.on('init', (initialBoardState) =>
      this.initializeBoard(initialBoardState)
    );
    this.socket.on('pixel change', (data) => this.updatePixel(data));
    this.socket.on('pong', (data) => {
      this.lastPixelAddedDate = new Date(data.date);
      this.toggleTimeLeft(this.lastPixelAddedDate)
      if (!data.success) {
        this.updatePixel(this.pixelBeforeEdition);
        alert(data.message)
      }
    });
  }

  updatePixel(data) {
    this.pixels[data.pixelIndex].color = data.color;
  }

  initializeBoard(values) {
    while (this.board.firstChild) {
      this.board.removeChild(this.board.firstChild);
    }
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

    const pixelData = {
      pixelIndex: pixel.index,
      color: this.colorPicker.currentColor,
    }

    this.pixelBeforeEdition = {
      pixelIndex: pixel.index,
      color: pixel.color,
    };
    this.updatePixel(pixelData)
    this.socket.emit('pixel change', pixelData);
  }

  startCountdown() {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      const now = new Date();
      const diff = now - this.lastPixelAddedDate;
      const seconds = Math.floor(diff / 1000);
      this.timeLeft.innerText = `${Game.TIME_TO_WAIT / 1000 - seconds}s`;

      if (seconds >= Game.TIME_TO_WAIT / 1000) {
        clearInterval(this.interval);
        this.timeLeft.innerText = '';
      }
    }, 1000);
  }

  toggleTimeLeft() {
    this.timeLeft.innerText = `${Game.TIME_TO_WAIT / 1000}s`;
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

class Message {
  constructor() {}

  init() {
    this.element = document.querySelector('#message');
    this.messageList = document.querySelector('#messages-list');
    this.socket = socket;

    this.socket.on('message', (data) => {
      this.addMessage(data.message);
    });

    this.submitButton = document.querySelector('#submit-message');
    this.input = document.querySelector('#message-input');

    this.submitButton.addEventListener('click', () => {
      const message = this.input.value;
      this.sendMessage(message);
      this.input.value = '';
    });
    this.input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        const message = this.input.value;
        this.sendMessage(message);
        this.input.value = '';
      }
    });

    this.openMessageButton = document.querySelector('#open-message-btn');

    this.openMessageButton.addEventListener('click', () => {
      this.element.classList.toggle('hidden');
    });
  }

  sendMessage(message) {
    this.socket.emit('message', {
      message,
    });
    // scroll to bottom of message list when new message is added
    this.messageList.scrollTop = this.messageList.scrollHeight;
  }

  addMessage(message) {
    console.log('this', this);
    console.log('Add message');
    const messageElement = document.createElement('li');
    messageElement.innerText = message;
    const firstChild = this.element.firstChild;
    console.log({ firstChild });
    // this.element.firstChild.append(messageElement);
    this.messageList.append(messageElement);
  }
}

const game = new Game();
game.init();

const message = new Message();
message.init();
