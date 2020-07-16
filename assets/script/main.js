const canvas = document.getElementById("gameCanvas");
canvas.width = 1200;
canvas.height = 900;
const ctx = canvas.getContext("2d");
/*******************DEVELOPMENT ROADMAP*******************/

/*********************FEATURES ADDED*********************/
// Dessiner le paddle (un rectangle plein) ; OK
// Gérer les mouvements du paddle (de gauche à droite, et en empêchant qu'il ne sorte du canvas) ; OK
// Dessiner la balle (elle est ronde, à l'évidence, et pleine) ; OK

// Créer les mouvements de la balle (doit rebondir contre toutes les paroies sauf celle du bas, et doit également rebondir contre le paddle) ; OK

// Dessiner les briques (on utilisera pour cela un tableau à deux dimensions - lignes et colonnes. Il y aura 10 colonnes et 7 lignes, soit 70 briques) ; OK

// Gérer les collisions (entre la balle et le paddle et entre la balle et les briques) ; OK

// Créer les conditions de victoire (si toutes les briques ont été détruites) et de défaite (si la balle tombe derrière le paddle) ; OK

/*******************FEATURES TO BE ADDED*******************/
// Dessiner l'image du score ;
// Créer la boîte de dialogue qui s'ouvre pour recommencer la partie ou télécharger le CV en cas de victoire OU en cas de GAME OVER;
// Créer un bouton START qui apparaîtra avant le lancement du jeu et qui lancera le jeu (les contrôles du jeu seront expliqués dans cette boîte de dialogue, en dessous du message START);
// Ajouter l'image de fond qui comprend mes différentes compétences ; cette image sera placée derrière le mur de briques ;
// Ajouter l'image de background pour le gameCanvas ;

/**********************BONUS FEATURES**********************/
// Implémenter les fonctionnalités des bulles rouges et bleues (optionnel);
// Implémenter la vectorisation des trajectoires de la balle (optionnel);

/*****************************************************************/

let canvasPadding = 10;
let paddleImg = new Image();
paddleImg.src = "images/wooden-paddle.png";
let brickImg = new Image();
brickImg.src = "images/one-yellow-brick-130-52.png";
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
let restartDiv = document.getElementById("end");

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
  paddle.width = 97;
  paddle.height = 13;
  paddle.posX = (canvas.width - paddle.width) * 0.5;
  paddle.posY = canvas.height - paddle.height - canvasPadding * 3;
  paddle.velX = 5;
  return paddle;
  // Used to create gamePaddle;
}

function createBall() {
  let ball = {};
  ball.radius = 15;
  ball.dirX = (Math.random() - 0.5) * 5;
  ball.dirY = -3;
  ball.posX = gamePaddle.posX + gamePaddle.width / 2;
  ball.posY = gamePaddle.posY - ball.radius + 1;
  return ball;
  // Used to create gameBall;
}

function createBrickwall() {
  let brickwall = {};
  // brickwall.rowCount = 1;
  // brickwall.colCount = 1;
  brickwall.rowCount = 6;
  brickwall.colCount = 9;
  brickwall.bricksArray = [];
  return brickwall;
  // Used to create gameBrickwall;
}

function createBricks(brickwallObject) {
  let brick = {};
  brick.width = 130;
  brick.height = 52;
  brick.padding = 3;
  brick.posX = 0;
  brick.posY = 0;
  brick.offsetTop = 50;
  brick.offsetLeft =
    (canvas.width - (brick.width + brick.padding) * brickwallObject.colCount) /
      2 +
    brick.padding / 2;
  return brick;
  // Used to create gameBrick;
}

function createBubbles(color) {
  const bubble = {};
  bubble.radius = Math.random() * 20 + 10;
  bubble.x = Math.random() * (canvas.width - bubble.radius * 2) + bubble.radius;
  bubble.y =
    Math.random() * (canvas.height - bubble.radius * 2) + bubble.radius;
  bubble.speedX = (Math.random() - 0.5) * 8;
  bubble.speedY = (Math.random() - 0.5) * 8;
  bubble.maxRadius = Math.random() * 99 + 25;
  bubble.state = true;

  bubble.draw = function () {
    if (bubble.state === true) {
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
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
  // Used to create all the bubbles, draw them and make them move on the screen;
}

(function drawBubbles() {
  for (let i = 0; i < 5; i++) {
    speedBubblesArray.push(createBubbles("red"));
  }
  for (let j = 0; j < 5; j++) {
    slowBubblesArray.push(createBubbles("blue"));
  }
})();

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
  // ctx.beginPath();
  // ctx.rect(
  //   paddleObject.posX,
  //   paddleObject.posY,
  //   paddleObject.width,
  //   paddleObject.height
  // );
  // ctx.fillStyle = "#A68D72";
  // ctx.fill();
  // ctx.closePath();
}

function drawBall(ballObject) {
  ctx.beginPath();
  ctx.arc(ballObject.posX, ballObject.posY, ballObject.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#6294A6";
  ctx.fill();
  ctx.closePath();
}

/* Code snippet found at https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Build_the_brick_field
I couldn't find any way around this. Trying to insert this snippet somewhere inside my code was extremely troublesome because the bricksArray, if defined as a property of the object gameBrickwall, wouldn't be accessible from the global scope, therefore causing issues. */
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
  slowBubblesArray.forEach((blueBubble) => {
    blueBubble.draw();
    blueBubble.move();
  });
  speedBubblesArray.forEach((redBubble) => {
    redBubble.draw();
    redBubble.move();
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
        score += 1;
      }
    }
  }
}

// Fonctions pour définir la victoire ou la défaite ainsi que le score

function checkWinOrLose(ballObject, brickwallObject, paddleObject) {
  if (score === brickwallObject.rowCount * brickwallObject.colCount) {
    let questionWin = confirm(
      `Bravo ! You win! 您赢了! Recommencer ? Restart ? 重新开始吗？Appuyez sur "Annuler" pour télécharger mon CV. Press "Cancel" to download my resume. 请点击“取消”下载我的简历。 `
    );
    if (questionWin) {
      window.location.reload();
    }
  }
  // else if (
  //   ballObject.posY + ballObject.radius >
  //   paddleObject.posY + paddleObject.height
  // ) {
  //   let questionLose = confirm(
  //     `Perdu. You lose. 您输了。Recommencer ? Restart ? 重新开始吗？Appuyez sur "Annuler" pour télécharger mon CV. Press "Cancel" to download my resume. 请点击“取消”下载我的简历。 `
  //   );
  //   if (question) {
  //     window.location.reload();
  //   }
  //  else {
  //   window.location = "resume.html";
  // }
  // }
}

function startGame() {
  requestAnimationFrame(startGame);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  checkWinOrLose(gameBall, gameBrickwall, gamePaddle);
  drawBrickwall(gameBrickwall, gameBrick);
  drawPaddle(gamePaddle);
  drawBall(gameBall);
  movePaddle(gamePaddle);
  moveBall(gameBall);
  moveBubbles();
  ballPaddleCollision(gameBall, gamePaddle);
  ballBrickCollision(gameBall, gameBrick, gameBrickwall);
}
startGame();
// setInterval(startGame, 1000); // Utilisé pour vérifier certains paramètres et éviter que l'ordinateur ne s'emballe si (quand...) il y a une couille.
