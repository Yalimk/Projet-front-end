const canvas = document.getElementById("gameCanvas");
canvas.width = 1200;
canvas.height = 900;
const ctx = canvas.getContext("2d");

// Dessiner le paddle (un rectangle plein) ; OK
// Gérer les mouvements du paddle (de gauche à droite, et en empêchant qu'il ne sorte du canvas) ; OK
// Dessiner la balle (elle est ronde, à l'évidence, et pleine) ; OK

// Créer les mouvements de la balle (doit rebondir contre toutes les paroies sauf celle du bas, et doit également rebondir contre le paddle) ;
// Dessiner les briques (on utilisera pour cela un tableau à deux dimensions - lignes et colonnes. Il y aura 10 colonnes et 5 lignes, soit 50 briques) ;
// Gérer les collisions (entre la balle et le paddle et entre la balle et les briques) ;
// Créer les conditions de victoire (si toutes les briques ont été détruites) et de défaite (si la balle tombe derrière le paddle) ;
// Créer la boîte de dialogue qui s'ouvre pour recommencer la partie ou télécharger le CV en cas de victoire OU en cas de GAME OVER;
// Créer un bouton START qui apparaîtra avant le lancement du jeu et qui lancera le jeu (les contrôles du jeu seront expliqués dans cette boîte de dialogue, en dessous du message START);
// Ajouter l'image de fond qui comprend mes différentes compétences ; cette image sera placée derrière le mur de briques ;
// Ajouter l'image de background pour le gameCanvas ;

let canvasPadding = 10;
let gamePaddle = createPaddle();
let gameBall = createBall();
let gameBrickwall = createBrickwall();
let gameBrick = createBricks(gameBrickwall);
let rightArrow = false;
let leftArrow = false;
let spaceBar = false;

// Tous les événements permettant d'écouter les touches du clavier :

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

// Les fonctions créatrices d'objet :

function createPaddle() {
  let paddle = {};
  paddle.width = 100;
  paddle.height = 10;
  paddle.posX = (canvas.width - paddle.width) * 0.5;
  paddle.posY = canvas.height - paddle.height - canvasPadding * 3;
  paddle.velX = 5;
  return paddle;
  // Used to create gamePaddle;
}

function createBall() {
  let ball = {};
  ball.radius = 10;
  ball.dirX = (Math.random() - 0.5) * 5;
  ball.dirY = -3;
  ball.posX = gamePaddle.posX + gamePaddle.width / 2;
  ball.posY = gamePaddle.posY - ball.radius + 1;
  return ball;
  // Used to create gameBall;
}

function createBrickwall() {
  let brickwall = {};
  brickwall.rowCount = 7;
  brickwall.colCount = 10;
  return brickwall;
  // Used to create gameBrickwall;
}

function createBricks(brickwallObject) {
  let brick = {};
  brick.width = 100;
  brick.height = 30;
  brick.padding = 3;
  brick.posX = 0;
  brick.posY = 0;
  brick.offsetTop = 50;
  brick.offsetLeft =
    (canvas.width - (brick.width + brick.padding) * brickwallObject.colCount) /
    2;
  return brick;
  // Used to create gameBrick;
}

// let bubblesArray = [];

// function createBubbles() {
//   const bubble = {};
//   bubble.radius = Math.random() * 20 + 10;
//   bubble.x = Math.random() * (canvas.width - bubble.radius * 2) + bubble.radius;
//   bubble.y =
//     Math.random() * (canvas.height - bubble.radius * 2) + bubble.radius;
//   bubble.speedX = (Math.random() - 0.5) * 8;
//   bubble.speedY = (Math.random() - 0.5) * 8;
//   bubble.maxRadius = Math.random() * 99 + 25;

//   bubble.draw = function () {
//     ctx.beginPath();
//     ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
//     ctx.fillStyle = "purple";
//     ctx.fill();
//   };

