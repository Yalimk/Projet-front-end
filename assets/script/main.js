const canvas = document.getElementById("canvas");
canvas.width = 900;
canvas.height = 900;
const ctx = canvas.getContext("2d");

// Dessiner le paddle (un rectangle plein) ;
// Gérer les mouvements du paddle (de gauche à droite, et en empêchant qu'il ne sorte du canvas) ;
// Dessiner la balle (elle est ronde, à l'évidence, et pleine) ;
// Créer les mouvements de la balle (doit rebondir contre toutes les paroies sauf celle du bas, et doit également rebondir contre le paddle) ;
// Dessiner les briques (on utilisera pour cela un tableau à deux dimensions - lignes et colonnes. Il y aura 10 colonnes et 5 lignes, soit 50 briques) ;
// Implémenter l'intéraction entre la balle et les briques (la balle rebondit sur les briques et les fait disparaître au contact) ;
// Gérer les collisions (entre la balle et le paddle et entre la balle et les briques) ;
// Créer les conditions de victoire (si toutes les briques ont été détruites) et de défaite (si la balle tombe derrière le paddle) ;
// Créer la boîte de dialogue qui s'ouvre pour recommencer la partie ou télécharger le CV ;
// Créer un bouton START qui apparaîtra avant le lancement du jeu et qui lancera le jeu ;

let gamePaddle = createPaddle();
let gameBall = createBall();

function createPaddle() {
  let paddle = {};
  paddle.width = 100;
  paddle.height = 15;
  paddle.posX = (canvas.width - paddle.width) * 0.5;
  paddle.posY = canvas.height - paddle.height * 2;
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

drawPaddle(gamePaddle);
drawBall(gameBall);
