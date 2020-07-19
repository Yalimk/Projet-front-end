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
      ctx.fillStyle = `rgba(${color}, 0.3)`;
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

export function drawBubbles() {
  for (let i = 0; i < 10; i++) {
    speedBubblesArray.push(createBubbles("217, 68, 54"));
  }
  for (let j = 0; j < 10; j++) {
    slowBubblesArray.push(createBubbles("83, 126, 255"));
  }
}

export function moveBubbles() {
  slowBubblesArray.forEach((blueBubble) => {
    blueBubble.draw();
    blueBubble.move();
  });
  speedBubblesArray.forEach((redBubble) => {
    redBubble.draw();
    redBubble.move();
  });
}
