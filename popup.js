const volumeSlider = document.getElementById("volumeSlider");
const currentVolume = document.getElementById("currentVolume");
const toggleButton = document.getElementById("toggle-normalizer");

chrome.storage.local.get("volume", (data) => {
  const savedVolume = data.volume || 0.5; // Default to 0.5
  volumeSlider.value = savedVolume;
  currentVolume.textContent = savedVolume;
});

// Update storage and send message when slider changes
volumeSlider.addEventListener("input", () => {
  const newVolume = parseFloat(volumeSlider.value);
  currentVolume.textContent = newVolume;

  // Save the new volume to local storage
  chrome.storage.local.set({ volume: newVolume });

  // Send a message to content.js to update the gain value
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "updateVolume",
      volume: newVolume,
    });
  });
});
// 끄기 버튼 동작
toggleButton.addEventListener("click", () => {
  chrome.storage.local.set({ isActive: false });
  toggleButton.textContent = "Turn On";
});
