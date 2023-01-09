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
