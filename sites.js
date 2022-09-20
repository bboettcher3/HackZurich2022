// Special logic for specific sites

function getSoundCloudPlayButton() {
    return document.getElementsByClassName("soundTitle__titleContainer")[0].getElementsByClassName("sc-button-play")[0];
}

function siteSoundCloud() {
    var playButton = getSoundCloudPlayButton();
    if (playButton.innerHTML == "Pause") {
        // the button is pressed... time to turn it off
        // hardcoded pixel set to work with button
        let x = (playButton.getBoundingClientRect().left + window.scrollX) - 40;
        let y = (playButton.getBoundingClientRect().top + window.scrollY) - 13;
        let direction = (characters[0].current.x < x) ? "walk_right" : "walk_left";
        setNewAnimation(characters[0].current, direction, x, y, "click_right");
        characters[0].current.special = "soundCloudPause";
    }
}

function checkForSpecialSite() {
    if (document.location.hostname == "soundcloud.com") {
        var titleContainers = document.getElementsByClassName("soundTitle__titleContainer")
        // make sure on page with main play button
        if (titleContainers.length > 0) {
            setInterval(siteSoundCloud, 3000); // every 3 second
        }
    }
}