chrome.runtime.onInstalled.addListener(async () => {
    chrome.contextMenus.create({
        id: "link_click",
        title: "Frog click お願いします",
        type: 'normal',
        contexts: ['link'],
    });
});

// Open a new search tab when the user clicks a context menu
chrome.contextMenus.onClicked.addListener((item, tab) => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {"request": item}, function(response) {});
    });
});
