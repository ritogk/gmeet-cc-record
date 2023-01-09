import { FormatType } from "@/core/config"
import { CcLogObjectInterface } from "@/core/ccLog"
import { setStorage, getStorage } from "@/core/chromeStorage"
import { groupByObject } from "@/core/utility"
import moment from "moment"

interface logTableElementInterface {
  getElement(): HTMLTableElement
  getTbodyElement(): HTMLElement | null
  deleteTbodyElement(): void
  setTbodyElementValue(ccLogs: CcLogObjectInterface[]): void
}

export class LogTableElement implements logTableElementInterface {
  private callbackFuncClickOutPut: (
    ccLog: CcLogObjectInterface | undefined
  ) => void
  constructor(
    callbackFunc: (ccLog: CcLogObjectInterface | undefined) => void,
    ccLogs: CcLogObjectInterface[]
  ) {
    this.callbackFuncClickOutPut = callbackFunc
    moment.locale("ja")
    this.setTbodyElementValue(ccLogs)
    this.observeGoogleStorage()
  }

  getElement = (): HTMLTableElement => {
    return <HTMLTableElement>document.getElementById("logTable")
  }

  getTbodyElement(): HTMLElement | null {
    return document.getElementById("logTableData")
  }

  deleteTbodyElement = (): void => {
    this.getTbodyElement()?.remove()
  }

  setTbodyElementValue = (ccLogs: CcLogObjectInterface[]): void => {
    this.deleteTbodyElement()
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
      thRecoredAtElement.textContent = moment(ccLog.recordedStAt).format(
        "YYYY-MM-DD HH:mm:ss"
      )
      trElement.appendChild(thRecoredAtElement)
      // 参加者
      const nameList = Object.keys(groupByObject(ccLog.speeches, (r) => r.name))
      const tdNameElement = trElement.appendChild(document.createElement("td"))
      nameList.forEach((name) => {
        const spanElement = document.createElement("span")
        spanElement.className = "badge bg-secondary me-1"
        spanElement.textContent = name
        tdNameElement.appendChild(spanElement)
      })
      // 出力ボタン
      const tdOutPutButtonElement = document.createElement("td")
      const outputButtonElement = document.createElement("button")
      outputButtonElement.textContent = "出力"
      outputButtonElement.className = "btn btn-primary btn-sm"
      outputButtonElement.value = ccLog.id.toString()
      outputButtonElement.addEventListener(
        "click",
        async (event: any): Promise<void> => {
          const ccLogs = await getStorage<CcLogObjectInterface[]>("ccLogs")
          this.callbackFuncClickOutPut(
            ccLogs?.find((x) => x.id === Number(event.target.value))
          )
        }
      )
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
          const ccLogs = await getStorage<CcLogObjectInterface[]>("ccLogs")
          if (ccLogs === null) return
          setStorage(
            "ccLogs",
            ccLogs.filter((x) => {
              return x.id !== Number(event.target.value)
            })
          )
        }
      )
      tdDeleteButtonElement.appendChild(deleteButtonElement)
      trElement.appendChild(tdDeleteButtonElement)

      tbodyElement.appendChild(trElement)
    })

    const tableElement = this.getElement()
    tableElement?.appendChild(tbodyElement)
  }

  private observeGoogleStorage = (): void => {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if ("ccLogs" in changes) {
        this.setTbodyElementValue(changes.ccLogs.newValue)
      }
    })
  }
}
