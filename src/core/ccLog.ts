import { getStorage, addListener, setStorage } from "@/core/chromeStorage"
export interface CcLogInterface {
  loadCcLogs(): Promise<void>
  setCcLogs(ccLogs: CcLogObjectInterface[]): void
  getCcLogs(): CcLogObjectInterface[]
  getCcLog(date: number): CcLogObjectInterface | undefined
  addCcLog(ccLog: CcLogObjectInterface): void
  deleteCcLog(id: number): void
  observeGoogleStorage(): void
  generateCcLogId(): number
}

export interface LogObjectInterface {
  ccLogs: CcLogObjectInterface[]
}

export interface CcLogObjectInterface {
  id: number
  recordedStAt: number
  recordedEdAt: number
  speeches: { name: string; speach: string; recordedAt: number }[]
}

/**
 * ポップアップ内で入力した設定情報
 */
export class CcLog implements CcLogInterface {
  private logs: LogObjectInterface = {
    ccLogs: [],
  }
  private callbackFuncChange: (ccLogs: CcLogObjectInterface[]) => void

  constructor(callbackFunc: (ccLogs: CcLogObjectInterface[]) => void) {
    this.callbackFuncChange = callbackFunc
  }

  getCcLog = (recordedAt: number): CcLogObjectInterface | undefined => {
    return this.logs.ccLogs.find((x) => x.recordedStAt === recordedAt)
  }

  getCcLogs = (): CcLogObjectInterface[] => {
    return this.logs.ccLogs
  }

  setCcLogs = (ccLogs: CcLogObjectInterface[]): void => {
    this.logs.ccLogs = ccLogs
    this.callbackFuncChange(this.logs.ccLogs)
  }

  addCcLog = (ccLog: CcLogObjectInterface): void => {
    this.logs.ccLogs.push(ccLog)
    this.callbackFuncChange(this.logs.ccLogs)
  }

  deleteCcLog = (id: number): void => {
    const ccLogs = this.logs.ccLogs.filter((x) => x.id !== id)
    this.setCcLogs(ccLogs)
    setStorage("ccLogs", ccLogs)
  }

  saveCcLogs = (): void => {
    setStorage("ccLogs", this.logs.ccLogs)
  }

  loadCcLogs = async (): Promise<void> => {
    this.setCcLogs((await getStorage("ccLogs")) ?? [])
  }

  observeGoogleStorage = (): void => {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if ("ccLogs" in changes) {
        this.setCcLogs(changes.ccLogs.newValue)
      }
    })
  }

  generateCcLogId = (): number => {
    if (this.logs.ccLogs.length === 0) {
      return 1
    }
    return Math.max(...this.logs.ccLogs.map((x) => x.id)) + 1
  }
}
