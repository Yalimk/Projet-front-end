/*******************DEVELOPMENT ROADMAP*******************/

/*********************FEATURES ADDED*********************/
// Dessiner le paddle (un rectangle plein) ; OK

// Gérer les mouvements du paddle (de gauche à droite, et en empêchant qu'il ne sorte du canvas) ; OK

// Dessiner la balle (elle est ronde, à l'évidence, et pleine) ; OK

// Créer les mouvements de la balle (doit rebondir contre toutes les paroies sauf celle du bas, et doit également rebondir contre le paddle) ; OK

// Dessiner les briques (on utilisera pour cela un tableau à deux dimensions - lignes et colonnes. Il y aura 10 colonnes et 7 lignes, soit 70 briques) ; OK

// Gérer les collisions (entre la balle et le paddle et entre la balle et les briques) ; OK

// Télécharger une image pour le paddle (optionnel); OK

// Télécharger une image pour les briques (optionnel); OK

// Créer les conditions de victoire (si toutes les briques ont été détruites) et de défaite (si la balle tombe derrière le paddle) ; OK

// Dessiner le score et implémenter sa fonctionnalité; OK

// Créer la boîte de dialogue qui s'ouvre pour recommencer la partie ou télécharger le CV en cas de victoire OU en cas de GAME OVER; OK

// Ajouter l'image de fond qui comprend mes différentes compétences ; cette image sera placée derrière le mur de briques ; OK

// Ajouter un bouton de téléchargement dans la page index pour permettre le téléchargement du CV sans passer par le jeu; OK

// Implémenter des effets sonores (optionnel); OK

/*******************FEATURES TO BE ADDED*******************/
// Créer les pages web dans lesquelles sera implémenté le jeu;

/**********************BONUS FEATURES**********************/
// Implémenter les fonctionnalités des bulles rouges et bleues (optionnel);
// Implémenter les changements de trajectoire de l'axe X de la balle si elle touche un côté des briques (optionnel); je laisse tomber cette fonctionnalité bonus ; trop casse-tête.

/*****************************************************************/
// Canvas definition
const canvas = document.getElementById("gameCanvas");
canvas.width = 900;
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
let rightArrow = false;
let leftArrow = false;
let spaceBar = false;
let score = 0;

// Interface elements
let winDiv = document.getElementById("winDiv");
let loseDiv = document.getElementById("loseDiv");
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

window.addEventListener("mousemove", (event) => {
  // console.log(event.clientX, event.clientY);
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

// Les fonctions créatrices d'objet :

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
  ball.radius = 12;
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
  brickwall.colCount = 5;
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
      ctx.fillStyle = `rgba(${color})`;
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

  bubble.grow = function () {};
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
  ctx.fillStyle = "#4E94BF";
  ctx.fill();
  ctx.closePath();
}

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
  ctx.fillStyle = "#cdd973";
  ctx.fillText(`Score: ${score}`, canvas.width - 180, 40);
}

(function drawBubbles() {
  for (let i = 0; i < 20; i++) {
    bubblesArray.push(createBubbles("187, 217, 78, 0.3"));
  }
})();

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
    ballObject.posY + ballObject.radius > paddleObject.posY
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
  brickSound.src = "./sounds/brickdrop.mp3";
  brickSound.play();
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
    winDiv.style.display = "flex";
    ballObject.dirY = 0;
    ballObject.dirX = 0;
    paddleObject.posX = undefined;
    winningSound();
    winSound.state = false;
  }
  if (ballObject.posY > paddleObject.posY) {
    ballObject.dirY = 0;
    ballObject.dirX = 0;
    loseDiv.style.display = "flex";
    paddleObject.posX = undefined;
    losingSound();
    loseSound.state = false;
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
