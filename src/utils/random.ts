export function randomValue(min = 1, max = 99) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
