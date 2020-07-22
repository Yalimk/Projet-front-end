import { canvas, ctx, paddleImg } from "./game.js";
import { spaceBarCollisions } from "./collisions.js";
let rightArrow = false;
let leftArrow = false;

export function createPaddle() {
  let paddle = {};
  paddle.width = 97;
  paddle.height = 14;
  paddle.posX = (canvas.width - paddle.width) * 0.5;
  paddle.posY = canvas.height - paddle.height - 30;
  paddle.velX = 5;
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
  if (spaceBarCollisions) {
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
