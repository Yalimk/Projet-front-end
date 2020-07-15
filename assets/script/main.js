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
let gameBrick = createBricks();
let gameBrickwall = createBrickwall();
let rightArrow = false;
let leftArrow = false;
let spaceBar = false;
let bubblesArray = [];

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
}

function createBall() {
  let ball = {};
  ball.radius = 10;
  ball.dirX = (Math.random() - 0.5) * 3;
  ball.dirY = -3;
  ball.posX = gamePaddle.posX + gamePaddle.width / 2;
  ball.posY = gamePaddle.posY - ball.radius + 1;
  return ball;
}

function createBricks() {
  let brick = {};
  brick.width = 100; //(canvas.width - canvasPadding * 2) / 10;
  brick.height = 30; //(canvas.height - canvasPadding * 2) / 20;
  brick.padding = 15;
  brick.posX = 0;
  brick.posY = 0;
  brick.status = 1;
  brick.offset = 33;
  return brick;
  // Used to create gameBrick;
}

function createBrickwall() {
  let Brickwall = {};
  Brickwall.bricksArray = [];
  Brickwall.rowCount = 7;
  Brickwall.colCount = 10;
  return Brickwall;
  // Used to create gameBrickwall;
}

function createBubbles() {
  const bubble = {};
  bubble.radius = Math.random() * 20 + 10;
  bubble.x = Math.random() * (canvas.width - bubble.radius * 2) + bubble.radius;
  bubble.y =
    Math.random() * (canvas.height - bubble.radius * 2) + bubble.radius;
  bubble.speedX = (Math.random() - 0.5) * 8;
  bubble.speedY = (Math.random() - 0.5) * 8;
  bubble.maxRadius = Math.random() * 99 + 25;
  bubble.draw = function () {
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
    // ctx.fillStyle = //insert color for bubbles
    ctx.fill();
  };
  bubble.move = function () {
    if (
      bubble.x + bubble.radius >= canvas.width ||
      bubble.x - bubble.radius <= 0
    ) {
      bubble.speedX *= -1;
    }
    if (
      bubble.y + bubble.radius >= canvas.height ||
      bubble.y - bubble.radius <= 0
    ) {
      bubble.speedY *= -1;
    }
    bubble.x += bubble.speedX;
    bubble.y += bubble.speedY;
  };
  return bubble;
}

for (let i = 0; i < 20; i++) {
  bubblesArray.push(createBubbles());
  bubblesArray[i].draw();
}

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
}

function drawBall(ballObject) {
  ctx.beginPath();
  ctx.arc(ballObject.posX, ballObject.posY, ballObject.radius, 0, Math.PI * 2);
  ctx.fillStyle = "blue";
  ctx.fill();
}

function drawBrickwall(brickwallObject, brickObject) {
  for (let r = 0; r < brickwallObject.rowCount; r++) {
    brickwallObject.bricksArray[r] = [];
    for (let c = 0; c < brickwallObject.colCount; c++) {
      let brickPosX =
        c * (brickObject.width + brickObject.padding) + brickObject.offset;
      let brickPosY =
        r * (brickObject.height + brickObject.padding) + brickObject.offset;
      brickwallObject.bricksArray[r][c] = {
        x: brickPosX,
        y: brickPosY,
      };
      ctx.beginPath();
      ctx.rect(brickPosX, brickPosY, brickObject.width, brickObject.height);
      ctx.fillStyle = "green";
      ctx.fill();
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

// setInterval(startGame, 1000); // Utilisé pour vérifier certains paramètres.
function startGame() {
  requestAnimationFrame(startGame);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBrickwall(gameBrickwall, gameBrick);
  drawPaddle(gamePaddle);
  drawBall(gameBall);
  movePaddle(gamePaddle);
  moveBall(gameBall);
  ballPaddleCollision(gameBall, gamePaddle);
  // ballBrickCollision(gameBall, gameBrick)
  // bubblesArray.forEach((bubble) => {
  //   bubble.draw();
  //   bubble.move();
  // });
}
startGame();
