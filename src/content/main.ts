import { Config, ConfigObjectInterface, DisplayOriginalCc } from "@/core/config"
import { SwitchingButtonElement } from "@/content/elements/switchingButtonElement"
import { CcAreaElement } from "@/content/elements/ccAreaElement"
import { CcOveserver } from "@/content/core/ccOveserver"
import { CcLog, CcLogObjectInterface } from "@/core/ccLog"

export const main = async (): Promise<void> => {
  console.log("start: application")

  const callbackFuncChangeCcLogs = (ccLogs: CcLogObjectInterface[]): void => {
    console.log("mutate: ccLogs")
  }

  const ccLog = new CcLog(callbackFuncChangeCcLogs)
  await ccLog.loadCcLogs()
  const defaultLog: CcLogObjectInterface = {
    recordedStAt: 0,
    recordedEdAt: 0,
    speeches: [],
  }

  const log = {
    logRecorded: false,
    beforeSpeach: { name: "", speach: "", recordedAt: 0 },
    ccLog: defaultLog,
  }

  /**
   * コントロールボタン押下後のコールバック関数
   * @param clicked
   */
  const callbackFuncClick = (clicked: boolean) => {
    console.log("click: controlButton")
    if (clicked) {
      ccOveserver.run()
      console.log("start: observer")
      log.logRecorded = true
      log.ccLog.recordedStAt = new Date().getTime()
    } else {
      ccOveserver.stop()
      log.ccLog.speeches.push(log.beforeSpeach)
      log.ccLog.recordedEdAt = new Date().getTime()
      // storageへの記録処理をここにいれる
      log.logRecorded = false
      log.ccLog = defaultLog
    }
  }
  const controlButtonElement = new SwitchingButtonElement(callbackFuncClick)
  controlButtonElement.createElement()

  /**
   * 字幕変更検知後のコールバック関数
   * @param name
   * @param imagePath
   * @param speach
   */
  const callbackFuncObserver = (
    name: string,
    imagePath: string,
    speach: string
  ) => {
    console.log("mutate: cc")
    console.log(`name: ${name}`)
    console.log(`imagePath: ${imagePath}`)
    console.log(`speach: ${speach}`)
    if (log.logRecorded) {
      if (log.beforeSpeach.name !== name) {
        log.ccLog.speeches.push(log.beforeSpeach)
      }
    }
    log.beforeSpeach = {
      name: name,
      speach: speach,
      recordedAt: new Date().getTime(),
    }

    // １人で話し続けてる時に記録する処理がいる
  }
  const ccOveserver = new CcOveserver(callbackFuncObserver)
}

// 動作確認用の入口
document.addEventListener("runScript", (e) => {
  main()
})

// // // script呼び出し用イベント
// const event = new Event("runScript", { bubbles: true })
// document.dispatchEvent(event)
