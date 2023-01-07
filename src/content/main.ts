import { Config, ConfigObjectInterface, DisplayOriginalCc } from "@/core/config"
import { UsersAreaElement } from "@/content/elements/UsersAreaElement"
import { SwitchingButtonElement } from "@/content/elements/switchingButtonElement"
import { CcAreaElement } from "@/content/elements/ccAreaElement"
import { CcOveserver } from "@/content/core/ccOveserver"

export const main = async (): Promise<void> => {
  console.log("start: application")

  const usersAreaElement = new UsersAreaElement()
  const ccAreaElement = new CcAreaElement()

  /**
   * 設定ファイル変更時のコールバック関数
   * @param config
   */
  const callbackFuncChangeConfig = (config: ConfigObjectInterface) => {
    console.log(JSON.stringify(config))
    // 字幕の透明度
    usersAreaElement.setUserCcOpacityRate(config.opacityRate)

    // 字幕の表示非表示制御
    if (config.displayOriginalCc == DisplayOriginalCc.OK) {
      ccAreaElement.showElement()
    } else {
      ccAreaElement.hideElement()
    }
  }
  const config = new Config(callbackFuncChangeConfig)
  await config.loadConfig()
  console.log(`load config: ${JSON.stringify(config.getConfig())}`)
  config.observeGoogleStorage()
  /**
   * コントロールボタン押下後のコールバック関数
   * @param clicked
   */
  const callbackFuncClick = (clicked: boolean) => {
    console.log("click: controlButton")
    if (clicked) {
      ccOveserver.run()
      console.log("start: observer")
      usersAreaElement.runInterval()
      console.log("run: interval")
    } else {
      ccOveserver.stop()
      console.log("stop: observer")
      usersAreaElement.stopInterval()
      console.log("stop: interval")
      usersAreaElement.deleteUserCcElements()
      console.log("delete: cc elements")
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

    if (!usersAreaElement.findUserCcElement(name)) {
      usersAreaElement.appendUserCcElement(name, speach)
    } else {
      usersAreaElement.updateUserCcElement(name, speach)
    }
  }
  const ccOveserver = new CcOveserver(callbackFuncObserver)
}

// 動作確認用の入口
document.addEventListener("runScript", (e) => {
  main()
})

// // script呼び出し用イベント
// const event = new Event("runScript", { bubbles: true })
// document.dispatchEvent(event)
