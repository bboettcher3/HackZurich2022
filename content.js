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
function onSpriteLoad() {
    spritesLoaded++;
    if (spritesLoaded >= characters.length) {
        // start once everything is loaded
        setInterval(animationLoop, FRAME_RATE_MS);
        setInterval(timerCallback, 2000); // every 2 second
    }
}

characters.forEach((sprite) => {
    sprites.push(new Image());
    sprites[sprites.length - 1].src = chrome.runtime.getURL(sprite.source);
    sprites[sprites.length - 1].onload = onSpriteLoad;
});

var currentSprites = [sprites[0], sprites[1]];

const context = canvas.getContext("2d");

// more readable name
function isFacingRight(sprite) {
    return sprite.animations[sprite.current.animation].face > 0
}

function setNewAnimation(current, newAnimation, targetX, targetY, task="") {
    current.animation = newAnimation;
    current.frameCount = 0;
    current.stepCount = 0;
    current.targetX = targetX;
    current.targetY = targetY;
    if (task != "") {
        current.task = task;
    }
}

function moveSprite(sprite) {
    if (!sprite.current.animation.startsWith("walk_")) return;
    if (sprite.current.x != sprite.current.targetX) {
        // cap if went past target
        if (isFacingRight(sprite)) {
            sprite.current.x += sprite.animations[sprite.current.animation].rate;
            sprite.current.x = Math.min(sprite.current.x, sprite.current.targetX);
        } else {
            sprite.current.x -= sprite.animations[sprite.current.animation].rate;
            sprite.current.x = Math.max(sprite.current.x, sprite.current.targetX);
        }
    }
    if (sprite.current.y != sprite.current.targetY) {
        if (sprite.current.targetY > sprite.current.Y) {
            sprite.current.y += sprite.animations[sprite.current.animation].rate;
            sprite.current.y = Math.min(sprite.current.y, sprite.current.targetY);
        } else {
            sprite.current.y -= sprite.animations[sprite.current.animation].rate;
            sprite.current.y = Math.max(sprite.current.y, sprite.current.targetY);
        }
    }
}

function updateTarget(sprite) {
    if (sprite.name == "frog") {
        // simple logic to have it go back and forth with hardcoded target
        if (sprite.current.animation.startsWith("walk_")) {
            if (sprite.current.x == sprite.current.targetX) {
                // Done walking, do next task
                if (sprite.current.task.startsWith("walk_")) {
                    // Flip pacing if going from walk to walk
                    // This is because drawImage() can't do a fast mirror/flip draw
                    setNewAnimation(sprite.current, sprite.animations[sprite.current.animation].flip,
                        (sprite.current.targetX == 0) ? sprite.current.idleX + 100 : sprite.current.idleX,
                        sprite.current.idleY, sprite.current.animation);
                } else {
                    // Perform non-walking task
                    setNewAnimation(sprite.current, sprite.current.task, sprite.current.x, sprite.current.y);
                }
            }
        } else if (sprite.current.animation.startsWith("bump_")) {
            // done with bump
            if (sprite.current.stepCount == sprite.animations[sprite.current.animation].steps.length - 1) {
                // Just walk left every time after getting bumped and resume pacing
                setNewAnimation(sprite.current, "walk_left", sprite.current.idleX, sprite.current.idleY, "walk_right");
                enableScroll();
                // todo - make better to prevent loop
                scroll(window.scrollX, sprite.current.y - 1);
                sprite.current.bumped = true;
            }
        } else if (sprite.current.animation.startsWith("click_")) {
            // done with click
            if (sprite.current.stepCount == sprite.animations[sprite.current.animation].steps.length - 1) {
                setNewAnimation(sprite.current, "walk_left", sprite.current.idleX, sprite.current.idleY, "walk_right");
                // TODO: open link

            }
        } else if (sprite.current.animation.startsWith("sleep_")) {
            // done with sleep
            if (sprite.current.stepCount == sprite.animations[sprite.current.animation].steps.length - 1) {
                setNewAnimation(sprite.current, "walk_left", sprite.current.idleX, sprite.current.idleY, "walk_right");
            }
        }
    }
}

function renderSprite() {
    // Note: if 2 or more sprites are on the same pixel,
    // the last in the array will be rendered last and seen over the other ones #PaintersAlgorithm
    characters.forEach((sprite) => {
        if (sprite.current.spriteIndex == -1) { return; }
        assert(sprite.current.spriteIndex < currentSprites.length, "bad spirit length of " + sprite.current.spriteIndex + " for " + sprite.name);

        moveSprite(sprite);
        updateTarget(sprite);

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