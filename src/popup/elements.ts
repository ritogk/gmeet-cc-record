import { FormatType } from "@/core/config"
import { CcLogObjectInterface } from "@/core/ccLog"
import { groupByObject } from "@/core/utility"

import { CcLog } from "@/core/ccLog"

export interface ElementsType {
  logTable: HTMLTableElement | null
  formatType: NodeListOf<HTMLInputElement> | null
}

export class Elements {
  private elemets: ElementsType = {
    formatType: null,
    logTable: null,
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

    this.elemets.logTable = <HTMLTableElement>(
      document.getElementById("logTable")
    )

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

  getLogTableElement = (): HTMLTableElement | null => {
    return this.elemets.logTable
  }

  setLogTableElement = (ccLogs: CcLogObjectInterface[]): void => {
    document.getElementById("logTableData")?.remove()
    const tbodyElement = document.createElement("tbody")
    tbodyElement.id = "logTableData"
    const sortCcLogs = ccLogs.sort((a: any, b: any) => {
      return b.recordedStAt - a.recordedStAt
    })
    sortCcLogs.forEach((ccLog) => {
      const trElement = document.createElement("tr")
      trElement.className = "align-middle"
      // 日付
      const thRecoredAtElement = document.createElement("th")
      thRecoredAtElement.textContent = ccLog.recordedStAt.toString()
      trElement.appendChild(thRecoredAtElement)
      // 参加者
      const nameList = Object.keys(groupByObject(ccLog.speeches, (r) => r.name))
      const tdNameElement = trElement.appendChild(document.createElement("td"))
      nameList.forEach((name) => {
        const spanElement = document.createElement("span")
        spanElement.className = "badge bg-secondary"
        spanElement.textContent = name
        tdNameElement.appendChild(spanElement)
      })
      // 出力ボタン
      const tdOutPutButtonElement = document.createElement("td")
      const outputButtonElement = document.createElement("button")
      outputButtonElement.textContent = "出力"
      outputButtonElement.className = "btn btn-primary btn-sm"
      outputButtonElement.value = ccLog.id.toString()
      outputButtonElement.addEventListener("click", (event: any): void => {
        console.log(event.target.value)
      })
      tdOutPutButtonElement.appendChild(outputButtonElement)
      trElement.appendChild(tdOutPutButtonElement)
      // 削除ボタン
      const tdDeleteButtonElement = document.createElement("td")
      const deleteButtonElement = document.createElement("button")
      deleteButtonElement.textContent = "削除"
      deleteButtonElement.className = "btn btn-danger btn-sm"
      deleteButtonElement.value = ccLog.id.toString()
      deleteButtonElement.addEventListener(
        "click",
        async (event: any): Promise<void> => {
          debugger
          console.log(event.target.value)
          const ccLog = new CcLog((ccLogs: CcLogObjectInterface[]): void => {})
          await ccLog.loadCcLogs()
          ccLog.deleteCcLog(Number(event.target.value))
        }
      )
      tdDeleteButtonElement.appendChild(deleteButtonElement)
      trElement.appendChild(tdDeleteButtonElement)

      tbodyElement.appendChild(trElement)
    })

    const tableElement = this.getLogTableElement()
    tableElement?.appendChild(tbodyElement)
  }
}
