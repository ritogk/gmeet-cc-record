import { SwitchingButtonElement } from "@/content/elements/switchingButtonElement"
import { CcOveserver } from "@/content/core/ccOveserver"
import { CcLog, CcLogObjectInterface } from "@/core/ccLog"
import { diff_match_patch } from "diff-match-patch"
import { copyObject } from "@/core/utility"
import { getMoment } from "@/core/time"

export const main = async (): Promise<void> => {
  console.log("start: application")

  const diffMatchPatch = new diff_match_patch()

  const callbackFuncChangeCcLogs = (ccLogs: CcLogObjectInterface[]): void => {}
  const ccLog = new CcLog(callbackFuncChangeCcLogs)
  ccLog.observeGoogleStorage()
  await ccLog.loadCcLogs()
  const defaultLog: CcLogObjectInterface = {
    id: 0,
    recordedStAt: 0,
    recordedEdAt: 0,
    speeches: [],
  }

  const log = {
    logRecorded: false,
    beforeSpeach: { name: "", speach: "", recordedAt: 0 },
    ccLog: copyObject(defaultLog),
  }

  /**
   * コントロールボタン押下後のコールバック関数
   * @param clicked
   */
  const callbackFuncClick = async (clicked: boolean) => {
    console.log("click: controlButton")
    if (clicked) {
      ccOveserver.run()
      console.log("start: observer")
      log.logRecorded = true
      log.ccLog.recordedStAt = getMoment().valueOf()
    } else {
      ccOveserver.stop()
      log.ccLog.speeches.push(log.beforeSpeach)
      log.ccLog.recordedEdAt = getMoment().valueOf()
      log.ccLog.speeches = log.ccLog.speeches.slice(1)
      log.ccLog.id = ccLog.generateCcLogId()
      ccLog.saveCcLog(log.ccLog)
      console.log(log.ccLog)
      log.logRecorded = false
      log.ccLog = copyObject(defaultLog)
      log.beforeSpeach = { name: "", speach: "", recordedAt: 0 }
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
    if (speach.trim() === "") return
    console.log("mutate: cc")
    console.log(`name: ${name}`)
    console.log(`imagePath: ${imagePath}`)
    console.log(`speach: ${speach}`)

    if (log.logRecorded) {
      let originalSpeach
      if (log.beforeSpeach.name === name) {
        // 直前の字幕との差分を作成する
        let diffs = diffMatchPatch.diff_main(log.beforeSpeach.speach, speach)
        // diffを人間が読みやすいように整形する
        diffMatchPatch.diff_cleanupSemantic(diffs)

        // 空白文字だけの奴を削除
        diffs = diffs.filter((x) => {
          return x[1].trim().length > 0
        })

        // 差分を結合した文字列を作成する
        originalSpeach = diffs
          .map((x) => x[1])
          .reduce((acc, cur) => acc + cur.trim())
      } else {
        // 会話している人間が変わったタイミングでログにいれる。
        log.ccLog.speeches.push({
          name: log.beforeSpeach.name,
          speach: log.beforeSpeach.speach,
          recordedAt: getMoment().valueOf(),
        })
        originalSpeach = speach
      }

      log.beforeSpeach = {
        name: name,
        speach: originalSpeach,
        recordedAt: getMoment().valueOf(),
      }
    }
  }
  const ccOveserver = new CcOveserver(callbackFuncObserver)

  // ↓ 呼び出しスクリプト
  document.dispatchEvent(
    new CustomEvent("runScript", { bubbles: true, detail: { name: "あなた" } })
  )
  // 動作確認用の入口
  document.addEventListener("runScript", (e: any) => {
    callbackFuncObserver(
      e.detail.name,
      "c:/a/b",
      "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほぱぴぷぺぽらりるれろ"
    )
  })
}
