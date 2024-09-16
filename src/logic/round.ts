import { shuffleArray } from "@tonai/game-utils/server"

import { initialDeck, startBlind, startPlayerAmount } from "../constants"
import { GameState } from "../logic"
import { Step } from "../types"

export function startRound(game: GameState) {
  // Start game
  game.blind = startBlind
  game.step = Step.PLAY
  game.dealerIndex = 0
  game.playerChips = Object.fromEntries(
    game.playerIds.map((id) => [id, startPlayerAmount])
  )
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
    { amount: game.blind / 2, id: players[0] },
    { amount: game.blind, id: players[1] },
  ]
  game.playerChips[players[0]] -= game.blind / 2
  game.playerChips[players[1]] -= game.blind
}
