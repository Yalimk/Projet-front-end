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
// Canvas definition
const canvas = document.getElementById("gameCanvas");
canvas.width = window.innerWidth * 0.7;
// canvas.height = window.innerHeight * 0.7;
canvas.height = 900;
const ctx = canvas.getContext("2d");

// Images
let paddleImg = new Image();
paddleImg.src = "images/wooden-paddle.png";
let brickImg = new Image();
brickImg.src = "images/one-yellow-brick-130-52.png";
let skills = new Image();
skills.src = "images/skills-mini.png";

// Sounds
let winSound = document.createElement("audio");
winSound.src = "./sounds/win.mp3";
winSound.state = true;
let loseSound = document.createElement("audio");
loseSound.src = "./sounds/lose.mp3";
loseSound.state = true;

// Objects
let gamePaddle = createPaddle();
let gameBall = createBall(gamePaddle);
let gameBrickwall = createBrickwall();
let gameBrick = createBricks(gameBrickwall);
let bubblesArray = [];
let bricksArray = [];
let rightArrow = false;
let leftArrow = false;
let spaceBar = false;
let score = 0;
let mouse = {
  posX: undefined,
  posY: undefined,
};

// Interface elements
let winDiv = document.getElementById("winDiv");
let loseDiv = document.getElementById("loseDiv");
let downloadButton = document.getElementsByClassName("download");
let restartButton = document.getElementsByClassName("restart");

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

