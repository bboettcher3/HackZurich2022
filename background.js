chrome.runtime.onInstalled.addListener(async () => {
    chrome.contextMenus.create({
        id: "link_click",
        title: "Frog click お願いします",
        type: 'normal',
        contexts: ['link'],
    });
    chrome.contextMenus.create({
        id: "debug_sleep",
        title: "DEBUG sleep",
        type: 'normal',
        contexts: ['all'],
    });
    chrome.contextMenus.create({
        id: "debug_dj",
        title: "DEBUG dj",
        type: 'normal',
        contexts: ['all'],
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