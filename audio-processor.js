export function processAudio(audioElement, targetVolume) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const analyserNode = audioContext.createAnalyser();
  const gainNode = audioContext.createGain();
  const source = audioContext.createMediaElementSource(audioElement);

  source
    .connect(analyserNode)
    .connect(gainNode)
    .connect(audioContext.destination);

  const dataArray = new Uint8Array(analyserNode.fftSize);

  function adjustVolume() {
    analyserNode.getByteTimeDomainData(dataArray);

    const rms = Math.sqrt(
      dataArray.reduce((sum, value) => sum + Math.pow(value - 128, 2), 0) /
        dataArray.length,
    );

    gainNode.gain.value = targetVolume / rms;
    requestAnimationFrame(adjustVolume);
  }

  adjustVolume();
}
