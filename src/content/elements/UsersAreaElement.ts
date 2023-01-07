import { selector } from "@/content/core/selector"
import { removeElement } from "@/core/dom"
export interface usersAreaElementInterface {
  getElement(): HTMLElement | null
  findUserAreaElement: (name: string) => Element | undefined
  findUserVideoElement: (name: string) => HTMLVideoElement | undefined
  findUserCcElement: (name: string) => HTMLDivElement | undefined
  appendUserCcElement: (name: string, speach: string) => void
  updateUserCcElement: (name: string, speach: string) => void
  deleteUserCcElement: (name: string) => void
  runInterval: () => void
  stopInterval: () => void
}

const userCcClassName = "user-cc-class-name"

/**
 * ユーザーエリアのElementに関するクラス
 */
export class UsersAreaElement implements usersAreaElementInterface {
  getElement = (): HTMLElement | null => {
    return document.querySelector<HTMLElement>(selector.usersArea)
  }

  // ユーザーエリアの要素を取得
  findUserAreaElement = (name: string): Element | undefined => {
    const usersAreaElement = this.getElement()
    if (!usersAreaElement) return undefined

    const userAreaList = Array.from(usersAreaElement.children)
    return userAreaList.find((element) => {
      // 画面共有ようのエリアはinnerTextが取得できないのでその対応
      const userNameArea = element.querySelector("[data-self-name]")
      if (!userNameArea) return false
      if (userNameArea.textContent?.startsWith(name)) {
        return true
      }
      return false
    })
  }

  // ユーザーのvideo要素を取得
  findUserVideoElement = (name: string): HTMLVideoElement | undefined => {
    const userAreaElement = this.findUserAreaElement(name)
    if (!userAreaElement) return undefined

    // 非表示のVideoタグが紛れる事があるのでその対応。
    const videoAreaElements = userAreaElement.querySelectorAll("video")
    let userVideoElement: HTMLVideoElement | null = null
    if (videoAreaElements.length >= 2) {
      videoAreaElements.forEach((element) => {
        if (element.style.display == "none") return
        userVideoElement = element
      })
    } else {
      userVideoElement = videoAreaElements[0]
    }
    return userVideoElement !== null ? userVideoElement : undefined
  }

  // ユーザー字幕の取得
  findUserCcElement = (name: string): HTMLDivElement | undefined => {
    const userAreaElement = this.findUserAreaElement(name)
    if (!userAreaElement) return undefined

    const userCcElement = userAreaElement.querySelector("." + userCcClassName)
    return userCcElement !== null ? <HTMLDivElement>userCcElement : undefined
  }

  // 字幕 追加
  appendUserCcElement = (name: string, speach: string): void => {
    const userAreaElement = this.findUserAreaElement(name)
    if (!userAreaElement) return

    const userVideoElement = this.findUserVideoElement(name)
    if (!userVideoElement) return

    const userCcElement = document.createElement("div")
    userCcElement.style.color = "white"
    userCcElement.style.position = "absolute"
    userCcElement.style.bottom = "0"
    userCcElement.style.backgroundColor = "rgba(0,0,0,0.25)"
    userCcElement.style.margin = "0"
    userCcElement.style.zIndex = "1000000"
    userCcElement.textContent = speach
    userCcElement.className = userCcClassName
    userCcElement.style.opacity = this.userCcOpacityRate.toString()
    userCcElement.style.fontWeight = "700"
    userCcElement.style.textAlign = "center"
    userCcElement.style.pointerEvents = "none"
    const fontSize = Math.floor(userVideoElement.clientWidth / 35)
    fontSize < 18
      ? (userCcElement.style.fontSize = "15px")
      : (userCcElement.style.fontSize = `${fontSize}px`)
    fontSize < 27
      ? (userCcElement.style.webkitTextStroke = "1px #000")
      : (userCcElement.style.webkitTextStroke = "2px #000")
    userVideoElement.parentElement?.after(userCcElement)

    if (fontSize >= 18) {
      userCcElement.style.height = `${userVideoElement.clientHeight / 4.3}px`
    }
    userCcElement.style.width = "100%"
    // ログに追加
    const userCcEmenet = this.findUserCcElement(name)
    if (!userCcEmenet) return
    this.appendDisplayUserCc(name, userCcEmenet)
  }

  // 字幕 更新
  updateUserCcElement = (name: string, speach: string): void => {
    const userAreraElement = this.findUserAreaElement(name)
    if (!userAreraElement) return

    const userVideoElement = this.findUserVideoElement(name)
    if (!userVideoElement) return

    const userCcElement = this.findUserCcElement(name)
    if (!userCcElement) return

    userCcElement.textContent = speach
    const fontSize = Math.floor(userVideoElement.clientWidth / 35)
    fontSize < 18
      ? (userCcElement.style.fontSize = "15px")
      : (userCcElement.style.fontSize = `${fontSize}px`)
    fontSize < 27
      ? (userCcElement.style.webkitTextStroke = "1px #000")
      : (userCcElement.style.webkitTextStroke = "2px #000")

    if (fontSize >= 18) {
      userCcElement.style.height = `${userVideoElement.clientHeight / 4.3}px`
    }
    // ログに追加
    this.appendDisplayUserCc(name, userCcElement)
  }

  // 字幕 削除
  deleteUserCcElement = (name: string): void => {
    const displaySpeach = this.displayUserCcList.find((x) => x.name === name)
    if (!displaySpeach) return
    removeElement(displaySpeach.element, 2000)
  }

  // 全字幕 削除
  deleteUserCcElements = (): void => {
    this.displayUserCcList.forEach((x) => {
      removeElement(x.element, 2000)
    })
  }

  // 字幕の透明度を変える
  private userCcOpacityRate = 0.5
  setUserCcOpacityRate = (opacityRate: number) => {
    this.userCcOpacityRate = opacityRate
    this.displayUserCcList.forEach((x) => {
      x.element.style.opacity = this.userCcOpacityRate.toString()
    })
  }

  private displayUserCcList: {
    name: string
    time: number
    element: HTMLElement
  }[] = []
  private appendDisplayUserCc = (name: string, element: HTMLElement): void => {
    this.displayUserCcList = this.displayUserCcList.filter(
      (displayUserSpeash) => displayUserSpeash.name !== name
    )
    this.displayUserCcList.push({
      name: name,
      time: new Date().getTime(),
      element: element,
    })
  }

  private readonly cclimitSecond = 7
  private intervalId: number = 0
  runInterval = (): void => {
    // 一定時間表示した字幕は消す
    this.intervalId = window.setInterval(() => {
      const oldDisplayUserCcList = this.displayUserCcList.filter(
        (x) => (new Date().getTime() - x.time) / 1000 > this.cclimitSecond
      )
      oldDisplayUserCcList.forEach((x) => {
        removeElement(x.element, 2000)
      })
      this.displayUserCcList = this.displayUserCcList.filter(
        (x) => (new Date().getTime() - x.time) / 1000 < this.cclimitSecond
      )
    }, 3000)
  }

  stopInterval = (): void => {
    clearInterval(this.intervalId)
  }
}
