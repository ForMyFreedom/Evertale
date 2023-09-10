/* eslint-disable prettier/prettier */

export function prettifyErrorList(array: string[]|undefined): string {
  if(array) {
    return array.reduce((a, b) => a + '<br>' + b)
  } else {
    return ''
  }
}
