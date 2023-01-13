import { FormatType } from "@/core/config"

import { setStorage } from "@/core/chromeStorage"

interface formatTypeElementInterface {
  getElements(): NodeListOf<HTMLInputElement> | null
  getSelectElement(): HTMLInputElement
}

export class FormatTypeElement implements formatTypeElementInterface {
  constructor(formatType: FormatType) {
    const elements = this.getElements()
    elements[0].value = FormatType.TEXT
    elements[1].value = FormatType.MARKDOWN
    // 初期値
    if (formatType === FormatType.TEXT) {
      elements[0].checked = true
    } else {
      elements[1].checked = true
    }

    // 変更後にstorageに保存
    elements[0].addEventListener("change", (event: any) => {
      console.log("change formatTypeElements")
      if (event.target instanceof HTMLInputElement) {
        if (!event.target.checked) return
        console.log(event.target.value)
        setStorage("configFormatType", event.target.value)
      }
    })
    // 変更後にstorageに保存
    elements[1].addEventListener("change", (event: any) => {
      console.log("change formatTypeElements")
      if (event.target instanceof HTMLInputElement) {
        if (!event.target.checked) return
        console.log(event.target.value)
        setStorage("configFormatType", event.target.value)
      }
    })
  }

  getElements = (): NodeListOf<HTMLInputElement> => {
    return <NodeListOf<HTMLInputElement>>(
      document.getElementsByName("formatType")
    )
  }

  getSelectElement = (): HTMLInputElement => {
    const elements = this.getElements()
    if (elements[0].checked) {
      return elements[0]
    } else {
      return elements[1]
    }
  }
}
