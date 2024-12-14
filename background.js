chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ volume: 0.5, isActive: true });
});
