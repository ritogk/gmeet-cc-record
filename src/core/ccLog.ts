import { getStorage, addListener, setStorage } from "@/core/googleStorage"
export interface CcLogInterface {
  loadCcLogs(): Promise<void>
  getCcLog(date: number): CcLogObjectInterface | undefined
  setCcLogs(ccLogs: CcLogObjectInterface[]): void
  addCcLog(ccLog: CcLogObjectInterface): void
  observeGoogleStorage(): void
}

export interface LogObjectInterface {
  ccLogs: CcLogObjectInterface[]
}

export interface CcLogObjectInterface {
  date: number
  speeches: { name: string; speach: string }[]
}

/**
 * ポップアップ内で入力した設定情報
 */
export class CcLog implements CcLogInterface {
  private logs: LogObjectInterface = {
    ccLogs: [],
  }

  getCcLog = (date: number): CcLogObjectInterface | undefined => {
    return this.logs.ccLogs.find((x) => x.date === date)
  }

  setCcLogs = (ccLogs: CcLogObjectInterface[]): void => {
    this.logs.ccLogs = ccLogs
  }

  addCcLog = (ccLog: CcLogObjectInterface): void => {
    this.logs.ccLogs.push(ccLog)
  }

  saveCcLogs = (): void => {
    setStorage("ccLogs", this.logs.ccLogs)
  }

  loadCcLogs = async (): Promise<void> => {
    this.logs.ccLogs = (await getStorage("ccLogs")) ?? []
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
