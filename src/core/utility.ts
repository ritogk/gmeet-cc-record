const copyObject = <T>(object: T): T => {
  return <T>JSON.parse(JSON.stringify(object))
}

const groupByObject = <K extends PropertyKey, V>(
  array: readonly V[],
  getKey: (cur: V, idx: number, src: readonly V[]) => K
) =>
  array.reduce((obj, cur, idx, src) => {
    const key = getKey(cur, idx, src)
    ;(obj[key] || (obj[key] = []))!.push(cur)
    return obj
  }, {} as Partial<Record<K, V[]>>)

export { copyObject, groupByObject }
