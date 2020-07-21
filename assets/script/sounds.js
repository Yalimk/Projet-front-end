export function breakingSound() {
  let brickSound = document.createElement("audio");
  brickSound.src = "./sounds/impact.mp3";
  brickSound.play();
}

export function poppingSound() {
  let bubbleSound = document.createElement("audio");
  bubbleSound.src = "./sounds/bubble.mp3";
  bubbleSound.play();
}

export function winningSound() {
  if (winSound.state === true) {
    winSound.play();
  }
}

export function losingSound() {
  if (loseSound.state === true) {
    loseSound.play();
  }
}
