import { io } from 'socket.io-client';

const wsUrl = 'https://beginjavascript-module-dom-production.up.railway.app';
//  const wsUrl = 'http://localhost:3044';

const socket = io(wsUrl);

class Game {
  static COLORS = [
    '#ff4500',
    '#00cc78',
    '#2450a5',
    '#821f9f',
    '#fed734',
    '#f9fafc',
    '#000000'
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

  async init() {
    this.board = document.querySelector('#board');
    this.timeLeft = document.querySelector('#time-left');
    this.board.style.gridTemplateColumns = `repeat(${Game.BOARD_SIZE[0]}, ${Game.PIXEL_SIZE}px)`;
    this.colorPicker.init();
    this.warning.init();
    this.pixels = [];

    this.username = "loading";

    const usernameElement = document.querySelector('#username');

    const username = await fetch('https://randomuser.me/api/')
      .then((res) => res.json())
      .then((data) => data.results[0].login.username)
      .catch(() => 'user' + Math.floor(Math.random() * 1000));

    const localUsername = localStorage.getItem('username');
    console.log({ localUsername });
    if (!localUsername) {
      this.username = username;
      localStorage.setItem('username', this.username);
    } this.username = localStorage.getItem('username');

    usernameElement.innerText = this.username;
    
    this.pixelsCount = []
    this.updateCounts();

    this.socket = socket;
    
    this.socket.on('init', (initialBoardState) =>
      this.initializeBoard(initialBoardState)
    );
    
    this.socket.on('pixel change', (data) => {
      if (data.pixelIndex === this.pixelBeforeEdition?.pixelIndex) this.pixelBeforeEdition = null;
      this.updatePixel(data)
    });
    
    this.socket.on('pong', (data) => {
      this.lastPixelAddedDate = new Date(data.date);
      this.toggleTimeLeft(this.lastPixelAddedDate)
      
      if (!data.success) {
        this.updatePixel(this.pixelBeforeEdition);
        this.pixelBeforeEdition = null
        alert(data.message)
      }
    });
    
    this.socket.on('connected', (data) => {
      const connectedUsers = document.querySelector('#count');
      connectedUsers.innerText = Number(data.live);
    });

    this.socket.on('disconnected', (data) => {
      const connectedUsers = document.querySelector('#count');
      connectedUsers.innerText = Number(connectedUsers.innerText) - 1;
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        const currentColorIndex = Game.COLORS.indexOf(this.colorPicker.currentColor);
        const nextColorIndex = currentColorIndex + 1 >= Game.COLORS.length ? 0 : currentColorIndex + 1;
        this.colorPicker.currentColor = Game.COLORS[nextColorIndex];
        this.colorPicker.updateActiveColor();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        const currentColorIndex = Game.COLORS.indexOf(this.colorPicker.currentColor);
        const nextColorIndex = currentColorIndex - 1 < 0 ? Game.COLORS.length - 1 : currentColorIndex - 1;
        this.colorPicker.currentColor = Game.COLORS[nextColorIndex];
        this.colorPicker.updateActiveColor();
      }
    });
  }

