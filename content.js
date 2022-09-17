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

var sprites = [];
var spritesLoaded = 0;
function onSpirteLoad() {
    spritesLoaded++;
    if (spritesLoaded >= characters.length) {
        // start once everything is loaded
        setInterval(animationLoop, FRAME_RATE_MS);
    }
}

characters.forEach((sprite) => {
    sprites.push(new Image());
    sprites[sprites.length - 1].src = chrome.runtime.getURL(sprite.source);
    sprites[sprites.length - 1].onload = onSpirteLoad;
});

var currentSprites = [sprites[0]];

const context = canvas.getContext("2d");

function moveSprite(current) {
    if (current.x != current.targetX) {
        current.x += current.rateX;

        // cap if went past target
        // assumes rateX is not going the wrong direction
        if (current.rateX > 0) {
            current.x = Math.min(current.x, current.targetX);
        } else if (current.rateX < 0) {
            current.x = Math.max(current.x, current.targetX);
        }
    }
    if (current.y != current.targetY) {
        current.y += current.rateY;

        if (current.rateY > 0) {
            current.y = Math.min(current.y, current.targetY);
        } else if (current.rateY < 0) {
            current.y = Math.max(current.y, current.targetY);
        }
    }
}

function renderSprite() {
    // Note: if 2 or more sprites are on the same pixel,
    // the last in the array will be rendered last and seen over the other ones #PaintersAlgorithm
    characters.forEach((sprite) => {
        if (sprite.current.spriteIndex == -1) { return; }
        assert(sprite.current.spriteIndex < currentSprites.length, "bad spirit length of " + sprite.current.spriteIndex + " for " + sprite.name);

        moveSprite(sprite.current);

        let animation = sprite.animations[sprite.current.animation];
        if (sprite.current.frameCount >= animation.steps[sprite.current.stepCount]) {
            sprite.current.stepCount++;
            if (sprite.current.stepCount >= animation.steps.length) {
                sprite.current.stepCount = 0;
            }
            sprite.current.frameCount = 0;
        } else {
            sprite.current.frameCount++;
        }

        // Draw character in top left corner
        context.drawImage(
            currentSprites[sprite.current.spriteIndex],
            sprite.width * sprite.current.stepCount, // src X
            sprite.height * animation.row, // src Y
            sprite.width, // src width
            sprite.height, // src height
            sprite.current.x, // dst X
            sprite.current.y, // dst Y
            sprite.current.width, // dst width
            sprite.current.height); // dst hight
    });
}

function animationLoop() {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  renderSprite();
}