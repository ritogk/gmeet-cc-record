import { CcLogObjectInterface } from "@/core/ccLog"
// ストラテジパターンやってみたい。
interface ccLogFormatterInterface {
  getFormatedText(): string
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
  getFormatedText(): string {
    let formatedText = ""
    this.ccLog.speeches.forEach((x) => {
      const row = `time:${x.recordedAt} name:${x.name} speach:${x.speach}\n`
      formatedText += row
    })
    return formatedText
  }
}
