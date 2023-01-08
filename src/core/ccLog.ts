import { getStorage, addListener, setStorage } from "@/core/chromeStorage"
export interface CcLogInterface {
  loadCcLogs(): Promise<void>
  setCcLogs(ccLogs: CcLogObjectInterface[]): void
  getCcLogs(): CcLogObjectInterface[]
  getCcLog(date: number): CcLogObjectInterface | undefined
  addCcLog(ccLog: CcLogObjectInterface): void
  deleteCcLog(date: number): void
  observeGoogleStorage(): void
}

export interface LogObjectInterface {
  ccLogs: CcLogObjectInterface[]
}

export interface CcLogObjectInterface {
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

  deleteCcLog = (recordedAt: number): void => {
    this.logs.ccLogs = this.logs.ccLogs.filter(
      (x) => x.recordedStAt !== recordedAt
    )
    this.callbackFuncChange(this.logs.ccLogs)
  }

  saveCcLogs = (): void => {
    setStorage("ccLogs", this.logs.ccLogs)
  }

  loadCcLogs = async (): Promise<void> => {
    this.setCcLogs((await getStorage("ccLogs")) ?? [])
  }

  observeGoogleStorage = (): void => {
    addListener((message: string) => {
      const data = JSON.parse(message)
      const logs = this.logs
      if ("ccLogs" in data) {
        logs.ccLogs = data.ccLogs
      }
      this.setCcLogs(logs.ccLogs)
    })
  }
}
