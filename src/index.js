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
    // 🦁 Appels la méthode this.initPixels()
    // 🦁 Appels la méthode this.colorPicker.initPixelPicker()
  }

  // 🦁 Créer une méthode `initPixels`
  // * Cette méthode doit, pour chaque pixel du board, créer un pixel et l'ajouter au board
}

class Pixel {
  static PIXEL_CLASS = 'pixel';
  static PIXEL_PICKER_CLASS = 'pixel-picker';

  constructor(color) {
    // 🦁 Stock la couleur dans _color
    // 🦁 Créer un élément div qui sera stocké dans this.element
    // * Définit la couleur du background de l'élément en `color`
    // * Ajoute la classe `Pixel.PIXEL_CLASS` à l'élément
  }
}

class ColorPicker {
  constructor(colors, currentColor) {
    // 🦁 Stock colors et currentColor
    // 🦁 Initie un tableau de pixels
  }

  // 🦁 Créer une méthode `init`
  // * Cette méthode va récupérer l'élément avec l'id `color-picker`
  // * Pour chaque couleur, elle va créer un pixel et l'ajouté à l'élément récupéré
  // * Pour chaque pixel, ajoute la class `Pixel.PIXEL_PICKER_CLASS`
  // * Si la couleur du pixel est égal à `currentColor`, ajoute la class `active`
  // * Ajoute le pixel à element avec this.element.append
  // * Stock le pixel dans le tableau de pixels
}

const game = new Game();
game.init();
