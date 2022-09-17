// Create HTML5 canvas
const canvas = document.createElement('canvas');
canvas.id = "pixel-peeps-canvas";
canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;


// TODO: Mouse following/interaction
const cursor = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

addEventListener("mousemove", (e) => {
  cursor.x = e.clientX;
  cursor.y = e.clientY;
});

// Add canvas to body
document.body.appendChild(canvas);

const FRAME_RATE_MS = 33; // 30 FPS

var currentCharacter = characters[0];
var currentAnimation = "spin";
var currentStep = 0;
var frameCount = 0;

var drawing = new Image();
drawing.src = chrome.runtime.getURL(currentCharacter.source);
drawing.onload = function() {
    // start once everything is loaded
    setInterval(anim, FRAME_RATE_MS);
};

function anim() {
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

  let animation = currentCharacter.animations[currentAnimation];
  if (frameCount >= animation.steps[currentStep]) {
      currentStep++;
      if (currentStep >= animation.count) {
        currentStep = 0;
      }
      frameCount = 0;
  } else {
    frameCount++;
  }

  // Draw character in top left corner
  sx = 128 * currentStep;
  sy = 0;
  sWidth = currentCharacter.width;
  sHeight = currentCharacter.height;
  dx = 0;
  dy = 0;
  dWidth = currentCharacter.width;
  dHeight = currentCharacter.height;
  context.drawImage(drawing, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
}