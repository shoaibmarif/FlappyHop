// Background service worker for Flappy Hop Chrome Extension

chrome.runtime.onInstalled.addListener(() => {
  // Create Context Menu items
  chrome.contextMenus.create({
    id: 'flappy-play-web',
    title: 'Play Flappy Hop (Fullscreen)',
    contexts: ['action']
  });

  chrome.contextMenus.create({
    id: 'flappy-share',
    title: 'Share Flappy Hop Link',
    contexts: ['action']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'flappy-play-web') {
    chrome.tabs.create({ url: 'https://flappyhop.netlify.app/' });
  } else if (info.menuItemId === 'flappy-share') {
    if (tab?.id) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          navigator.clipboard.writeText(
            '🐦 Play Flappy Hop Online — 100% Free Retro Arcade Game: https://flappyhop.netlify.app/'
          );
          alert('Flappy Hop link copied to clipboard!');
        }
      });
    }
  }
});

