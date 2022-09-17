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
    // characters[1] hardcoded to Frog
    let current = characters[1].current;
    if (current.bumped == false && current.y < window.scrollY) {
        disableScroll();
        scroll(window.scrollX, current.y);
        setNewAnimation(current, isFacingRight(characters[1]) ? "bump_right" : "bump_left");
        // stop moving
        current.targetX = current.x;
        current.targetY = current.y;
    }
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.request.menuItemId == "link_click") {
        var l = document.links;
        var closestTargetRect = {};
        var closestDistance = Infinity;
        var currentPosition = [characters[1].current.x, characters[1].current.y];
        // Find closest link match to character
        for (var i = l.length - 1; i >= 0; i--) {
            if (l[i].href == request.request.linkUrl) {
                var a = currentPosition[0] - l[i].getBoundingClientRect().left;
                var b = currentPosition[1] - l[i].getBoundingClientRect().top;
                var distance = Math.hypot(a,b);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestTargetRect = l[i].getBoundingClientRect();
                }

            }
        }
        if (closestTargetRect != {}) {
            console.log("link found with position: " + closestTargetRect.left + ", " + closestTargetRect.top);

        }
    }

    if (request.request.menuItemId == "debug_sleep") {
        setNewAnimation(characters[1].current, isFacingRight(characters[1]) ? "sleep_right" : "sleep_left");
        // stop moving
        characters[1].current.targetX = characters[1].current.x;
        characters[1].current.targetY = characters[1].current.y;
    } else if (request.request.menuItemId == "debug_dj") {
        audio.play();
        setNewAnimation(characters[1].current, "dj_right");
        // stop moving
        characters[1].current.targetX = characters[1].current.x;
        characters[1].current.targetY = characters[1].current.y;
    }
});

function timerCallback() {

}