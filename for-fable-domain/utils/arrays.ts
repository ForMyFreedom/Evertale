
export function removeDuplicate<T>(array: T[]): T[] {
  return array
    .filter((i) => i !== undefined)
    .filter((element, i) => i === array.indexOf(element))
}

export function prettifyErrorList(array: string[]|undefined): string {
  if(array) {
    return array.reduce((a, b) => a + '<br>' + b)
  } else {
    return ''
  }
}