import moment from "moment"

moment.locale("ja")

export const getMoment = (): moment.Moment => {
  return moment()
}

export const format = (milliSeconds: number, format: string): string => {
  return moment(milliSeconds).format(format)
}
