// Create HTML5 canvas
const canvas = document.createElement('canvas');
canvas.id = "pixel-peeps-canvas";
canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

// These should load fast enough locally to not worry about checking for onLoad() right now
const audio = new Audio(chrome.runtime.getURL("audio/drop.mp3"));
const GRAFFITI_SIZE = 256;
const graffitiImagesSrc = [
    // assumed to be 256x256
    ["images/graffiti_1_half.png", "images/graffiti_1_full.png"],
    ["images/graffiti_2_half.png", "images/graffiti_2_full.png"]
]
var graffitiIndex = 0;
var graffitiElement = {};
// load the images up once
var graffitiImages = [];
graffitiImagesSrc.forEach((imagesSrc) => {
    images = [];
    imagesSrc.forEach((imageSrc) => {
        images.push(new Image());
        images[images.length - 1].src = chrome.runtime.getURL(imageSrc);
    });
    graffitiImages.push(images);
});
var extraDrawImages = [];

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
        if (sprite.current.targetY > sprite.current.y) {
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
        var lastStep = sprite.current.stepCount == sprite.animations[sprite.current.animation].steps.length - 1;
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
            if (lastStep) {
                // Just walk left every time after getting bumped and resume pacing
                setNewAnimation(sprite.current, "walk_left", sprite.current.idleX, sprite.current.idleY, "walk_right");
                enableScroll();
                // todo - make better to prevent loop
                scroll(window.scrollX, sprite.current.y - 1);
                sprite.current.bumped = true;
            }
        } else if (sprite.current.animation.startsWith("click_")) {
            // done with click
            if (lastStep) {
                setNewAnimation(sprite.current, "walk_left", sprite.current.idleX, sprite.current.idleY, "walk_right");
                console.log(linkToClick);
                chrome.runtime.sendMessage({url: linkToClick}, function(response) {});
                linkToClick = "";
            }
        } else if (sprite.current.animation.startsWith("sleep_")) {
            // done with sleep
            if (lastStep) {
                setNewAnimation(sprite.current, "walk_left", sprite.current.idleX, sprite.current.idleY, "walk_right");
            }
        } else if (sprite.current.animation.startsWith("dj_")) {
            // done with audio clip
            if (audio.paused) {
                setNewAnimation(sprite.current, "walk_left", sprite.current.idleX, sprite.current.idleY, "walk_right");
            }
        } else if (sprite.current.animation.startsWith("erase_")) {
            // done with erasing
            if (lastStep) {
                setNewAnimation(sprite.current, "walk_left", sprite.current.idleX, sprite.current.idleY, "walk_right");
                var hiddenElement = document.getElementById("toBeHidden");
                hiddenElement.removeAttribute("id");
                hiddenElement.setAttribute("style", "visibility: hidden;");
            }
        } else if (sprite.current.animation.startsWith("spray_")) {
            let halfWay = sprite.current.stepCount == 10;
            // done with erasing
            if (halfWay) {
                extraDrawImages.push({
                    image : graffitiImages[graffitiIndex][0],
                    sx : 0,
                    sy : 0,
                    sWidth : GRAFFITI_SIZE,
                    sHeight : GRAFFITI_SIZE,
                    dx : (graffitiElement.getBoundingClientRect().left + window.scrollX) + 10, // not sure why X offset only is needed
                    dy : (graffitiElement.getBoundingClientRect().top + window.scrollY),
                    dWidth : graffitiElement.width,
                    dHeight : graffitiElement.height
                })
            } else if (lastStep) {
                extraDrawImages[extraDrawImages.length - 1].image = graffitiImages[graffitiIndex][1];
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

  // Draw extra images first so sprites are on top
  for (let i = 0; i < extraDrawImages.length; i++) {
    context.drawImage(
        extraDrawImages[i].image,
        extraDrawImages[i].sx,
        extraDrawImages[i].sy,
        extraDrawImages[i].sWidth,
        extraDrawImages[i].sHeight,
        extraDrawImages[i].dx,
        extraDrawImages[i].dy,
        extraDrawImages[i].dWidth,
        extraDrawImages[i].dHeight);
  }

  renderSprite();
}