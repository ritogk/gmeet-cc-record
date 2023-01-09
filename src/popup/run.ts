import { CcLog, CcLogObjectInterface } from "@/core/ccLog"
import { Config, ConfigObjectInterface, FormatType } from "@/core/config"
// import { Elements } from "@/popup/elements"
import { setStorage, sendContents } from "@/core/chromeStorage"
import { FormatTypeElement } from "@/popup/elements/formatTypeElement"
import { LogTableElement } from "@/popup/elements/logTableElement"
import { CcLogFormatter } from "@/popup/ccLogFormatter"
import { format } from "@/core/date"
import { downloadTextFile } from "@/core/utility"

export const run = async (): Promise<void> => {
  console.log("start: popup")

  // config読み込み
  const config = new Config((config: ConfigObjectInterface) => {})
  await config.loadConfig()
  const configData = config.getConfig()
  console.log(`load config: ${JSON.stringify(configData)}`)

  // elementsの変更後のコールバック関数
  const callbackFuncChangeElement = (formatType: FormatType) => {
    // elements.setLogTableElement(ccLog.getCcLogs())
    // configとストレージを更新
    console.log("changeElement")
    configData.formatType = formatType
    setStorage("formatType", formatType)
    sendContents(configData)
  }
  // const elements = new Elements(
  //   configData.formatType,
  //   callbackFuncChangeElement
  // )

  const formatTypeElement = new FormatTypeElement(configData.formatType)

  // log変更時のコールバック関数
  const callbackFuncChangeCcLogs = (ccLogs: CcLogObjectInterface[]): void => {
    console.log("mutate: ccLogs")
    // テーブルのdomを更新する。
    // elements.setLogTableElement(ccLogs)
  }
  const ccLog = new CcLog(callbackFuncChangeCcLogs)
  await ccLog.loadCcLogs()
  ccLog.observeGoogleStorage()

  // 出力ボタン押下後のコールバック関数
  const callbackFuncClickOutPut = (ccLog: CcLogObjectInterface | undefined) => {
    if (!ccLog) return
    const ccLogFormatter = new CcLogFormatter(ccLog)
    const fomatedText = ccLogFormatter.getFormatedText()
    downloadTextFile(fomatedText, format(ccLog.recordedStAt, "YYYYMMDDHHmmss"))
  }
  const logTableElement = new LogTableElement(
    callbackFuncClickOutPut,
    ccLog.getCcLogs()
  )

  console.log(ccLog.getCcLogs())
}

window.addEventListener("load", run, false)
