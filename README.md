# Setup r/place clone

## Prérequis

- [git](https://git-scm.com/downloads) - v2 ou plus
- [node](https://nodejs.org/en/) - v12 ou plus
- [npm](https://nodejs.org/en/) - v6 ou plus
- [VSCode](https://code.visualstudio.com/download) - 1.78.2 ou plus

Vérifie que tout est ok :

```bash
git -v
node -v
npm -v
```

## Cloner le projet

- Ouvrir un terminal

```bash
git clone https://github.com/Melvynx/beginjavascript-module-dom.git

cd beginjavascript-module-dom

npm install
```

## Test du projet

Pour run tes exercices, il faudra cette fois-ci lancer l'application avec node.

Utilise la commande suivante pour lancer le projet :

```bash
npm run dev
```

Tu verras un server web s'ouvrir et tu pourras ouvrir le script. Nous verrons dans la suite du cours ce qu'est `vite`.
