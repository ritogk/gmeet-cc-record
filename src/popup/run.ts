import { Config, ConfigObjectInterface, FormatType } from "@/core/config"
import { Elements } from "@/popup/elements"
import { setStorage, sendContents } from "@/core/chromeStorage"
export const run = async (): Promise<void> => {
  console.log("start: popup")

  // config読み込み
  const config = new Config((config: ConfigObjectInterface) => {})
  await config.loadConfig()
  const configData = config.getConfig()
  console.log(`load config: ${JSON.stringify(configData)}`)

  // elementsの変更後のコールバック関数
  const callbackFuncChangeElement = (formatType: FormatType) => {
    // configとストレージを更新
    console.log("changeElement")
    configData.formatType = formatType
    setStorage("formatType", formatType)
    sendContents(configData)
  }
  const elements = new Elements(
    configData.formatType,
    callbackFuncChangeElement
  )
}

window.addEventListener("load", run, false)
