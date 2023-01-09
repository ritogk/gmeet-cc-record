import { CcLogObjectInterface } from "@/core/ccLog"
import { FormatterInterface } from "@/core/ccLogFormatter/formatterInterface"
import { format } from "@/core/date"
export class MarkDownFormatter implements FormatterInterface {
  private ccLog: CcLogObjectInterface = {
    id: 0,
    recordedStAt: 0,
    recordedEdAt: 0,
    speeches: [],
  }
  constructor(ccLog: CcLogObjectInterface) {
    this.ccLog = ccLog
  }

  format = (): string => {
    let formatedText = ""
    this.ccLog.speeches.forEach((x) => {
      const row = `\`${x.name}\` ${x.speach}  \n`
      formatedText += row
    })
    return formatedText
  }

  getFileName = (): string => {
    return format(this.ccLog.recordedStAt, "YYYYMMDDHHmmss") + ".md"
  }
}
