// chrome.action.onClicked.addListener(() => {
//     chrome.tabs.create({ url: 'index.html' });
// });

chrome.contextMenus.create({
    id: 'cookie-copier',
    title: 'Cookie-copier',
    contexts: ['all']
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'cookie-copier') {
        chrome.tabs.create({ url: `index.html?tabUrl=${encodeURIComponent(tab.url)}` });
    }
});