window.addEventListener("mousemove", (event) => {
  mouse.posX = event.clientX;
  mouse.posY = event.clientY;
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

// Import des fonctions

import { createBall } from "ball.js";
import { drawBall } from "ball.js";
import { moveBall } from "ball.js";
import { createBricks } from "bricks.js";
import { createBrickwall } from "bricks.js";
import { defineBrickwall } from "bricks.js";
import { drawBrickwall } from "bricks.js";
import { createBubbles } from "bubbles.js";
import { drawBubbles } from "bubbles.js";
import { moveBubbles } from "bubbles.js";
import { ballBrickCollision } from "collisions.js";
import { ballPaddleCollision } from "collisions.js";
import { createPaddle } from "paddle.js";
import { drawPaddle } from "paddle.js";
import { movePaddle } from "paddle.js";
import { drawScore } from "ui.js";
import { drawSkills } from "ui.js";
import { breakingSound } from "sounds.js";
import { poppingSound } from "sounds.js";
import { winningSound } from "sounds.js";
import { losingSound } from "sounds.js";

// Les fonctions usine :

function createPaddle() {
  let paddle = {};
  paddle.width = 97;
  paddle.height = 14;
  paddle.posX = (canvas.width - paddle.width) * 0.5;
  paddle.posY = canvas.height - paddle.height - 30;
  paddle.velX = 5;
  return paddle;
  // Used to create gamePaddle;
}

function createBall(paddleObject) {
  let ball = {};
  ball.radius = 14;
  ball.dirX = (Math.random() - 0.5) * 5;
  ball.dirY = -3;
  ball.posX = paddleObject.posX + paddleObject.width / 2;
  ball.posY = paddleObject.posY - ball.radius;
  return ball;
  // Used to create gameBall;
}

function createBrickwall() {
  let brickwall = {};
  brickwall.rowCount = 6;
  brickwall.colCount = 2;

  if (canvas.width >= 1700) {
    brickwall.colCount = 10;
    brickwall.rowCount = 6;
  } else if (canvas.width >= 1400 && canvas.width < 1700) {
    brickwall.colCount = 9;
    brickwall.rowCount = 6;
  } else if (canvas.width >= 1200 && canvas.width < 1400) {
    brickwall.colCount = 7;
    brickwall.rowCount = 6;
  } else if (canvas.width >= 992 && canvas.width < 1200) {
    brickwall.colCount = 6;
    brickwall.rowCount = 6;
  } else if (canvas.width < 992 && canvas.width >= 854) {
    brickwall.colCount = 5;
    brickwall.rowCount = 6;
  } else if (canvas.width < 854 && canvas.width >= 690) {
    brickwall.colCount = 4;
    brickwall.rowCount = 6;
  } else if (canvas.width < 690 && canvas.width >= 560) {
    brickwall.colCount = 3;
    brickwall.rowCount = 6;
  }
  return brickwall;
  // Used to create gameBrickwall;
}

function createBricks(brickwallObject) {
  let brick = {};
  brick.width = 130;
  brick.height = 52;
  brick.padding = 10;
  brick.posX = 0;
  brick.posY = 0;
  brick.offsetTop = 53;
  brick.offsetLeft =
    (canvas.width - (brick.width + brick.padding) * brickwallObject.colCount) /
      2 +
    brick.padding / 2;
  return brick;
  // Used to create gameBrick;
}

function createBubbles(color1, color2) {
  const bubble = {};
  bubble.radius = Math.random() * 20 + 15;
  bubble.posX =
    Math.random() * (canvas.width - bubble.radius * 2) + bubble.radius;
  bubble.posY =
    Math.random() * (canvas.height - bubble.radius * 2) + bubble.radius;
  bubble.dirX = (Math.random() - 0.5) * 3;
  bubble.dirY = (Math.random() - 0.5) * 3;
  bubble.minRadius = bubble.radius;
  bubble.maxRadius = bubble.radius + Math.floor(Math.random() * 66 + 33);
  bubble.color = `rgba(${color1})`;
  bubble.state = true;

  bubble.draw = function () {
    if (bubble.state === true) {
      ctx.beginPath();
      ctx.arc(bubble.posX, bubble.posY, bubble.radius, 0, Math.PI * 2);
      ctx.fillStyle = bubble.color;
      ctx.fill();
    }
  };

  bubble.move = function () {
    if (
      bubble.posX + bubble.radius > canvas.width ||
      bubble.posX - bubble.radius < 0
    ) {
      bubble.dirX *= -1;
    }

    if (
      bubble.posY + bubble.radius > canvas.height ||
      bubble.posY - bubble.radius < 0
    ) {
      bubble.dirY *= -1;
    }
    bubble.posX += bubble.dirX;
    bubble.posY += bubble.dirY;
  };

  bubble.grow = function (ballObject) {
    let distX = bubble.posX - ballObject.posX;
    let distY = bubble.posY - ballObject.posY;
    let distArea = Math.sqrt(distX * distX + distY * distY);
    if (spaceBar) {
      if (distArea < bubble.radius + ballObject.radius) {
        if (bubble.radius < bubble.maxRadius) {
          bubble.radius += 2;
          bubble.color = `rgba(${color2})`;
        }
      } else if (distArea > bubble.radius + ballObject.radius) {
        if (bubble.radius > bubble.minRadius) {
          bubble.radius -= 0.5;
          bubble.color = `rgba(${color1})`;
        }
      }
    }

    bubble.remove = function () {
      if (bubble.radius >= bubble.maxRadius && bubble.state === true) {
        poppingSound();
        bubble.state = false;
      }
    };
  };

  return bubble;
  // Used to create all the bubbles, draw them and make them move on the screen;
}

// Les fonctions de dessin d'objets :

function drawPaddle(paddleObject) {
  ctx.drawImage(
    paddleImg,
    0,
    0,
    paddleObject.width,
    paddleObject.height,
    paddleObject.posX,
    paddleObject.posY,
    paddleObject.width,
    paddleObject.height
  );
}

function drawBall(ballObject) {
  ctx.beginPath();
  ctx.arc(ballObject.posX, ballObject.posY, ballObject.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#5FA0D9";
  ctx.fill();
  ctx.closePath();
}

function defineBrickwall(brickwallObject) {
  for (let r = 0; r < brickwallObject.rowCount; r++) {
    bricksArray[r] = [];
    for (let c = 0; c < brickwallObject.colCount; c++) {
      bricksArray[r][c] = {
        x: 0,
        y: 0,
        state: true,
      };
    }
  }
}
defineBrickwall(gameBrickwall); // I couldn't find any other place to execute this function; tried to make it a self-executing function, but then I couldn't all it from the self-executing resizeScreen() function, which was a bit of a pain because it was supposed to call it to update the canvas when the screen size changes, so... well. Here's the only solution I could find.

function drawBrickwall(brickwallObject, brickObject) {
  for (let r = 0; r < brickwallObject.rowCount; r++) {
    for (let c = 0; c < brickwallObject.colCount; c++) {
      if (bricksArray[r][c].state === true) {
        let brickPosX =
          c * (brickObject.width + brickObject.padding) +
          brickObject.offsetLeft;
        let brickPosY =
          r * (brickObject.height + brickObject.padding) +
          brickObject.offsetTop;
        bricksArray[r][c].x = brickPosX;
        bricksArray[r][c].y = brickPosY;
        ctx.drawImage(
          brickImg,
          0,
          0,
          brickObject.width,
          brickObject.height,
          brickPosX,
          brickPosY,
          brickObject.width,
          brickObject.height
        );
      }
    }
  }
}

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

function drawBubbles() {
  for (let i = 0; i < 20; i++) {
    if (bubblesArray.length < 20) {
      bubblesArray.push(
        createBubbles("98, 148, 166, 0.5", "191, 229, 242, 0.7")
        // createBubbles("98, 148, 166, 0.5", "242, 242, 242, 0.7")
      );
    }
  }
}

// Les fonctions qui gèrent les mouvements :

function movePaddle(paddleObject) {
  if (spaceBar) {
    if (leftArrow && paddleObject.posX > 0) {
      rightArrow = false;
      paddleObject.posX -= paddleObject.velX;
    } else if (
      rightArrow &&
      paddleObject.posX + paddleObject.width < canvas.width
    ) {
      leftArrow = false;
      paddleObject.posX += paddleObject.velX;
    }
  }
}

function moveBall(ballObject) {
  if (spaceBar) {
    ballObject.posX += ballObject.dirX;
    ballObject.posY += ballObject.dirY;
  }

  if (
    ballObject.posX + ballObject.radius > canvas.width ||
    ballObject.posX - ballObject.radius < 0
  ) {
    ballObject.dirX *= -1;
  }

  if (ballObject.posY - ballObject.radius < 0) {
    ballObject.dirY *= -1;
  }
}

function moveBubbles() {
  bubblesArray.forEach((bubble) => {
    bubble.draw();
    bubble.move();
    bubble.grow(gameBall);
    bubble.remove();
  });
}

// Les fonctions qui gèrent les collisions :

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
          ballObject.posY > bricks.y &&
          ballObject.posY < bricks.y + brickObject.height &&
          ballObject.posX > bricks.x &&
          ballObject.posX < bricks.x + brickObject.width
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

// Fonctions pour l'implémentation des sons

function breakingSound() {
  let brickSound = document.createElement("audio");
  brickSound.src = "./sounds/impact.mp3";
  brickSound.play();
}

function poppingSound() {
  let bubbleSound = document.createElement("audio");
  bubbleSound.src = "./sounds/bubble.mp3";
  bubbleSound.play();
}

function winningSound() {
  if (winSound.state === true) {
    winSound.play();
  }
}

function losingSound() {
  if (loseSound.state === true) {
    loseSound.play();
  }
}

// Fonction pour définir la victoire ou la défaite

function checkWinOrLose(ballObject, brickwallObject, paddleObject) {
  if (score === brickwallObject.rowCount * brickwallObject.colCount) {
    ballObject.dirY = 0;
    ballObject.dirX = 0;
    paddleObject.posX = undefined;
    winDiv.style.display = "flex";
    winningSound();
    winSound.state = false;
    spaceBar = false;
  }
  if (
    ballObject.posY + ballObject.radius >
    paddleObject.posY + paddleObject.height
  ) {
    ballObject.dirY = 0;
    ballObject.dirX = 0;
    paddleObject.posX = undefined;
    loseDiv.style.display = "flex";
    losingSound();
    loseSound.state = false;
    spaceBar = false;
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
