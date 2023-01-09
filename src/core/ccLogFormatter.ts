import { FormatterInterface } from "@/core/ccLogFormatter/formatterInterface"
import { downloadTextFile } from "@/core/utility"

interface ccLogFormatterInterface {
  getFormattedText(): string
  getFileName(): string
  download(): void
}

export class CcLogFormatter implements ccLogFormatterInterface {
  private formatter: FormatterInterface
  constructor(formatter: FormatterInterface) {
    this.formatter = formatter
  }

  getFormattedText = (): string => {
    return this.formatter.format()
  }

  getFileName = (): string => {
    return this.formatter.getFileName()
  }

  download = (): void => {
    downloadTextFile(this.getFormattedText(), this.getFileName())
  }
}
