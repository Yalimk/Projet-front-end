export function drawSkills() {
  ctx.beginPath();
  ctx.drawImage(skills, canvas.width / 2 - 183, 63, 366, 305);
  ctx.globalCompositeOperation = "destination-over";
}

export function drawScore() {
  ctx.font = "40px Helvetica, Arial, sans-serif";
  ctx.fillStyle = "#5FA0D9";
  ctx.fillText(`Score: ${score}`, canvas.width - 180, 40);
}
