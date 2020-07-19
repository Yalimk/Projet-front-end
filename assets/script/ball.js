export function createBall() {
  let ball = {};
  ball.radius = 10;
  ball.dirX = (Math.random() - 0.5) * 5;
  ball.dirY = -3;
  ball.posX = gamePaddle.posX + gamePaddle.width / 2;
  ball.posY = gamePaddle.posY - ball.radius;
  return ball;
  // Used to create gameBall;
}

export function drawBall(ballObject) {
  ctx.beginPath();
  ctx.arc(ballObject.posX, ballObject.posY, ballObject.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#6294A6";
  ctx.fill();
  ctx.closePath();
}

export function moveBall(ballObject) {
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
