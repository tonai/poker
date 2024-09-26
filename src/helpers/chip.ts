import { createArray } from "@tonai/game-utils"

import { Bet } from "../types"

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

export function getBetsByPlayers(bets: Bet[]): Record<string, number> {
  return bets.reduce<Record<string, number>>((acc, { amount, id }) => {
    acc[id] = (acc[id] ?? 0) + amount
    return acc
  }, {})
}

export function getShares(
  playerBets: Record<string, number>,
  winners: string[]
): Record<string, number> {
  const playerBetEntries = Object.entries(playerBets)
  const sortedBets = playerBetEntries
    .map(([id, amount]) => ({ amount, id }))
    .sort(({ amount: amountA }, { amount: amountB }) => amountA - amountB) // ascending
  const sidePots: { amount: number; id: string }[] = []
  const overflow: Record<string, number> = {}
  for (const { amount, id } of sortedBets) {
    if (winners.includes(id)) {
      const total = sortedBets.reduce((acc, playerBet) => {
        const min = Math.min(playerBet.amount, amount)
        playerBet.amount -= min
        return acc + min
      }, 0)
      sidePots.push({ amount: total, id })
    } else if (winners.length === sidePots.length && amount > 0) {
      overflow[id] = amount
    }
  }

  const winnerGains: Record<string, number> = {}
  let remaining = 0
  for (let i = 0; i < sidePots.length; i++) {
    const { amount, id } = sidePots[i]
    if (winners.includes(id)) {
      const totalToShare = amount + remaining
      winnerGains[id] = Math.floor(totalToShare / (winners.length - i))
      remaining =
        (totalToShare / (winners.length - i)) * (winners.length - 1 - i)
    }
  }

  return { ...winnerGains, ...overflow }
}
