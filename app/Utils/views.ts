/* eslint-disable prettier/prettier */

export function prettifyErrorList(array: string[]) {
  return array.reduce((a, b) => a + '<br>' + b)
}
