# DOM - r/place

Dans ce module, on va pour la première fois intéragir avec le DOM. On va s'intéresser principalement au **JavaScript** qui compose notre application.

Dans cette application on utilise :

- [vitejs](https://vitejs.dev/) - un outil de build pour le développement web
- [tailwindcss](https://tailwindcss.com/) - une librairie CSS pour facilement styliser notre application

Il faut savoir que j'ai **déjà fais le CSS** et j'ai **déjà fais le HTML** pour toi. Ce n'est **pas un cours sur HTML / CSS** mais sur `JavaScript`. Il est important de se le rappeler.

Notre but est de créer un clone _minimaliste_ de `r/place` avec `JavaScript`.

Pour ça, on va utiliser tout ce qu'on a appris depuis le début du cours ainsi que les notions de `DOM` qu'on verra dans la suite du cours.

> ⚠️ Encore une fois, il est normal que tu galères si tu n'as jamais fais de DOM. Passe 15 minutes maximum par exercice et passe au suivant.

## Partie 1 - UI

Dans cette première partie, on va créer les principaux élément de l'interface utilisateur. Pour ça, on va utiliser le `POO` pour avoir un code plus propre et plus facile à maintenir.

Il y a quelques élément que j'ai utilisé dans le HTML que tu dois connaître :

- `board` : une div avec l'id board qui représente notre tableau
- `color-picker` : une div avec l'id color-picker qui représente notre palette de couleur
- `time-left` : une div qui contiendera le temps restant à attendre avant de poser un autre pixel
- `warning` : une div qui contiendera le message d'erreur si l'utilisateur essaye de poser un pixel trop tôt

Pour récupérer ces éléments tu peux utiliser le `querySelector` qui est maintenant le plus recommandé :

```js
const board = document.querySelector('#board');
```

### Tâche à faire

Il va falloir créer 3 classes : `Board`, `Pixel` et `ColorPicker`

Dans `Board`, on va définir quelques variables static qui vont définir à quoi ressemble notre board. Je l'ai ai déjà mis dans le fichier.

Le `Board` va être notre "application" qui va gérer tous les autres élément de notre application.

Les tâches à faire dans le board sont les suivantes :

- Créer un constructeur qui initié une propriétés `colorPicker` qui sera une instance de `ColorPicker`
- Créer une function `init` qui va récupérer le board et ajouter un style de `grid` en fonction de la taille du board
  - Elle va aussi intialiser le `colorPicker` en appelant la méthode `init` de `ColorPicker`
  - Elle va aussi initialiser le tableau avec tous les pixels en appelant `this.initPixels`

La function `initPixels` va ensuite créer un Pixel pour chaque pixel du board. Pour ça, on va utiliser une boucle `for`. Avec le pixel, on ajoutera l'élément dans celui ci dans le board avec `this.board.append`.

#### Class Pixel

La class Pixel va créer un élément avec `document.createElement("div")` puis ajouter la class `pixel` à cette élément.

Le `Pixel` prends aussi une couleur en paramètre dans son constructeur, cette couleur va être appliqué à notre pixel

#### Class ColorPicker

La class `ColorPicker` va avoir une méthode `init` qui viens récupérer l'élément `color-picker` et ajouter 4 pixels de couleurs différentes.

Elle prends `colors` et `currentColor` comme valeur. C'est la class `ColorPicker` qui contiendera l'information de la couleur actuelle appliqué dans notre application.

Pour les `Pixel` de notre `ColorPicker` on va aussi utilisé la class `Pixel` juste qu'ici on va rajouter en plus à l'élément la class `PIXEL_PICKER_CLASS` !

Si le `Pixel` est actuelement affiché, on ajoute aussi la class `"active"`.

### Bonne chance !

Pour ce première exercice, les émojis sont là pour te guider. Je reste un peu flou volontairement pour te laisser une certaines liberté dans ton implémentation. Regarde le résultat en cliquant sur `Solution 3` dans le nav pour voir ce que j'attends de toi.

💡 Tu retrouveras le résultat attendu [dans la page de la solution 2](http://localhost:5173/src/solutions/1.html)

## Partie 2 - Events

Notre board est ennuyeux... on pas rien faire avec. Il va falloir ajouté des events sur nos pixels pour venir intéragir avec notre board.

Il y a 2 parties importantes :

1. Gérer le click sur le board pour changer la couleur d'un pixel
2. Gérer le click sur le color picker pour changer la currentColor

#### Étape 1

Pour faire ça, il va falloir rajouter dans la méthode `init` de `Board` un **event listener**. Pour ça tu vas pouvoir utiliser `addEventListener` sur chaque pixel.

```js
pixel.addEventListener('click', () => {
  this.onPixelClick(pixel);
});
```

Comme tu le vois, tu vas devoir aussi créer la méthode `onPixelClick`. Cette méthode va modifier la couleur du pixel actuellement cliqué avec la `currentColor` stocké dans `this.colorPicker`.

⚠️ Dans la class Pixel il va falloir ajouté un getter et un setter.

Si on a utiliser `_color` comme propriétsé c'est car la couleur est **private**. Tu vas ajouter un `getter` qui retourne simplement `this._color` et un `setter` qui vient set `this._color` ET modifier le `backgroundColor` de `this.element` !

#### Étape 2

De la même manière, pour chaque pixel du `ColorPicker` on va ajouter un event listener qui va appeler la méthode `onColorPickerClick` de `Board`.

Dans la méthode `onColocPickerClick` tu vas venir sur chaque pixels stocké dans `this.pixels` regardé si `color` est actuellement égal à la couleur d'un pixel du `ColorPicker`. Si c'est le cas, tu vas venir ajouter la class `active` à l'élément du pixel sinon **tu enlèves la class `active`**.

### Bonne chance !

Encore une fois je reste assze flou pour te laisser de la marge de manoeuvre. Regarde le résultat en cliquant sur [Solution 2](http://localhost:5173/src/solutions/2.html) dans le nav pour voir ce que j'attends de toi.

## Partie 3 - Limiter le nombre de pixel par seconde

Pour l'instant, n'importe qui peut spam de pixel. On va ajouter une limite pour ne pouvoir ajouter qu'un seul pixel toutes les 5 secondes.

Pour ça on va créer une nouvelle class `Warning` qui va s'occuper d'afficher l'élément `#warning` et 4 secondes après, le recacher. Cette class va avoir comme propriétés `this.element` et `this.interval` qui contienra la référence d'un interval.

Tu vas créer une méthode `showWarning` qui va enlever la class `hidden` de notre élément puis 4 secondes va rajouter la class `hidden`. Ainsi que la méthode `init()` qui va initialiser `this.element`.

Tu vas initialiser ce warning dans la constructor de `Board` et tu vas initialiser le `warning` dans la méthode `init`.

#### Game

Dasn `Game` on a déjà une propirétés static `TIME_TO_WAIT` qui définit le temps à attendre entre chaque Pixel.
On va dasn la class `Game` rajouter une proriétés `lastPixelAddedDate` qui sera équivalent à la date du dernier pixel ajouté.

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

Dans ce cas, on appel `showWarning()` de `this.warning` et on `return` pour ne pas ajouter le pixel.

Finalement, on va ajouté une nouvelle propriétés dans game : `timeLeft` qui sera égal à l'élément qui a comme id `time-left`.

On va créer une méthode `toggleTimeLeft`.

Cette méthode sera appelé après avoir changé la méthode d'un pixel, elle changera le `innerText` de `this.timeLeft` en `5s`.

Cette méthode va utiliser un interval pour que chaque secondes, on calcule le temps restant en secondes et on l'affiche. Je te laisse faire ça un peu tout seul, c'est la dernière partie de notre application !

## Conclusion

Dans cette exercice, on a appris à manipuler le DOM, récupérer des éléments, les stockers, ajouter des event listener. J'espère que tu as apprécier l'aspect fun de cette exercice !
