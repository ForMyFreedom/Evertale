/* eslint-disable prettier/prettier */
export function removeDuplicate<T>(array: T[]): T[] {
  return array
    .filter((i) => i !== undefined)
    .filter((element, i) => i === array.indexOf(element))
}
