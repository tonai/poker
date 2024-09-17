import { shuffleArray } from "@tonai/game-utils/server"

import { initialDeck, startBlind, startPlayerAmount } from "../constants"
import { GameState } from "../logic"
import { Step } from "../types"

export function startRound(game: GameState) {
  // Start game
  game.step = Step.PLAY
  game.hand = -1
  game.dealerIndex = -1
  game.playerChips = Object.fromEntries(
    game.playerIds.map((id) => [id, startPlayerAmount])
  )
  nextRound(game)
}

export function nextRound(game: GameState) {
  game.hand++
  // Start round
  game.round = 0
  game.blind = startBlind
  game.dealerIndex = game.dealerIndex % game.playerIds.length
  // Shuffle deck and deal 2 cards per players
  const deck = [...initialDeck]
  shuffleArray(deck)
  const players = game.playerIds
    .slice(game.dealerIndex + 1)
    .concat(game.playerIds.slice(0, game.dealerIndex + 1))
  for (const i in players) {
    game.playerCards[i] = { cards: [deck.shift()!], id: players[i] }
  }
  for (const i in players) {
    game.playerCards[i].cards.push(deck.shift()!)
  }
  game.deck = deck
  // Blinds
  game.bets = [
    { amount: game.blind / 2, id: players[0], round: 0, type: "small blind" },
    { amount: game.blind, id: players[1], round: 0, type: "big blind" },
  ]
  game.playerChips[players[0]] -= game.blind / 2
  game.playerChips[players[1]] -= game.blind
  game.turnIndex = 2 % game.playerIds.length
}

export function endRound(game: GameState, winners: Record<string, number>) {
  game.turnIndex = -1
  game.roundWinners = winners
  game.step = Step.ROUND_END
  for (const [id, amount] of Object.entries(winners)) {
    game.playerChips[id] += amount
  }
}
