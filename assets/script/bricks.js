export function createBrickwall() {
  let brickwall = {};
  brickwall.rowCount = 6;
  brickwall.colCount = 5;
  return brickwall;
  // Used to create gameBrickwall;
}

export function createBricks(brickwallObject) {
  let brick = {};
  brick.width = 130;
  brick.height = 52;
  brick.padding = 1;
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

export function drawBrickwall(brickwallObject, brickObject) {
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
