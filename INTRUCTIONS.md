# DOM - r/place

Dans ce module, on va pour la première fois interagir avec le DOM. On va s'intéresser principalement au **JavaScript** qui compose notre application.

Dans cette application, on utilise :

- [vitejs](https://vitejs.dev/) - un outil de build pour le développement web
- [tailwindcss](https://tailwindcss.com/) - une librairie CSS pour facilement styliser notre application

Il faut savoir que j'ai **déjà fait le CSS** et j'ai **déjà fait le HTML** pour toi. Ce n'est **pas un cours sur HTML / CSS** mais sur `JavaScript`. Il est important de se le rappeler.

Notre but est de créer un clone _minimaliste_ de `r/place` avec `JavaScript`.

Pour ça, on va utiliser tout ce qu'on a appris depuis le début du cours ainsi que les notions de `DOM` qu'on verra dans la suite du cours.

> ⚠️ Encore une fois, il est normal que tu galères si tu n'as jamais fait de DOM. Passe 15 minutes maximum par exercice et passe au suivant.

## Partie 1 - UI

Dans cette première partie, on va créer les principaux éléments de l'interface utilisateur. Pour ça, on va utiliser la `POO` pour avoir un code plus propre et plus facile à maintenir.

Il y a quelques éléments que j'ai utilisés dans le HTML que tu dois connaître :

- `board` : une div avec l'id board qui représente notre tableau
- `color-picker` : une div avec l'id color-picker qui représente notre palette de couleur
- `time-left` : une div qui contiendra le temps restant à attendre avant de poser un autre pixel
- `warning` : une div qui contiendra le message d'erreur si l'utilisateur essaye de poser un pixel trop tôt

Pour récupérer ces éléments, tu peux utiliser le `querySelector` qui est maintenant le plus recommandé :

```js
const board = document.querySelector('#board');
```

- [querySelector](https://developer.mozilla.org/fr/docs/Web/API/Document/querySelector)

### Tâche à faire

Il va falloir créer 3 classes : `Board`, `Pixel` et `ColorPicker`

Dans `Board`, on va définir quelques variables statiques qui vont définir à quoi ressemble notre board. Je les ai déjà mises dans le fichier.

Le `Board` va être notre "application" qui va gérer tous les autres éléments de notre application.

Les tâches à faire dans le board sont les suivantes :

- Créer un constructeur qui initie une propriété `colorPicker` qui sera une instance de `ColorPicker`
- Créer une fonction `init` qui va récupérer le board et ajouter un style de `grid` en fonction de la taille du board
  - Elle va aussi initialiser le `colorPicker` en appelant la méthode `init` de `ColorPicker`
  - Elle va aussi initialiser le tableau avec tous les pixels en appelant `this.initPixels`

La fonction `initPixels` va ensuite créer un Pixel pour chaque pixel du board. Pour ça, on va utiliser une boucle `for`. Avec le pixel, on ajoutera l'élément dans celui-ci dans le board avec `this.board.append`.

#### Classe Pixel

La classe Pixel va créer un élément avec `document.createElement("div")` puis ajouter la classe `pixel` à cet élément (via la propriété statique).

Le `Pixel` prend aussi une couleur en paramètre dans son constructeur, cette couleur va être appliquée à notre pixel avec `style.backgroundColor`.

- [classList](https://developer.mozilla.org/fr/docs/Web/API/Element/classList) : pour ajouter la classe
- [element.style](https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/style) : pour ajouter le fond

#### Classe ColorPicker

La classe `ColorPicker` va avoir une méthode `init` qui vient récupérer l'élément `color-picker` et ajouter 4 pixels de couleurs différentes.

Elle prend `colors` et `currentColor` comme valeurs. C'est la classe `ColorPicker` qui contiendra l'information de la couleur actuelle appliquée dans notre application.

Pour les `Pixel` de notre `ColorPicker` on va aussi utiliser la classe `Pixel` juste qu'ici on va rajouter en plus à l'élément la classe `PIXEL_PICKER_CLASS` !

Si le `Pixel` est actuellement affiché, on ajoute aussi la classe `"active"`.

### Bonne chance !

Pour ce premier exercice, les emojis sont là pour te guider. Je reste un peu flou volontairement pour te laisser une certaine liberté dans ton implémentation. Regarde le résultat en cliquant sur `Solution 3` dans le nav pour voir ce que j'attends de toi.

💡 Tu retrouveras le résultat attendu [dans la page de la solution 1](http://localhost:5173/src/solutions/1.html)

## Partie 2 - Events

Notre tableau est ennuyeux... on ne peut rien faire avec. Il va falloir ajouter des événements sur nos pixels pour venir interagir avec notre tableau.

Il y a 2 parties importantes :

1. Gérer le clic sur le tableau pour changer la couleur d'un pixel
2. Gérer le clic sur le color picker pour changer la currentColor

#### Étape 1

Pour faire ça, il va falloir rajouter dans la méthode `init` de `Board` un **event listener**. Pour ça tu vas pouvoir utiliser `addEventListener` sur chaque pixel.

```js
pixel.addEventListener('click', () => {
  this.onPixelClick(pixel);
});
```

- [event listener](https://developer.mozilla.org/fr/docs/Web/API/EventTarget/addEventListener)

Comme tu le vois, tu vas devoir aussi créer la méthode `onPixelClick`. Cette méthode va modifier la couleur du pixel actuellement cliqué avec la `currentColor` stockée dans `this.colorPicker`.

⚠️ Dans la classe Pixel il va falloir ajouter un getter et un setter.

Si on a utilisé `_color` comme propriété, c'est parce que la couleur est **privée**. Tu vas ajouter un `getter` qui retourne simplement `this._color` et un `setter` qui vient définir `this._color` ET modifier le `backgroundColor` de `this.element` !

#### Étape 2

De la même manière, pour chaque pixel du `ColorPicker` on va rajouter un event listener qui va appeler la méthode `onColorPickerClick` de `Board`.

Dans la méthode `onColorPickerClick` tu vas venir sur chaque pixel stocké dans `this.pixels`, et regarder si `color` est actuellement égal à la couleur d'un pixel du `ColorPicker`. Si c'est le cas, tu vas venir ajouter la classe `active` à l'élément du pixel sinon **tu enlèves la classe `active`**.

- [classList](https://developer.mozilla.org/fr/docs/Web/API/Element/classList) : pour ajouter / supprimer la classe

### Bonne chance !

Encore une fois, je reste assez flou pour te laisser de la marge de manœuvre. Regarde le résultat en cliquant sur [Solution 2](http://localhost:5173/src/solutions/2.html) dans le nav pour voir ce que j'attends de toi.

## Partie 3 - Limiter le nombre de pixels par seconde

Pour l'instant, n'importe qui peut spammer des pixels. On va ajouter une limite pour ne pouvoir ajouter qu'un seul pixel toutes les 5 secondes.

Pour ça, on va créer une nouvelle classe `Warning` qui va s'occuper d'afficher l'élément `#warning` et 4 secondes après, le recacher. Cette classe va avoir comme propriétés `this.element` et `this.timeout` qui contiendra la référence d'un timeout.

Tu vas créer une méthode `showWarning` qui va enlever la classe `hidden` de notre élément puis 4 secondes après, rajouter la classe `hidden`. Ainsi que la méthode `init()` qui va initialiser `this.element`.

Tu vas initialiser ce warning dans le constructeur de `Board` et tu vas initialiser le `warning` dans la méthode `init`.

#### Game

Dans `Game`, on a déjà une propriété statique `TIME_TO_WAIT` qui définit le temps à attendre entre chaque Pixel.
On va dans la classe `Game` rajouter une propriété `lastPixelAddedDate` qui sera équivalente à la date du dernier pixel ajouté.

Avec cette date, on va pouvoir la comparer avec la date actuelle pour savoir si on peut ajouter un pixel ou non dans la méthode `onPixelClick()` :

```js
if (
  this.lastPixelAddedDate &&
  new Date() - this.lastPixelAddedDate < Game.TIME_TO_WAIT
) {
  this.warning.showWarning();
  return;
}
```

Dans ce cas, on appelle `showWarning()` de `this.warning` et on `return` pour ne pas ajouter le pixel.

Finalement, on va ajouter une nouvelle propriété dans game : `timeLeft` qui sera égale à l'élément qui a comme id `time-left`.

On va créer une méthode `toggleTimeLeft`.

Cette méthode sera appelée après avoir changé la méthode d'un pixel, elle changera le `innerText` de `this.timeLeft` en `5s`.

Cette méthode va utiliser un intervalle pour que chaque seconde, on calcule le temps restant en seconde et on l'affiche. Je te laisse faire ça un peu tout seul, c'est la dernière partie de notre application !

N'hésite pas à utiliser ChatGPT, Google, MDN et Stackoverflow pour mener à bien cette mission. Compare aussi avec le résultat final des exercices.

## Conclusion

Dans cet exercice, on a appris à manipuler le DOM, récupérer des éléments, les stocker, ajouter des event listener. J'espère que tu as apprécié l'aspect fun de cet exercice !
