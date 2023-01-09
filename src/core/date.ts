import moment from "moment"

moment.locale("ja")

export const getMoment = (): moment.Moment => {
  return moment()
}

export const convertMoment = (time: any): moment.Moment => {
  return moment(time)
}

export const format = (milliSeconds: number, format: string): string => {
  return moment(milliSeconds).format(format)
}
