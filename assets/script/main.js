/*******************DEVELOPMENT ROADMAP*******************/

/*********************FEATURES ADDED*********************/
// Dessiner le paddle (un rectangle plein) ; OK

// Gérer les mouvements du paddle (de gauche à droite, et en empêchant qu'il ne sorte du canvas) ; OK

// Dessiner la balle (elle est ronde, à l'évidence, et pleine) ; OK

// Créer les mouvements de la balle (doit rebondir contre toutes les paroies sauf celle du bas, et doit également rebondir contre le paddle) ; OK

// Dessiner les briques (on utilisera pour cela un tableau à deux dimensions - lignes et colonnes. Il y aura 10 colonnes et 7 lignes, soit 70 briques) ; OK

// Gérer les collisions (entre la balle et le paddle et entre la balle et les briques) ; OK

// Créer les conditions de victoire (si toutes les briques ont été détruites) et de défaite (si la balle tombe derrière le paddle) ; OK

// Dessiner le score et implémenter sa fonctionnalité; OK

// Créer la boîte de dialogue qui s'ouvre pour recommencer la partie ou télécharger le CV en cas de victoire OU en cas de GAME OVER; OK

// Ajouter l'image de fond qui comprend mes différentes compétences ; cette image sera placée derrière le mur de briques ; OK

// Ajouter un bouton de téléchargement dans la page index pour permettre le téléchargement du CV sans passer par le jeu; OK

// Télécharger une image pour le paddle (optionnel); OK

// Télécharger une image pour les briques (optionnel); OK

// Implémenter des effets sonores (briques, bulles, win, lose) (optionnel); OK

// Implémenter les fonctionnalités des bulles (optionnel);

// Créer les pages web dans lesquelles sera implémenté le jeu; OK

/*******************FEATURES TO BE ADDED*******************/

/**********************BONUS FEATURES**********************/
// Implémenter les changements de trajectoire de l'axe X de la balle si elle touche un côté des briques (optionnel); je laisse tomber cette fonctionnalité bonus : trop casse-tête. Ce doit être possible, mais je ne vois pas comment ='(

/*****************************************************************/

// Import des fonctions

import { createBall, drawBall, moveBall } from "./ball.js";
import {
  createBricks,
  createBrickwall,
  defineBrickwall,
  drawBrickwall,
} from "./bricks.js";
import { drawBubbles, moveBubbles } from "./bubbles.js";
import { createPaddle, drawPaddle, movePaddle } from "./paddle.js";
import {
  breakingSound,
  winningSound,
  losingSound,
  loseSound,
  winSound,
} from "./sounds.js";

// Export des variables :

export {
  canvas,
  ctx,
  paddleImg,
  brickImg,
  skills,
  fireball,
  gamePaddle,
  gameBall,
  gameBrick,
  gameBrickwall,
  bubblesArray,
  bricksArray,
  spaceBar,
};

// Canvas definition
const canvas = document.getElementById("gameCanvas");
canvas.width = window.innerWidth * 0.7;
// canvas.height = window.innerHeight * 0.7;
canvas.height = 900;
const ctx = canvas.getContext("2d");

// Images
let paddleImg = new Image();
paddleImg.src = "./assets/images/wooden-paddle.png";
let brickImg = new Image();
brickImg.src = "./assets/images/one-yellow-brick-130-52.png";
let skills = new Image();
skills.src = "./assets/images/skills-mini.png";
let fireball = new Image();
fireball.src = "./assets/images/fireball-mini.png";

// Objects
let gamePaddle = createPaddle();
let gameBall = createBall(gamePaddle);
let gameBrickwall = createBrickwall();
let gameBrick = createBricks(gameBrickwall);
let bubblesArray = [];
let bricksArray = [];
let score = 0;
let spaceBar = false;

// Interface elements
let downloadButton = document.getElementsByClassName("download");
let restartButton = document.getElementsByClassName("restart");
let winDiv = document.getElementById("winDiv");
let loseDiv = document.getElementById("loseDiv");

