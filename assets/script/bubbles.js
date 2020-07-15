export function bubbleFactory() {
  const bubble = {};
  bubble.radius = Math.random() * 20 + 10;
  bubble.x = Math.random() * (canvas.width - bubble.radius * 2) + bubble.radius;
  bubble.y =
    Math.random() * (canvas.height - bubble.radius * 2) + bubble.radius;
  bubble.speedX = (Math.random() - 0.5) * 8;
  bubble.speedY = (Math.random() - 0.5) * 8;
  bubble.maxRadius = Math.random() * 99 + 25;
  bubble.draw = function () {
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
    ctx.fill();
  };
  bubble.move = function () {
    if (
      bubble.x + bubble.radius >= canvas.width ||
      bubble.x - bubble.radius <= 0
    ) {
      bubble.speedX = -bubble.speedX;
    }
    if (
      bubble.y + bubble.radius >= canvas.height ||
      bubble.y - bubble.radius <= 0
    ) {
      bubble.speedY = -bubble.speedY;
    }
    bubble.x += bubble.speedX;
    bubble.y += bubble.speedY;
  };
  return bubble;
}

export function addBubbles() {
  for (let i = 0; i < 33; i++) {
    bubblesArray.push(bubbleFactory());
    bubblesArray[i].draw();
  }
}
