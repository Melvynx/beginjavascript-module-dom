class Game {
  static COLORS = ['#ff4500', '#00cc78', '#2450a5', '#fed734', '#f9fafc'];
  static BOARD_SIZE = [25, 25];
  static PIXEL_SIZE = 20;
  static TIME_TO_WAIT = 5000;

  constructor() {
    // 🦁 Initialise un `ColorPicker`
  }

  init() {
    // 🦁 Récupère le board
    // 💡 Définit le style suivant pour que ce soit beau
    // ⚡️ this.board.style.gridTemplateColumns = `repeat(${Game.BOARD_SIZE[0]}, ${Game.PIXEL_SIZE}px)`;
    // 🦁 Appelle la méthode this.initPixels()
    // 🦁 Appelle la méthode this.colorPicker.initPixelPicker()
  }

  // 🦁 Crée une méthode `initPixels`
  // * Cette méthode doit, pour chaque pixel du board, créer un pixel et l'ajouter au board
}

class Pixel {
  static PIXEL_CLASS = 'pixel';
  static PIXEL_PICKER_CLASS = 'pixel-picker';

  constructor(color) {
    // 🦁 Stocke la couleur dans _color
    // 🦁 Crée un élément div qui sera stocké dans this.element
    // * Définit la couleur du background de l'élément en `color`
    // * Ajoute la classe `Pixel.PIXEL_CLASS` à l'élément
  }
}

class ColorPicker {
  constructor(colors, currentColor) {
    // 🦁 Stocke colors et currentColor
    // 🦁 Initie un tableau de pixels
  }

  // 🦁 Crée une méthode `init`
  // * Cette méthode va récupérer l'élément avec l'id `color-picker`
  // * Pour chaque couleur, elle va créer un pixel et l'ajouter à l'élément récupéré
  // * Pour chaque pixel, ajoute la classe `Pixel.PIXEL_PICKER_CLASS`
  // * Si la couleur du pixel est égale à `currentColor`, ajoute la classe `active`
  // * Ajoute le pixel à l'élément avec this.element.append
  // * Stocke le pixel dans le tableau de pixels
}

const game = new Game();
game.init();
