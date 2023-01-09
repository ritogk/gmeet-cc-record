import { FormatterInterface } from "@/core/ccLogFormatter/formatterInterface"

interface ccLogFormatterInterface {
  getFormattedText(): string
  getFileName(): string
}

export class CcLogFormatter implements ccLogFormatterInterface {
  private formatter: FormatterInterface
  constructor(formatter: FormatterInterface) {
    this.formatter = formatter
  }

  getFormattedText(): string {
    return this.formatter.format()
  }

  getFileName(): string {
    return this.formatter.getFileName()
  }
}
