import { getStorage } from "@/core/chromeStorage"
export interface ConfigInterface {
  loadConfig(): Promise<void>
  getConfig(): ConfigObjectInterface
  setConfig(config: ConfigObjectInterface): void
  observeGoogleStorage(): void
}

export enum FormatType {
  TEXT = "1",
  MARKDOWN = "2",
}

export interface ConfigObjectInterface {
  formatType: FormatType
}

/**
 * ポップアップ内で入力した設定情報
 */
export class Config implements ConfigInterface {
  private config: ConfigObjectInterface = {
    formatType: FormatType.TEXT,
  }

  private callbackFuncChangeConfig: (config: ConfigObjectInterface) => void

  constructor(callbackFunc: (config: ConfigObjectInterface) => void) {
    this.callbackFuncChangeConfig = callbackFunc
  }

  getConfig = (): ConfigObjectInterface => {
    return this.config
  }

  setConfig = (config: ConfigObjectInterface): void => {
    this.config = config
    this.callbackFuncChangeConfig(this.config)
  }

  loadConfig = async (): Promise<void> => {
    this.config.formatType =
      (await getStorage("configFormatType")) ?? this.config.formatType
  }

  observeGoogleStorage = (): void => {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if ("ccLogs" in changes) {
        this.setConfig(changes.cclog.newValue)
      }
    })
  }
}
