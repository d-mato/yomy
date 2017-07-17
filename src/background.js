"use strict"
const MENU_ID = 'id_yomy_d-mato'
const MENU_TITLE = "yomyで音声合成"

const sendMessage = function(message) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message)
  })
}

chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: MENU_TITLE,
    type: "normal",
    contexts: ['selection'],
  })
})

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId !== MENU_ID) return false

  let speaker = new Speaker()
  speaker.generateAudio(info.selectionText).then((audio_url) => {
    sendMessage({ audio_url })
  })
})

class Speaker {
  constructor() {
  }

  generateAudio(text) {
    const api_url = 'http://cloud.ai-j.jp/demo/aitalk2webapi_nop.php'
    const options = {
      speaker_id: 553,
      text,
      ext: 'ogg',
      volume: 1.0,
      speed: 1,
      pitch: 1,
      range: 1,
      anger: 0,
      sadness: 0,
      joy: 0,
      callback: 'callback'
    }

    const form_data = new FormData()
    Object.keys(options).forEach((key) => {
      form_data.append(key, options[key])
    })

    return fetch(api_url, {
      method: 'POST',
      body: form_data,
    }).then((res) => res.text()).then((text) => {
      let match = text.match(/"(http.+)"/)
      if (!Array.isArray(match))
        throw 'API error'

      return match[1].replace(/\\/g, '')
    })
  }
}
