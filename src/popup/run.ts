import { CcLog, CcLogObjectInterface } from "@/core/ccLog"
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
    elements.setLogTableElement(ccLog.getCcLogs())
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

  // log変更時のコールバック関数
  const callbackFuncChangeCcLogs = (ccLogs: CcLogObjectInterface[]): void => {
    console.log("mutate: ccLogs")
    // テーブルのdomを更新する。
    elements.setLogTableElement(ccLogs)
  }
  const ccLog = new CcLog(callbackFuncChangeCcLogs)
  await ccLog.loadCcLogs()
  ccLog.observeGoogleStorage()

  elements.setLogTableElement(ccLog.getCcLogs())
}

window.addEventListener("load", run, false)
