const copyObject = <T>(object: T): T => {
  return <T>JSON.parse(JSON.stringify(object))
}

export { copyObject }
