import { CcLog, CcLogObjectInterface } from "@/core/ccLog"
import { Config, ConfigObjectInterface, FormatType } from "@/core/config"
import { FormatTypeElement } from "@/popup/elements/formatTypeElement"
import { LogTableElement } from "@/popup/elements/logTableElement"
import { CcLogFormatter } from "@/core/ccLogFormatter"
import { MarkDownFormatter } from "@/core/ccLogFormatter/markDownFormatter"
import { RawFormatter } from "@/core/ccLogFormatter/rawFormatter"
import { FormatterInterface } from "@/core/ccLogFormatter/formatterInterface"

export const run = async (): Promise<void> => {
  console.log("start: popup")

  // config読み込み
  const config = new Config((config: ConfigObjectInterface) => {})
  await config.loadConfig()
  const configData = config.getConfig()
  console.log(`load config: ${JSON.stringify(configData)}`)

  const formatTypeElement = new FormatTypeElement(configData.formatType)

  // log変更時のコールバック関数
  const callbackFuncChangeCcLogs = (ccLogs: CcLogObjectInterface[]): void => {
    console.log("mutate: ccLogs")
  }
  const ccLog = new CcLog(callbackFuncChangeCcLogs)
  await ccLog.loadCcLogs()
  ccLog.observeGoogleStorage()

  // 出力ボタン押下後のコールバック関数
  const callbackFuncClickOutPut = (ccLog: CcLogObjectInterface | undefined) => {
    if (!ccLog) return
    const formatter: FormatterInterface =
      formatTypeElement.getSelectElement().value === FormatType.TEXT
        ? new RawFormatter(ccLog)
        : new MarkDownFormatter(ccLog)
    const ccLogFormatter = new CcLogFormatter(formatter)
    ccLogFormatter.download()
  }
  const logTableElement = new LogTableElement(
    callbackFuncClickOutPut,
    ccLog.getCcLogs()
  )

  console.log(ccLog.getCcLogs())
}

window.addEventListener("load", run, false)
