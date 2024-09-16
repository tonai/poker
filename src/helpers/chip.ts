import { createArray } from "@tonai/game-utils"

export function getColor(amount?: number | string) {
  switch (Number(amount)) {
    case 1:
      return "#222"
    case 2:
      return "yellowgreen"
    case 5:
      return "brown"
    case 10:
      return "slategrey"
    case 20:
      return "rebeccapurple"
    case 50:
      return "darkcyan"
    case 100:
      return "darkgoldenrod"
    case 200:
      return "lightcoral"
    case 500:
      return "darkolivegreen"
    default:
      return "#222"
  }
}

const availableChips = [500, 200, 100, 50, 20, 10, 5, 2, 1]
export function getChips(amount: number) {
  let chips: number[] = []
  let index = 0
  while (amount > 0 && index < availableChips.length) {
    const chip = availableChips[index]
    if (chip <= amount) {
      const quantity = Math.floor(amount / chip)
      chips = chips.concat(createArray(quantity, chip))
      amount -= chip * quantity
    }
    index++
  }
  return chips
}