  updatePixel(data) {
    this.pixels[data.pixelIndex].color = data.color;
    this.pixelsCount[data.color]++;
    this.updateCounts();
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
      pixel.element.addEventListener('mouseover', (e) => {
        const position = document.querySelector('#position');
        const x = i % Game.BOARD_SIZE[0];
        const y = Math.floor(i / Game.BOARD_SIZE[0]);
        position.innerText = `x: ${x}, y: ${y}`;
      });

      pixel.element.addEventListener('mouseleave', (e) => {
        const position = document.querySelector('#position');
        position.innerText = 'x: 0, y: 0';
      });

      this.board.append(pixel.element);
    }
  }

  updateCounts() {
    for (const color of Game.COLORS) {
      const count = this.pixels.filter((pixel) => pixel.color === color).length;
      this.pixelsCount[color] = count;

      const countElement = document.querySelector(`#color-${color.replace('#', '')}`);
      countElement.innerText = count;
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
        this.timeLeft.classList.add('hidden');
      }
    }, 1000);
  }

  toggleTimeLeft() {
    this.timeLeft.classList.remove('hidden');
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
  constructor() {
    this._unreadMessage = 0;
  }

  get unreadMessage() {
    return this._unreadMessage;
  }

  set unreadMessage(newUnreadMessage) {
    this._unreadMessage = newUnreadMessage > 9 ? "9+" : newUnreadMessage;

    if (this._unreadMessage === 0) {
      this.unreadMessageElement.classList.add('hidden');
    } else {
      this.unreadMessageElement.classList.remove('hidden');
      this.unreadMessageElement.innerText = this._unreadMessage;
    }
  }

  get open() {
    // check if message element has class hidden
    return !this.element.classList.contains('hidden');
  }

  set open(newOpen) {
    // if newOpen is true, remove class hidden from message element
    if (newOpen) this.element.classList.remove('hidden');
    else this.element.classList.add('hidden');
  }

  init() {
    this.element = document.querySelector('#message');
    this.messageList = document.querySelector('#messages-list');
    this.unreadMessageElement = document.querySelector('#unread-message-count');
    this.socket = socket;

    this.socket.on('message', (data) => {
      this.addMessage(data.message);

      const audio = new Audio('/sounds/message.mp3');
      audio.play();
    });

    this.submitButton = document.querySelector('#submit-message');
    this.input = document.querySelector('#message-input');
    this.username = document.querySelector('#username');

    const checkIfCommand = (message) => {
      if (message.startsWith('/username')) {
        const newUsername = message.split(' ')[1].substring(0, 16);
        if (newUsername) {
          this.username.innerText = newUsername;

          localStorage.setItem('username', newUsername);
          this.sendMessage(`${game.username} was renamed to ${newUsername}`);
        }
      }
    };

    this.submitButton.addEventListener('click', () => {
      if (this.input.value.length === 0) return;
      if (this.input.value.startsWith('/username')) return checkIfCommand(this.input.value);
      const message = game.username + ': ' + this.input.value;
      this.sendMessage(message, this._identifier);
      this.input.value = '';
    });

    this.input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        if (this.input.value.startsWith('/username')) return checkIfCommand(this.input.value);
        if (this.input.value.length === 0) return;
        const message = game.username + ': ' + this.input.value;
        this.sendMessage(message, this._identifier);
        this.input.value = '';
      }
    });

    this.openMessageButton = document.querySelector('#toggle-message-btn');

    this.openMessageButton.addEventListener('click', () => {
      this.open = !this.open;
      if (this.open) {
        this.unreadMessage = 0;
      }
    });
  }

  sendMessage(message) {
    this.socket.emit('message', {
      message
    });
  }

  addMessage(message) {
    console.log('this', this);
    console.log('Add message');
    const messageElement = document.createElement('li');

    // if message include a link, add target blank to open link in new tab
    if (message.includes('http')) {
      messageElement.innerHTML = message.replace(
        /http(s)?:\/\/(.*?)\s/g,
        (match) => `<a href="${match}" target="_blank">${match}</a> `
      );
    }

    // if include an gif, add img tag
    if (message.includes('.gif')) {
      messageElement.innerHTML = message.replace(
        /(.*?)\.(gif)/g,
        (match) => `<img src="${match}" />`
      );
    }

    messageElement.innerText = message;
    const firstChild = this.element.firstChild;
    console.log({ firstChild });
    // this.element.firstChild.append(messageElement);
    this.messageList.append(messageElement);

    if (!this.open) {
      this.unreadMessage++;
    }

    // scroll to bottom of message list when new message is added
    setTimeout(() => {
      this.messageList.scrollTop = this.messageList.scrollHeight;
    }, 5);
  }
}

const game = new Game();
game.init();

const message = new Message();
message.init();
