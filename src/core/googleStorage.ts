import { ConfigObjectInterface, DisplayOriginalCc } from "@/core/config"

export const getStorage = async <T>(key: string): Promise<T | null> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(key, (data) => {
      if (key in data) resolve(<T>data[key])
      resolve(null)
    })
  })
}

export const setStorage = (key: string, value: any): void => {
  chrome.storage.local.set({ [key]: value })
}

export const sendContents = (config: ConfigObjectInterface): void => {
  console.log(`send active tab: ${config}`)
  chrome.tabs.query(
    { active: true, currentWindow: true },
    function (tabs: any) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        JSON.stringify(config),
        function (response) {}
      )
    }
  )
}

export const addListener = (callbackFunc: (message: string) => void) => {
  chrome.runtime.onMessage.addListener(callbackFunc)
}
