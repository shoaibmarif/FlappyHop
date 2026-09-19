// Background service worker for Flappy Bird Chrome Extension

chrome.runtime.onInstalled.addListener(() => {
  // Create Context Menu items
  chrome.contextMenus.create({
    id: 'flappy-play-web',
    title: 'Play Flappy Bird (Fullscreen)',
    contexts: ['action']
  });

  chrome.contextMenus.create({
    id: 'flappy-share',
    title: 'Share Flappy Bird Link',
    contexts: ['action']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'flappy-play-web') {
    chrome.tabs.create({ url: 'https://flappybird-arcade.netlify.app/' });
  } else if (info.menuItemId === 'flappy-share') {
    if (tab?.id) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          navigator.clipboard.writeText(
            '🐦 Play Flappy Bird Online — 100% Free Retro Arcade Game: https://flappybird-arcade.netlify.app/'
          );
          alert('Flappy Bird link copied to clipboard!');
        }
      });
    }
  }
});

