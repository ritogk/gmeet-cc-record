import { ControlAreaElement } from "@/content/elements/controlAreaElement"
export interface SwitchingButtonElementInterface {
  createElement(): void
  deleteElement(): void
  getElement(): HTMLElement | null
}

/**
 * システムのスイッチングボタンに関するクラス
 */
export class SwitchingButtonElement implements SwitchingButtonElementInterface {
  private drawed = false
  private mouseOver = false
  private clicked = false
  static ELEMENT_ID = "controlButton"
  private clickCallback: (clicked: boolean) => void

  constructor(callback: (clicked: boolean) => void) {
    this.clickCallback = callback
  }

  createElement = (): void => {
    const element = document.createElement("div")
    element.id = SwitchingButtonElement.ELEMENT_ID
    element.addEventListener("mouseover", this.callbackFuncMouseOver)
    element.addEventListener("mouseleave", this.callbackFuncMouseLeave)
    element.addEventListener("click", this.callbackFuncClick)

    const ccButtonElement = new ControlAreaElement().getCcBottomElement()
    if (ccButtonElement !== null && ccButtonElement.parentNode != null) {
      ccButtonElement.parentNode.insertBefore(
        element,
        ccButtonElement.nextElementSibling
      )
      this.changeStyle()
      this.drawed = true
    }
  }

  deleteElement = (): void => {
    document.getElementById(SwitchingButtonElement.ELEMENT_ID)?.remove()
    this.drawed = false
    this.mouseOver = false
    this.clicked = false
  }

  getElement = (): HTMLElement | null => {
    return document.getElementById(SwitchingButtonElement.ELEMENT_ID)
  }

  private callbackFuncMouseOver = (e: any): void => {
    this.mouseOver = true
    this.changeStyle()
  }

  private callbackFuncMouseLeave = (e: any): void => {
    this.mouseOver = false
    this.changeStyle()
  }

  private callbackFuncClick = (e: any): void => {
    this.clicked = !this.clicked
    this.changeStyle()
    this.clickCallback(this.clicked)
  }

  private changeStyle = (): void => {
    const element = this.getElement()
    if (element === null) return

    element.style.width = "40px"
    element.style.height = "40px"
    element.style.backgroundColor = "rgb(60, 64, 67)"
    element.style.borderRadius = "20px"
    element.style.paddingTop = "12px"
    element.style.paddingBottom = "12px"
    element.style.display = "inline-block"
    element.style.boxSizing = "border-box"
    element.style.filter = "brightness(1)"
    element.innerText = "ON"
    element.style.color = "#FFF"

    if (this.mouseOver) {
      element.style.filter = "brightness(1.15)"
    }
    if (this.clicked) {
      element.style.color = "#000"
      element.innerText = "OFF"
      element.style.backgroundColor = "rgb(138,180,248)"
    }
  }
}
