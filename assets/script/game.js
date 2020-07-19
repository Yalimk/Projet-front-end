/*******************DEVELOPMENT ROADMAP*******************/

/*********************FEATURES ADDED*********************/
// Dessiner le paddle (un rectangle plein) ; OK
// Gérer les mouvements du paddle (de gauche à droite, et en empêchant qu'il ne sorte du canvas) ; OK
// Dessiner la balle (elle est ronde, à l'évidence, et pleine) ; OK

// Créer les mouvements de la balle (doit rebondir contre toutes les paroies sauf celle du bas, et doit également rebondir contre le paddle) ; OK

// Dessiner les briques (on utilisera pour cela un tableau à deux dimensions - lignes et colonnes. Il y aura 10 colonnes et 7 lignes, soit 70 briques) ; OK

// Gérer les collisions (entre la balle et le paddle et entre la balle et les briques) ; OK

// Télécharger une image pour le paddle (optionnel);

// Télécharger une image pour les briques (optionnel);

// Créer les conditions de victoire (si toutes les briques ont été détruites) et de défaite (si la balle tombe derrière le paddle) ; OK

// Dessiner le score et implémenter sa fonctionnalité; OK

// Créer la boîte de dialogue qui s'ouvre pour recommencer la partie ou télécharger le CV en cas de victoire OU en cas de GAME OVER; OK

// Ajouter l'image de fond qui comprend mes différentes compétences ; cette image sera placée derrière le mur de briques ; OK

// Ajouter un bouton de téléchargement dans la page index pour permettre le téléchargement du CV sans passer par le jeu; OK

// Implémenter la vectorisation des trajectoires de la balle vs paddle (optionnel); OK plus ou moins, car cela reste très basique... Mais au moins, l'utilisateur peut choisir dans quelle direction il souhaite que la balle rebondisse en fonction de la zone de la raquette où la balle rebondit et la trajectoire de la balle.

/*******************FEATURES TO BE ADDED*******************/
// Créer les pages web dans lesquelles sera implémenté le jeu;

/**********************BONUS FEATURES**********************/
// Implémenter les fonctionnalités des bulles rouges et bleues (optionnel);
// Implémenter les changements de trajectoire de l'axe X de la balle si elle touche un côté des briques (optionnel);
// Implémenter des effets sonores (optionnel);

/*****************************************************************/

// All the imports from other js files
import createBall from "./ball.js";
import drawBall from "./ball.js";
import moveBall from "./ball.js";
import createPaddle from "./paddle.js";
import drawPaddle from "./paddle.js";
import movePaddle from "./paddle.js";
import createBricks from "./bricks.js";
import createBrickwall from "./brickwall.js";
import drawBubbles from "./bubbles.js";
import moveBubbles from "./bubbles.js";
import ballBrickCollision from "./collisions.js";
import ballPaddleCollision from "./collisions.js";

const canvas = document.getElementById("gameCanvas");
canvas.width = 900;
canvas.height = 900;
const ctx = canvas.getContext("2d");

let paddleImg = new Image();
paddleImg.src = "images/wooden-paddle.png";
let brickImg = new Image();
brickImg.src = "images/one-yellow-brick-130-52.png";
let skills = new Image();
skills.src = "images/skills.png";
let gamePaddle = createPaddle();
let gameBall = createBall();
let gameBrickwall = createBrickwall();
let gameBrick = createBricks(gameBrickwall);
let speedBubblesArray = [];
let slowBubblesArray = [];
let rightArrow = false;
let leftArrow = false;
let spaceBar = false;
let score = 0;
let winDiv = document.getElementById("winDiv");
let loseDiv = document.getElementById("loseDiv");
let startButton = document.getElementById("start");
let downloadButton = document.getElementsByClassName("download");
let restartButton = document.getElementsByClassName("restart");

/* 
Code snippet found at https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Build_the_brick_field. I couldn't find any way around this. Trying to insert this snippet somewhere inside my code was extremely troublesome because the bricksArray object, if defined as a property of the object gameBrickwall, wouldn't be accessible from the global scope, therefore causing issues. 
*/
let bricksArray = [];
for (let r = 0; r < gameBrickwall.rowCount; r++) {
  bricksArray[r] = [];
  for (let c = 0; c < gameBrickwall.colCount; c++) {
    bricksArray[r][c] = {
      x: 0,
      y: 0,
      state: true,
    };
  }
}
/*
End of code snippet from MDN.
*/

// Tous les événements d'écoute :

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    leftArrow = true;
    rightArrow = "";
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    rightArrow = true;
    leftArrow = "";
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft") {
    leftArrow = false;
  } else if (event.key === "ArrowRight") {
    rightArrow = false;
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

function drawSkills() {
  ctx.beginPath();
  ctx.drawImage(skills, canvas.width / 2 - 280, 55, 560, 315);
  ctx.globalCompositeOperation = "destination-over";
}

function drawScore() {
  ctx.font = "40px Helvetica, Arial, sans-serif";
  ctx.fillStyle = "#cdd973";
  ctx.fillText(`Score: ${score}`, canvas.width - 180, 40);
}

drawBubbles();

// Fonction pour définir la victoire ou la défaite

function checkWinOrLose(ballObject, brickwallObject, paddleObject) {
  if (score === brickwallObject.rowCount * brickwallObject.colCount) {
    winDiv.style.display = "flex";
    ballObject.dirY = 0;
    ballObject.dirX = 0;
    paddleObject.posX = undefined;
  }
  if (ballObject.posY + ballObject.radius > canvas.height) {
    ballObject.dirY = 0;
    ballObject.dirX = 0;
    loseDiv.style.display = "flex";
    paddleObject.posX = undefined;
  }
}

function startGame() {
  requestAnimationFrame(startGame);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  checkWinOrLose(gameBall, gameBrickwall, gamePaddle);
  drawBrickwall(gameBrickwall, gameBrick);
  drawPaddle(gamePaddle);
  drawBall(gameBall);
  drawSkills(gameBrick, gameBrickwall);
  drawScore();
  movePaddle(gamePaddle);
  moveBall(gameBall);
  moveBubbles();
  ballPaddleCollision(gameBall, gamePaddle);
  ballBrickCollision(gameBall, gameBrick, gameBrickwall);
}
// setInterval(startGame, 500); // Utilisé pour vérifier certains paramètres et éviter que l'ordinateur ne s'emballe si (quand...) il y a une couille.
startGame();

/* 

Test pour correction de bugs sur les collisions :

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
