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

const FRAME_RATE_MS = 300;

const characters = ["bunny", "frog"];
const animationSuffixes = ["back", "front", "left", "right", "turn_left", "turn_right"];
var CHARACTER = characters[0];
var curAnimFrame = 1; // Start facing front

setInterval(anim, FRAME_RATE_MS);

function anim() {

  const context = canvas.getContext("2d");
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

  // Cycle through animation frames
  curAnimFrame = (curAnimFrame + 1) % animationSuffixes.length;

  // Draw character in top left corner
  let drawing = new Image();
  drawing.src = chrome.runtime.getURL("images/" + CHARACTER + "/" 
    + CHARACTER + "_" + animationSuffixes[curAnimFrame] + ".png");
  drawing.onload = function() {
    context.drawImage(drawing, 10, 10);
  };

}