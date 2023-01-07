import { selector } from "@/content/core/selector"

export interface ControlAreaElementInterface {
  getElement(): HTMLElement | null
  getCcBottomElement(): HTMLElement | null
}

/**
 * コントロールエリアElementに関するクラス
 */
export class ControlAreaElement implements ControlAreaElementInterface {
  getElement = (): HTMLElement | null => {
    return document.querySelector<HTMLElement>(selector.controlArea)
  }

  getCcBottomElement = (): HTMLElement | null => {
    const element = this.getElement()
    if (element === null) return null
    return element.querySelector("div.Tmb7Fd > div > div.juFBl")
  }
}
