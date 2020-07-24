import { canvas, ctx, bubblesArray, gameBall, spaceBar } from "./main.js";
import { poppingSound } from "./sounds.js";

export function createBubbles(color1, color2) {
  const bubble = {};
  bubble.radius = Math.random() * 20 + 15;
  bubble.posX =
    Math.random() * (canvas.width - bubble.radius * 2) + bubble.radius;
  bubble.posY =
    Math.random() * (canvas.height - bubble.radius * 2) + bubble.radius;
  bubble.dirX = (Math.random() - 0.5) * 3;
  bubble.dirY = (Math.random() - 0.5) * 3;
  bubble.minRadius = bubble.radius;
  bubble.maxRadius = bubble.radius + Math.floor(Math.random() * 66 + 33);
  bubble.color = `rgba(${color1})`;
  bubble.state = true;

  bubble.draw = function () {
    if (bubble.state === true) {
      ctx.beginPath();
      ctx.arc(bubble.posX, bubble.posY, bubble.radius, 0, Math.PI * 2);
      ctx.fillStyle = bubble.color;
      ctx.fill();
    }
  };

  bubble.move = function () {
    if (
      bubble.posX + bubble.radius > canvas.width ||
      bubble.posX - bubble.radius < 0
    ) {
      bubble.dirX *= -1;
    }

    if (
      bubble.posY + bubble.radius > canvas.height ||
      bubble.posY - bubble.radius < 0
    ) {
      bubble.dirY *= -1;
    }
    bubble.posX += bubble.dirX;
    bubble.posY += bubble.dirY;
  };

  bubble.grow = function (ballObject) {
    let distX = bubble.posX - ballObject.posX;
    let distY = bubble.posY - ballObject.posY;
    let distArea = Math.sqrt(distX * distX + distY * distY);
	if (spaceBar) {  
      if (distArea < bubble.radius + ballObject.radius) {
        if (bubble.radius < bubble.maxRadius) {
          bubble.radius += 2;
          bubble.color = `rgba(${color2})`;
        }
      } else if (distArea > bubble.radius + ballObject.radius) {
        if (bubble.radius > bubble.minRadius) {
          bubble.radius -= 0.5;
          bubble.color = `rgba(${color1})`;
        }
      }
    }

    bubble.remove = function () {
      if (bubble.radius >= bubble.maxRadius && bubble.state === true) {
        poppingSound();
        bubble.state = false;
      }
    };
  };

  return bubble;
  // Used to create all the bubbles, draw them and make them move on the screen;
}

export function drawBubbles() {
  for (let i = 0; i < 20; i++) {
    if (bubblesArray.length < 20) {
      bubblesArray.push(
        createBubbles("98, 148, 166, 0.5", "191, 229, 242, 0.7")
        // createBubbles("98, 148, 166, 0.5", "242, 242, 242, 0.7")
      );
    }
  }
}

export function moveBubbles() {
  bubblesArray.forEach((bubble) => {
    bubble.draw();
    bubble.move();
    bubble.grow(gameBall);
    bubble.remove();
  });
}
