const colors = ['#ff4500', '#00cc78', '#2450a5', '#fed734', '#f9fafc'];

const BOARD_SIZE = [25, 25];
const PIXEL_SIZE = 20;
const pixels = [];
const TIME_TO_WAIT = 5000;
let currentColor = colors[0];
let lastClick = null;

const onPixelClick = (e) => {
  if (lastClick && new Date() - lastClick < TIME_TO_WAIT) {
    showWarning();
    return;
  }

  const current = e.target;
  current.style.background = currentColor;
  toggleTime();
};

let interval = null;
const showWarning = () => {
  const warning = document.querySelector('#warning');
  if (!warning) return;

  warning.classList.remove('hidden');

  clearInterval(interval);
  interval = setTimeout(() => {
    warning.classList.add('hidden');
  }, 4000);
};

const toggleTime = () => {
  lastClick = new Date();
  const timerWrapper = document.querySelector('#time-left');

  if (!timerWrapper) return;

  const timer = document.createElement('div');
  timer.classList.add('timer');
  timer.innerText = '5s';

  timerWrapper.append(timer);

  const interval = setInterval(() => {
    const now = new Date();
    const diff = now - lastClick;
    const seconds = Math.floor(diff / 1000);
    timer.innerText = `${5 - seconds}s`;

    if (seconds >= TIME_TO_WAIT / 1000) {
      clearInterval(interval);
      timer.remove();
    }
  }, 1000);
};

const generateBoard = () => {
  const board = document.querySelector('#board');
  // add grid styles to board
  if (!board) return;
  board.style.gridTemplateColumns = `repeat(${BOARD_SIZE[0]}, ${PIXEL_SIZE}px)`;
  board.style.gridTemplateRows = `repeat(${BOARD_SIZE[1]}, ${PIXEL_SIZE}px)`;

  for (let i = 0; i < BOARD_SIZE[0] * BOARD_SIZE[1]; i++) {
    const pixel = document.createElement('div');
    pixel.classList.add('pixel');
    pixel.style.background = colors[colors.length - 1];
    // pixel.style.background = colors[Math.floor(Math.random() * colors.length)];

    pixel.addEventListener('click', onPixelClick);
    board.append(pixel);
    pixels.push(pixel);
  }
};

const onColorOptionClick = (e) => {
  const element = e.target;
  const parent = element.parentElement;

  // get all element and remove class active
  for (let children of parent.children) {
    children.classList.remove('active');
  }

  element.classList.add('active');
  currentColor = element.style.background;
};

const setupColorPicker = () => {
  const colorPicker = document.querySelector('#color-picker');
  console.log({ colorPicker });
  if (!colorPicker) return;

  for (const color of colors) {
    const colorOption = document.createElement('div');
    colorOption.classList.add('pixel', 'pixel-picker');
    if (color === currentColor) {
      colorOption.classList.add('active');
    }
    colorOption.style.background = color;
    colorOption.addEventListener('click', onColorOptionClick);
    colorPicker.append(colorOption);
  }
};

setupColorPicker();
generateBoard();
