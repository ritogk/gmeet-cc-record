import { Config, ConfigObjectInterface, DisplayOriginalCc } from "@/core/config"
import { SwitchingButtonElement } from "@/content/elements/switchingButtonElement"
import { CcAreaElement } from "@/content/elements/ccAreaElement"
import { CcOveserver } from "@/content/core/ccOveserver"
import { CcLog, CcLogObjectInterface } from "@/core/ccLog"

import { diff_match_patch } from "diff-match-patch"

export const main = async (): Promise<void> => {
  console.log("start: application")

  const dmp = new diff_match_patch()
  // const allDiffs = dmp.diff_main(
  //   "A B C D E F ghijk 前回の会話と一致している文字列を調べる 一致していただく つける 全く一致していなかったらログイン 追加する。 一人で話し続ける時に記録する処理がいる直前と同じ名前だったら、文字列をくっ",
  //   "一致していただく つける 全く一致していなかったらログイン 追加する。 一人で話し続ける時に記録する処理がいる直前と同じ名前だったら、文字列をくっ つけるようにしようかな"
  // )

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
    if (speach.trim() === "") return
    // console.log("mutate: cc")
    // console.log(`name: ${name}`)
    // console.log(`imagePath: ${imagePath}`)
    // console.log(`speach: ${speach}`)

    let aaa = speach.replace(/\s+/g, "")

    if (log.logRecorded) {
      if (log.beforeSpeach.name === name) {
        let diffs = dmp.diff_main(
          log.beforeSpeach.speach,
          speach.replace(/\s+/g, "")
        )
        // diffsを人間が読みやすいように整形する
        dmp.diff_cleanupSemantic(diffs)

        // 空白文字だけの奴を削除
        diffs = diffs.filter((x) => {
          return x[1].trim().length > 0
        })

        // // 記号削除
        // diffs = diffs.filter((x) => {
        //   return x[1] !== "。" && x[1] !== "、"
        // })

        // if (diffs.length <= 6) {
        const str = diffs
          .map((x) => x[1])
          .reduce((acc, cur) => acc + cur.trim())
        aaa = str

        //if (aaa.length >= 50)
        console.log("before: " + log.beforeSpeach.speach)
        console.log("new: " + speach)
        console.log("create: " + aaa)
        console.log(JSON.stringify(diffs))
        // if (added !== undefined) {
        //   aaa = added[1]
        // }
        // } else {
        //   console.log(str)
        // }
        // const disappearance = diffs.find((x) => x[0] === -1)
        // const universal = diffs.find((x) => x[0] === 0)
        // const added = diffs.find((x) => x[0] === 1)

        // if (universal?.[1].trim() !== speach.trim() && added !== undefined) {
        //   aaa =
        //     (disappearance?.[1] ?? "") +
        //     (universal?.[1] ?? "") +
        //     (added?.[1] ?? "")
        //   console.log("before: " + log.beforeSpeach.speach)
        //   console.log("new: " + speach)
        //   console.log("create: " + aaa)
        //   console.log("---------------------------------")
        // } else {
        //   // 以下のような字幕が飛んできた時に処理がおかしくなるのでその対応
        //   // before: 前回の会話と一致している文字列を調べる。 一致していただく つける。
        //   // new:    前回の会話と一致している文字列を調べる。
        //   aaa = log.beforeSpeach.speach
        //   console.log("before: " + log.beforeSpeach.speach)
        //   console.log("new: " + speach)
        //   console.log("warning: " + aaa)
        //   console.log(JSON.stringify(diffs))
        // }
        // } else {
        //   // ログ追加!
        //   log.ccLog.speeches.push({
        //     name: name,
        //     speach: log.beforeSpeach.speach,
        //     recordedAt: new Date().getTime(),
        //   })
        //   console.log("before: " + log.beforeSpeach.speach)
        //   console.log("new: " + speach)
        //   console.log("★add log <6: " + log.beforeSpeach.speach)
        //   console.log(JSON.stringify(diffs))
        //   aaa = speach.replace(/\s+/g, "")
        // }
      }

      //console.log(allDiffs)
    }

    // 前回の会話と一致している文字数を調べる。
    // 一致していたらくっつける
    // 全く一致していなかったら、ログに追加する処理をいれる。
    log.beforeSpeach = {
      name: name,
      speach: aaa,
      recordedAt: new Date().getTime(),
    }

    // １人で話し続けてる時に記録する処理がいる
    // 直前と同じ名前だったら、文字列をくっつけるようにしようかな。
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
