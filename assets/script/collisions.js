/*
In the code below, I used the help of MDN in order to solve a bug that I had. I used to say that when a brick is hit, it's state becomes false and it's x and y coordinates become 0. However, I later found out that this caused a bug that made the score be exponentially incremented everytime the ball would hit the upper edge of the canvas between positions {x: 0, y: 0} and something like {x: 100, y:0} (I realized this was due to the fact that the bricks were not removed from the canvas, but placed at {x:0, y:0} of the canvas while still retaining their width. The more bricks the ball "destroyed", the more the score was incremented). Removing the lines that changed the coordinates of the bricks and adding a conditional statement before drawing the bricks, saying that they shouldn't exist on the canvas if their status is not true, solved the problem.
*/

export function ballBrickCollision(ballObject, brickObject, brickwallObject) {
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
          // ballObject.dirX *= Math.random()
          bricks.state = false;
          score++;
        }
      }
    }
  }
}

export function ballPaddleCollision(ballObject, paddleObject) {
  if (
    ballObject.posX + ballObject.radius > paddleObject.posX &&
    ballObject.posX - ballObject.radius <
      paddleObject.posX + paddleObject.width &&
    ballObject.posY + ballObject.radius > paddleObject.posY &&
    ballObject.posY + ballObject.radius <
      paddleObject.posY + paddleObject.height
  ) {
    ballObject.dirY *= -1;
    if (
      (ballObject.posX + ballObject.radius > paddleObject.posX &&
        ballObject.posX + ballObject.radius <
          paddleObject.posX + paddleObject.width / 2 &&
        ballObject.dirX > 0) ||
      (ballObject.posX - ballObject.radius <
        paddleObject.posX + paddleObject.width &&
        ballObject.posX - ballObject.radius >
          paddleObject.posX + paddleObject.width / 2 &&
        ballObject.dirX < 0)
    ) {
      ballObject.dirX *= -1;
    }
  }
}
