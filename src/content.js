const audio = new Audio()
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.audio_url) {
    audio.pause()
    audio.src = request.audio_url
    audio.play()
  }
})
