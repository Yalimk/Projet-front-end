export function createPaddle() {
  let paddle = {};
  paddle.width = 97;
  paddle.height = 14;
  paddle.posX = (canvas.width - paddle.width) * 0.5;
  paddle.posY = canvas.height - paddle.height - 30;
  paddle.velX = 3;
  return paddle;
  // Used to create gamePaddle;
}

export function drawPaddle(paddleObject) {
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

export function movePaddle(paddleObject) {
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
