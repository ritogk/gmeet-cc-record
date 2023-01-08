import { FormatType } from "@/core/config"

export interface ElementsType {
  formatType: NodeListOf<HTMLInputElement> | null
}

export class Elements {
  private elemets: ElementsType = {
    formatType: null,
  }

  private callbackFuncChange: (formatType: FormatType) => void

  constructor(
    formatType: FormatType,
    callbackFuncChange: (formatType: FormatType) => void
  ) {
    this.callbackFuncChange = callbackFuncChange

    this.elemets.formatType = <NodeListOf<HTMLInputElement>>(
      document.getElementsByName("formatType")
    )

    this.elemets.formatType[0].value = FormatType.TEXT
    this.elemets.formatType[1].value = FormatType.MARKDOWN

    // 初期値
    if (formatType === FormatType.TEXT) {
      this.elemets.formatType[0].checked = true
    } else {
      this.elemets.formatType[1].checked = true
    }

    // 変更を検知してcallbackを実行
    this.elemets.formatType[0].addEventListener("change", (event) => {
      console.log("change formatTypeElements")
      if (event.target instanceof HTMLInputElement) {
        if (!event.target.checked) return
        console.log(event.target.value)
        this.callbackFuncChange(event.target.value as FormatType)
      }
    })
    // 変更を検知してcallbackを実行
    this.elemets.formatType[1].addEventListener("change", (event) => {
      console.log("change formatTypeElements")
      if (event.target instanceof HTMLInputElement) {
        if (!event.target.checked) return
        console.log(event.target.value)
        this.callbackFuncChange(event.target.value as FormatType)
      }
    })
  }

  getElements = (): ElementsType => {
    return this.elemets
  }

  getFormatTypeElement = (): NodeListOf<HTMLInputElement> | null => {
    return this.elemets.formatType
  }

  setFormatTypeElementChecked = (formatType: FormatType): void => {
    if (!this.elemets.formatType) return

    if (formatType === FormatType.TEXT) {
      this.elemets.formatType[0].checked = true
    }
    if (formatType === FormatType.MARKDOWN) {
      this.elemets.formatType[1].checked = true
    }
  }

  getFormatTypeElementChecked = (): HTMLInputElement | null => {
    if (!this.elemets.formatType) return null

    if (this.elemets.formatType[0].checked) {
      return this.elemets.formatType[0]
    } else {
      return this.elemets.formatType[1]
    }
  }
}