window.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    event.preventDefault();
    spaceBar = true;
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    event.preventDefault();
    spaceBar = true;
  }
});

for (let i = 0; i < restartButton.length; i++) {
  restartButton[i].addEventListener("click", () => {
    window.location.reload();
  });
}

for (let i = 0; i < downloadButton.length; i++) {
  downloadButton[i].addEventListener("click", () => {
    window.open("./resume.html", "_self");
  });
}
defineBrickwall(gameBrickwall); // I couldn't find any other place to execute this function; tried to make it a self-executing function, but then I couldn't all it from the self-executing resizeScreen() function, which was a bit of a pain because it was supposed to call it to update the canvas when the screen size changes, so... well. Here's the only solution I could find.

//Dessin des éléments UI
function drawSkills() {
  ctx.beginPath();
  ctx.drawImage(skills, canvas.width / 2 - 183, 63, 366, 305);
  ctx.globalCompositeOperation = "destination-over";
}

function drawScore() {
  ctx.font = "40px Helvetica, Arial, sans-serif";
  ctx.fillStyle = "#5FA0D9";
  ctx.fillText(`Score: ${score}`, canvas.width - 180, 40);
}

// Gestion des collisions
function ballPaddleCollision(ballObject, paddleObject) {
  if (
    ballObject.posX > paddleObject.posX &&
    ballObject.posX < paddleObject.posX + paddleObject.width &&
    ballObject.posY + ballObject.dirY > paddleObject.posY
  ) {
    ballObject.dirY *= -1;

    if (
      (ballObject.posX > paddleObject.posX &&
        ballObject.posX < paddleObject.posX + paddleObject.width / 2 &&
        ballObject.dirX > 0) ||
      (ballObject.posX < paddleObject.posX + paddleObject.width &&
        ballObject.posX > paddleObject.posX + paddleObject.width / 2 &&
        ballObject.dirX < 0)
    ) {
      ballObject.dirX *= -1;
    }
  }
}

/*
In the code below, I used the help of MDN in order to solve a bug that I had. I used to say that when a brick is hit, it's state becomes false and it's x and y coordinates become 0. However, I later found out that this caused a bug that made the score be exponentially incremented everytime the ball would hit the upper edge of the canvas between positions {x: 0, y: 0} and something like {x: 100, y:0} (I realized this was due to the fact that the bricks were not removed from the canvas, but placed at {x:0, y:0} of the canvas while still retaining their width. The more bricks the ball "destroyed", the more the score was incremented). Removing the lines that changed the coordinates of the bricks and adding a conditional statement before drawing the bricks, saying that they shouldn't exist on the canvas if their status is not true, solved the problem.
*/

function ballBrickCollision(ballObject, brickObject, brickwallObject) {
  for (let r = 0; r < brickwallObject.rowCount; r++) {
    for (let c = 0; c < brickwallObject.colCount; c++) {
      let bricks = bricksArray[r][c];
      if (bricks.state === true) {
        if (
          ballObject.posY + ballObject.radius > bricks.y &&
          ballObject.posY - ballObject.radius < bricks.y + brickObject.height &&
          ballObject.posX + ballObject.radius > bricks.x &&
          ballObject.posX - ballObject.radius < bricks.x + brickObject.width
        ) {
          ballObject.dirY *= -1;
          bricks.state = false;
          breakingSound();
          score++;
        }
      }
    }
  }
}

// Fonction pour définir la victoire ou la défaite

function checkWinOrLose(ballObject, brickwallObject, paddleObject) {
  if (score === brickwallObject.rowCount * brickwallObject.colCount) {
    spaceBar = false;
    ballObject.dirY = 0;
    ballObject.dirX = 0;
    paddleObject.posX = undefined;
    winDiv.style.display = "flex";
    winningSound();
    winSound.state = false;
  }
  if (
    ballObject.posY + ballObject.radius >
    paddleObject.posY + paddleObject.height
  ) {
    spaceBar = false;
    ballObject.dirY = 0;
    ballObject.dirX = 0;
    paddleObject.posX = undefined;
    loseDiv.style.display = "flex";
    losingSound();
    loseSound.state = false;
  }
}

function startGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  requestAnimationFrame(startGame);
  checkWinOrLose(gameBall, gameBrickwall, gamePaddle);
  drawBrickwall(gameBrickwall, gameBrick);
  drawPaddle(gamePaddle);
  drawBall(gameBall);
  drawBubbles();
  drawSkills(gameBrick, gameBrickwall);
  drawScore();
  movePaddle(gamePaddle);
  moveBall(gameBall);
  moveBubbles();
  ballPaddleCollision(gameBall, gamePaddle);
  ballBrickCollision(gameBall, gameBrick, gameBrickwall);

  // console.log("paddleY:", gamePaddle.posY, "ballY:", gameBall.posY + gameBall.radius,"ballDirY:", gameBall.dirY); // Utilisé pour vérifier ce qu'il se passait quand la balle entrait en collision avec la raquette, et pourquoi j'avais en permanence, si l'utilisateur bougeait rapidement la raquette et que celle-ci entrait en collision avec la balle par le côté, un "blocage" de la dirY de la balle (-3, 3, -3, 3 etc). Il s'avère que c'est parce que la condition qui gère le rebond inversant la dirY de la balle, celle-ci voyait sa dirY inversée à l'infini tant qu'elle restait dans la zone x de la raquette... La solution que j'ai trouvée est celle employée dans ce code ; elle n'est pas parfaite, mais normalement, aucun être humain n'aura les réflexes suffisants pour bloquer à nouveau la balle avec sa vitesse de déplacement de -3. Le seul "fix" réel que je pourrais employer serait de coller la raquette au bord du canvas, mais je trouve ça moche, donc non;
}
// setInterval(startGame, 500); // Utilisé pour vérifier certains paramètres et éviter que l'ordinateur ne s'emballe si (quand...) il y a une couille. J'ai notamment utilisé ce bout de code pour vérifier les collisions entre la balle et le paddle ou la balle et les briques.
startGame();

// Fonction pour redimensionner le canevas en fonction de la taille de l'écran, ainsi que replacer tous les objets :
(function resizeScreen() {
  window.addEventListener("resize", function () {
    canvas.width = window.innerWidth * 0.7;
    canvas.height = window.innerHeight * 0.7;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gamePaddle = createPaddle();
    gameBall = createBall(gamePaddle);
    gameBrickwall = createBrickwall();
    gameBrick = createBricks(gameBrickwall);
    bubblesArray = [];
    defineBrickwall(gameBrickwall);
    drawBrickwall(gameBrickwall, gameBrick);
    drawPaddle(gamePaddle);
    drawBall(gameBall);
    drawBubbles();
    drawSkills(gameBrick, gameBrickwall);
    drawScore();
    spaceBar = false;
    score = 0;
  });
})();

/*
Tests utilisés pour la correction des bugs sur les collisions :

gameBall.posX = canvas.width - gameBall.radius;
gameBall.posY = 0 + gameBall.radius;
gameBall.dirX = 1;  OK c'est bon, il n'y a plus le bug à la con qui bloquait la balle en haut de l'écran (c'était dû à une condition else if au lieu de if dans la gestion des collisions entre la balle et l'écran);

gameBall.posX = canvas.width / 2;
gameBall.posY = 400;
gameBall.dirX = 0; OK la brique est détruite au contact Y direct avec la balle par le bas;

gameBall.posX = canvas.width / 2;
gameBall.posY = 40;
gameBall.dirX = 0;
gameBall.dirY = 1; OK la brique est détruite au contact Y direct avec la balle par le haut;

gameBall.posX = 100;
gameBall.posY = 350;
gameBall.dirX = 1;
gameBall.dirY = 0;  OK la brique est détruite au contact X direct par la gauche;

gameBall.posX = canvas.width - 100
gameBall.posY = 350;
gameBall.dirX = -1;
gameBall.dirY = 0;   OK la brique est détruite au contact X direct par la droite;

gameBall
*/
