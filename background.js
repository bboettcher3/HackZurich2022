chrome.runtime.onInstalled.addListener(async () => {
    chrome.contextMenus.create({
        id: "link_click",
        title: "Frog click お願いします",
        type: 'normal',
        contexts: ['link'],
    });
    chrome.contextMenus.create({
        id: "sleep",
        title: "sleep 😴",
        type: 'normal',
        contexts: ['all'],
    });
    chrome.contextMenus.create({
        id: "dj",
        title: "drop it hard skrill",
        type: 'normal',
        contexts: ['all'],
    });
    chrome.contextMenus.create({
        id: "hide",
        title: "削除してください",
        type: 'normal',
        contexts: ['all'],
    });
    chrome.contextMenus.create({
        id: "graffiti",
        title: "graffiti",
        type: 'normal',
        contexts: ['image'],
    });
});

// Open a new search tab when the user clicks a context menu
chrome.contextMenus.onClicked.addListener((item, tab) => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {"request": item}, function(response) {});
    });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.url != "") {
        chrome.tabs.create({ url: request.url});
        return true;
    }
  }
);