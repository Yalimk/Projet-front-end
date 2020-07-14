const canvas = document.getElementById("canvas");
canvas.width = 900;
canvas.height = 600;
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

let gamePaddle = createPaddle();
let gameBall = createBall();
let rightArrow = false;
let leftArrow = false;
let spaceBar = false;

window.addEventListener("keydown", (event) => {
  // console.log(event.key);
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    leftArrow = true;
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    rightArrow = true;
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    leftArrow = false;
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    rightArrow = false;
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    event.preventDefault();
    spaceBar = true;
  }
});

function createPaddle() {
  let paddle = {};
  paddle.width = 100;
  paddle.height = 15;
  paddle.posX = (canvas.width - paddle.width) * 0.5;
  paddle.posY = canvas.height - paddle.height * 2;
  paddle.velX = 5;
  return paddle;
}

function createBall() {
  let ball = {};
  ball.radius = 15;
  ball.velX = 3;
  ball.velY = -3;
  ball.posX = gamePaddle.posX + gamePaddle.width / 2;
  ball.posY = gamePaddle.posY - ball.radius;
  return ball;
}

function drawPaddle(paddleObject) {
  ctx.beginPath();
  ctx.fillRect(
    paddleObject.posX,
    paddleObject.posY,
    paddleObject.width,
    paddleObject.height
  );
}

function drawBall(ballObject) {
  ctx.beginPath();
  ctx.arc(ballObject.posX, ballObject.posY, ballObject.radius, 0, Math.PI * 2);
  ctx.fill();
}

function movePaddle(paddleObject) {
  if (leftArrow && paddleObject.posX > 0) {
    paddleObject.posX -= paddleObject.velX;
    rightArrow = false;
  } else if (
    rightArrow &&
    paddleObject.posX + paddleObject.width < canvas.width
  ) {
    paddleObject.posX += paddleObject.velX;
    leftArrow = false;
  }
}

function moveBall(ballObject) {
  if (spaceBar) {
    ballObject.posX += ballObject.velX;
    ballObject.posY += ballObject.velY;
  }
  if (
    ballObject.posX + ballObject.radius >= canvas.width ||
    ballObject.posX - ballObject.radius <= 0
  ) {
    ballObject.velX *= -1;
  } else if (
    ballObject.posY - ballObject.radius <= 0 ||
    ballObject.posY + ballObject.radius >= canvas.height
  ) {
    ballObject.velY *= -1;
  }
}

function startGame() {
  requestAnimationFrame(startGame);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle(gamePaddle);
  drawBall(gameBall);
  movePaddle(gamePaddle);
  moveBall(gameBall);
}
startGame();
