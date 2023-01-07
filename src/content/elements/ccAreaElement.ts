import { selector } from "@/content/core/selector"

export interface ccAreaElementInterface {
  hideElement(): void
  showElement(): void
  getElement(): HTMLElement | null
}

/**
 * 字幕エリアのElementに関するクラス
 */
export class CcAreaElement implements ccAreaElementInterface {
  opacate = false
  hideElement = (): void => {
    const element = this.getElement()
    if (element === null) return
    element.style.opacity = "0"
    this.opacate = true
  }

  showElement = (): void => {
    const element = this.getElement()
    if (element === null) return
    element.style.opacity = "1"
    this.opacate = false
  }

  getElement = (): HTMLElement | null => {
    return document.querySelector<HTMLElement>(selector.ccMainArea)
  }

  getCcElement = (): HTMLElement | null => {
    return document.querySelector<HTMLElement>(selector.ccArea)
  }
}
