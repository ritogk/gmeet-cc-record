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
    beforeSpeeches: [] as {
      name: string
      speach: string
      recordedAt: number
    }[],
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
      const beforeSpeaches = log.beforeSpeeches.sort((a: any, b: any) => {
        return a.recordedAt - b.recordedAt
      })
      log.ccLog.speeches.push(...beforeSpeaches)
      log.ccLog.recordedEdAt = getMoment().valueOf()
      log.ccLog.id = ccLog.generateCcLogId()
      ccLog.saveCcLog(log.ccLog)
      console.log(log.ccLog)
      log.logRecorded = false
      log.ccLog = copyObject(defaultLog)
      log.beforeSpeeches = []
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
    // console.log("mutate: cc")
    // console.log(`name: ${name}`)
    // console.log(`imagePath: ${imagePath}`)
    // console.log(`speach: ${speach}`)

    if (log.logRecorded) {
      let originalSpeach
      const beforeSpeaches = log.beforeSpeeches.sort((a: any, b: any) => {
        return a.recordedAt - b.recordedAt
      })
      const beforeSpeach =
        beforeSpeaches.length !== 0 ? beforeSpeaches[0] : undefined

      if (!beforeSpeach) {
        log.beforeSpeeches.push({
          name: name,
          speach: speach,
          recordedAt: getMoment().valueOf(),
        })
        return
      }
      if (beforeSpeach.name === name) {
        // 記号を消す
        speach = speach
          .replace("？", "")
          .replace("。", "")
          .replace(" ", "")
          .replace("　", "")
        // 直前の字幕との差分を作成する
        let diffs = diffMatchPatch.diff_main(beforeSpeach.speach, speach)
        // // diffを人間が読みやすいように整形する
        // diffMatchPatch.diff_cleanupSemantic(diffs)

        // 空白文字のdiffを削除
        diffs = diffs.filter((x) => {
          return x[1].trim().length > 0
        })

        // 「。」、「？」のdiffを削除
        diffs = diffs.filter((x) => {
          return x[1] !== "。" && x[1] !== "？"
        })

        // 「？」と「。」と「 」と「　」を削る
        diffs = diffs.map((x) => {
          x[1] = x[1].replace("？", "")
          x[1] = x[1].replace("。", "")
          x[1] = x[1].replace(" ", "")
          x[1] = x[1].replace("　", "")
          return x
        })

        // diffs = diffs.filter((x) => {
        //   return x[0] !== -1
        // })

        console.log(diffs)

        // 差分を結合した文字列を作成する
        originalSpeach = diffs
          .map((x) => x[1])
          .reduce((acc, cur) => acc + cur.trim())
        console.log("before: " + beforeSpeach.speach)
        console.log("speach: " + speach)
        console.log(originalSpeach)

        // 直近のログを置き換える
        log.beforeSpeeches = [
          ...log.beforeSpeeches.filter((x) => {
            x.name !== name
          }),
        ]
        log.beforeSpeeches.push({
          name: name,
          speach: originalSpeach,
          recordedAt: getMoment().valueOf(),
        })
      } else {
        // 会話している人間が変わったタイミングでログにいれる。
        if (beforeSpeach) {
          log.ccLog.speeches.push({
            name: beforeSpeach.name,
            speach: beforeSpeach.speach,
            recordedAt: getMoment().valueOf(),
          })
          log.beforeSpeeches = [
            ...log.beforeSpeeches.filter((x) => {
              x.name !== name
            }),
          ]
        }
        log.beforeSpeeches.push({
          name: name,
          speach: speach,
          recordedAt: getMoment().valueOf(),
        })
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
