// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; }
  }));
} catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
var linkToClick = "";
var followMouse = false;
var followingStartTime = 0;
const FOLLOW_LENGTH_SEC = 10;

function disableScroll() {
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

function enableScroll() {
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
  window.removeEventListener('touchmove', preventDefault, wheelOpt);
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}

window.onscroll = function() {
    // characters[0] hardcoded to Frog
    let current = characters[0].current;
    if (current.bumped == false && current.y < window.scrollY) {
        disableScroll();
        scroll(window.scrollX, current.y);
        setNewAnimation(current, isFacingRight(characters[0]) ? "bump_right" : "bump_left");
        // stop moving
        current.targetX = current.x;
        current.targetY = current.y;
    }
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.request.menuItemId == "link_click") {
        var l = document.links;
        var closestX = 0;
        var closestY = 0;
        var closestDistance = Infinity;
        var currentPosition = [characters[0].current.x, characters[0].current.y];
        // Find closest link match to character
        for (var i = l.length - 1; i >= 0; i--) {
            if (l[i].href == request.request.linkUrl) {
                // some URLs are not being displayed and we don't want
                if (l[i].getBoundingClientRect().left == 0 || l[i].getBoundingClientRect().top == 0) {continue;}

                var a = currentPosition[0] - (l[i].getBoundingClientRect().left + window.scrollX);
                var b = currentPosition[1] - (l[i].getBoundingClientRect().top + window.scrollY);
                var distance = Math.hypot(a,b);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestX = l[i].getBoundingClientRect().left + window.scrollX;
                    closestY = l[i].getBoundingClientRect().top + window.scrollY;
                }
            }
        }
        if (closestDistance != Infinity) {
            linkToClick = request.request.linkUrl;
            console.log("link found with position: " + closestX + ", " + closestY);
            const direction = (currentPosition[0] < closestX) ? "right" : "left";
            // half the height since finger is in middle of body
            let fingerOffset = characters[0].current.height * .55;
            setNewAnimation(characters[0].current, "walk_" + direction, closestX - fingerOffset, closestY - fingerOffset, "click_" + direction);
            characters[0].current.special = "linkClick";
        }
    } else  if (request.request.menuItemId == "sleep") {
        const sleepAnim = isFacingRight(characters[0]) ? "sleep_right" : "sleep_left";
        setNewAnimation(characters[0].current, sleepAnim,
            characters[0].current.x, characters[0].current.y, "walk_left");
    } else if (request.request.menuItemId == "follow") {
        followMouse = true;
        followingStartTime = (new Date()).getTime();
    } else if (request.request.menuItemId == "dj") {
        audio.play();
        setNewAnimation(characters[0].current, "dj_right",
            characters[0].current.x, characters[0].current.y, "walk_left");
    } else if (request.request.menuItemId == "graffiti") {
        // find the image
        for(i = 0; i < document.getElementsByTagName("img").length; i++) {
            if (document.getElementsByTagName("img")[i].src == request.request.srcUrl) {
                graffitiElement = document.getElementsByTagName("img")[i];
                graffitiIndex = Math.floor(Math.random() * graffitiImagesSrc.length);
                let x = graffitiElement.getBoundingClientRect().left + window.scrollX;
                let y = graffitiElement.getBoundingClientRect().top + window.scrollY;
                const direction = (characters[0].current.x < x) ? "walk_right" : "walk_left";
                setNewAnimation(characters[0].current, direction, x, y, "spray_right");
                break;
            }
        }
    } else if (request.request.menuItemId == "hide") {
        var elements = document.getElementsByTagName("p");
        var closestElements = undefined;
        var closestY = 0;
        var closestDistance = Infinity;
        // Find closest link match to character
        for (let i = elements.length - 1; i >= 0; i--) {
            // some URLs are not being displayed and we don't want
            if (elements[i].getBoundingClientRect().top <= 0) {continue;}
            let elementY = elements[i].getBoundingClientRect().top + window.scrollY;
            let y = Math.abs(characters[0].current.y - elementY);
            if (y < closestDistance) {
                closestDistance = y;
                closestY = elementY;
                closestElements = elements[i];
            }
        }
        if (closestDistance == Infinity) { return; }

        let firstTag = closestElements.innerHTML.indexOf("<a");
        let firstNonLinkWords = closestElements.innerHTML.substring(0, firstTag);
        let words = firstNonLinkWords.split(" ");
        // not the first word, too easy
        for (let i = 1; i < words.length; i++) {
            // nothing too short
            if (words[i].length > 4) {
                firstNonLinkWords = firstNonLinkWords.replace(words[i], "<span id='toBeHidden'>" + words[i] + "</span>");
                break;
            }
        }
        closestElements.innerHTML = firstNonLinkWords + closestElements.innerHTML.substr(firstTag);
        var hiddenElement = document.getElementById("toBeHidden");
        if (hiddenElement) {
            let x = hiddenElement.getBoundingClientRect().left + window.scrollX;
            let y = hiddenElement.getBoundingClientRect().top + window.scrollY;
            let fingerOffset = characters[0].current.height * .45;
            setNewAnimation(characters[0].current, "walk_right", x - fingerOffset, y - fingerOffset, "erase_right");
        }
    }
});

function timerCallback() {
    if (followMouse) {
        if ((new Date()).getTime() - followingStartTime > (FOLLOW_LENGTH_SEC * 1000)) {
            followMouse = false;
            setNewAnimation(characters[0].current, "walk_left", characters[0].current.idleX, characters[0].current.idleY, "walk_right");
            console.log("I'm bored, going home");
        } else {
            console.log("I'm gonna getcha");
            // Compute new direction and target
            var animDirection = (characters[0].current.x > cursor.x) ? "walk_left" : "walk_right";
            setNewAnimation(characters[0].current, animDirection, cursor.x, cursor.y);
        }
    }
}