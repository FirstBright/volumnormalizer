let audioContext = null;
let gainNode = null;

// normalizeAudio 함수 수정
const normalizeAudio = (volume) => {
  const audioElements = document.querySelectorAll("audio, video");

  audioElements.forEach((audioElement) => {
    if (!audioContext || audioContext.state === "closed") {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (!gainNode) {
      gainNode = audioContext.createGain();
      gainNode.gain.value = volume; // Set initial volume
    }
    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(gainNode).connect(audioContext.destination);
  });
};

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "updateVolume" && gainNode) {
    gainNode.gain.value = message.volume; // Update volume
    console.log("Updated volume to:", message.volume);
  }
});

// Initialize volume from storage when content script is loaded
chrome.storage.local.get("volume", (data) => {
  const savedVolume = data.volume || 0.5; // Default to 0.5
  normalizeAudio(savedVolume);
});