//   bubble.move = function () {
//     if (
//       bubble.x + bubble.radius >= canvas.width ||
//       bubble.x - bubble.radius <= 0
//     ) {
//       bubble.speedX *= -1;
//     }

//     if (
//       bubble.y + bubble.radius >= canvas.height ||
//       bubble.y - bubble.radius <= 0
//     ) {
//       bubble.speedY *= -1;
//     }
//     bubble.x += bubble.speedX;
//     bubble.y += bubble.speedY;
//   };
//   return bubble;
//   // Used to create all the bubbles, draw them and make them move on the screen;
// }

// (function drawBubbles() {
//   for (let i = 0; i < 20; i++) {
//     bubblesArray.push(createBubbles());
//     bubblesArray[i].draw();
//   }
// })();

// Les fonctions de dessin d'objets :

function drawPaddle(paddleObject) {
  ctx.beginPath();
  ctx.rect(
    paddleObject.posX,
    paddleObject.posY,
    paddleObject.width,
    paddleObject.height
  );
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
}

function drawBall(ballObject) {
  ctx.beginPath();
  ctx.arc(ballObject.posX, ballObject.posY, ballObject.radius, 0, Math.PI * 2);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();
}

/* Code snippet found at https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Build_the_brick_field 
I couldn't find any way around this. Trying to insert this snippet somewhere inside my code was extremely troublesome... */
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
/* Code snippet found at https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Build_the_brick_field */

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
        ctx.beginPath();
        ctx.rect(brickPosX, brickPosY, brickObject.width, brickObject.height);
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Les fonctions qui gèrent les déplacements :

function movePaddle(paddleObject) {
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

function moveBall(ballObject) {
  if (spaceBar) {
    ballObject.posX += ballObject.dirX;
    ballObject.posY += ballObject.dirY;
  }
  if (
    ballObject.posX + ballObject.radius >= canvas.width ||
    ballObject.posX - ballObject.radius <= 0
  ) {
    ballObject.dirX *= -1;
  } else if (ballObject.posY - ballObject.radius <= 0) {
    ballObject.dirY *= -1;
  }

  // On ajoutera ici la condition qui fait que si la balle touche une brique / bulle, sa vélocité augmente de 0.05... démoniaque *,..,*
}

function moveBubbles() {
  bubblesArray.forEach((bubble) => {
    bubble.draw();
    bubble.move();
  });
}

// Les fonctions qui gèrent les collisions :

function ballPaddleCollision(ballObject, paddleObject) {
  if (
    ballObject.posX > paddleObject.posX &&
    ballObject.posX < paddleObject.posX + paddleObject.width &&
    ballObject.posY + ballObject.radius ===
      paddleObject.posY + paddleObject.height
  ) {
    ballObject.dirY *= -1;
  }
}

function ballBrickCollision(ballObject, brickObject, brickwallObject) {
  for (let r = 0; r < brickwallObject.rowCount; r++) {
    for (let c = 0; c < brickwallObject.colCount; c++) {
      let bricks = bricksArray[r][c];
      if (
        ballObject.posY + ballObject.radius > bricks.y &&
        ballObject.posY - ballObject.radius < bricks.y + brickObject.height &&
        ballObject.posX > bricks.x &&
        ballObject.posX < bricks.x + brickObject.width
      ) {
        ballObject.dirY *= -1;
        bricks.state = false;
        bricks.x = 0;
        bricks.y = 0;
      }
    }
  }
}

// setInterval(startGame, 1000); // Utilisé pour vérifier certains paramètres.
function startGame() {
  requestAnimationFrame(startGame);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBrickwall(gameBrickwall, gameBrick);
  drawPaddle(gamePaddle);
  drawBall(gameBall);
  movePaddle(gamePaddle);
  moveBall(gameBall);
  // moveBubbles();
  ballPaddleCollision(gameBall, gamePaddle);
  ballBrickCollision(gameBall, gameBrick, gameBrickwall);
}
startGame();
