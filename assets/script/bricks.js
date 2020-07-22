import { canvas, ctx, bricksArray, brickImg } from "./game.js";

export function createBrickwall() {
  let brickwall = {};
  brickwall.rowCount = 6;
  brickwall.colCount = 2;

  if (canvas.width >= 1700) {
    brickwall.colCount = 10;
    brickwall.rowCount = 6;
  } else if (canvas.width >= 1400 && canvas.width < 1700) {
    brickwall.colCount = 9;
    brickwall.rowCount = 6;
  } else if (canvas.width >= 1200 && canvas.width < 1400) {
    brickwall.colCount = 7;
    brickwall.rowCount = 6;
  } else if (canvas.width >= 992 && canvas.width < 1200) {
    brickwall.colCount = 6;
    brickwall.rowCount = 6;
  } else if (canvas.width < 992 && canvas.width >= 854) {
    brickwall.colCount = 5;
    brickwall.rowCount = 6;
  } else if (canvas.width < 854 && canvas.width >= 690) {
    brickwall.colCount = 4;
    brickwall.rowCount = 6;
  } else if (canvas.width < 690 && canvas.width >= 560) {
    brickwall.colCount = 3;
    brickwall.rowCount = 6;
  }
  return brickwall;
  // Used to create gameBrickwall;
}

export function createBricks(brickwallObject) {
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

export function defineBrickwall(brickwallObject) {
  for (let r = 0; r < brickwallObject.rowCount; r++) {
    bricksArray[r] = [];
    for (let c = 0; c < brickwallObject.colCount; c++) {
      bricksArray[r][c] = {
        x: 0,
        y: 0,
        state: true,
      };
    }
  }
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
