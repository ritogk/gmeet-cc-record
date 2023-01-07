import { Config, ConfigObjectInterface, DisplayOriginalCc } from "@/core/config"
import { SwitchingButtonElement } from "@/content/elements/switchingButtonElement"
import { CcAreaElement } from "@/content/elements/ccAreaElement"
import { CcOveserver } from "@/content/core/ccOveserver"
import { CcLog } from "@/core/ccLog"

export const main = async (): Promise<void> => {
  console.log("start: application")

  const ccLog = new CcLog()
  await ccLog.loadCcLogs()
  console.log(ccLog.getCcLogs())
  // ccLog.addCcLog({
  //   date: 123,
  //   speeches: [
  //     { name: "1", speach: "aiueo" },
  //     { name: "2", speach: "kakikukeko" },
  //   ],
  // })
  // ccLog.saveCcLogs()

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
