import { CcLogObjectInterface } from "@/core/ccLog"
// ストラテジパターンやってみたい。
interface ccLogFormatterInterface {
  getFormatedRaw(): string
}

export class CcLogFormatter implements ccLogFormatterInterface {
  private ccLog: CcLogObjectInterface = {
    id: 0,
    recordedEdAt: 0,
    recordedStAt: 0,
    speeches: [],
  }
  constructor(ccLog: CcLogObjectInterface) {
    this.ccLog = ccLog
  }
  getFormatedRaw(): string {
    let formatedText = ""
    this.ccLog.speeches.forEach((x) => {
      const row = `${x.recordedAt},${x.name},${x.speach}\n`
      formatedText += row
    })
    return formatedText
  }
}
