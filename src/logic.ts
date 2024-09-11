import type { PlayerId, DuskClient } from "dusk-games-sdk/multiplayer"

import { Cards, Step } from "./types"
import { shuffleArray } from "@tonai/game-utils"
import { initialDeck } from "./constants"

export interface GameState {
  dealerIndex: number
  deck: Cards
  playerCards: Record<PlayerId, Cards>
  playerIds: PlayerId[]
  playersReady: PlayerId[]
  step: Step
}

type GameActions = {
  ready: () => void
}

declare global {
  const Dusk: DuskClient<GameState, GameActions>
}

Dusk.initLogic({
  minPlayers: 6,
  maxPlayers: 6,
  setup: (allPlayerIds) => ({
    dealerIndex: 0,
    deck: [],
    playerCards: {},
    playerIds: allPlayerIds,
    playersReady: [],
    step: Step.WAIT,
  }),
  actions: {
    ready(_, { game, playerId }) {
      if (game.step !== Step.WAIT) {
        return Dusk.invalidAction()
      }
      const index = game.playersReady.indexOf(playerId)
      if (index !== -1) {
        game.playersReady.splice(index, 1)
      } else {
        game.playersReady.push(playerId)
        if (game.playersReady.length === game.playerIds.length) {
          // Start game
          game.step = Step.PLAY
          game.dealerIndex = 0
          // Shuffle deck and deal 2 cards per players
          const deck = [...initialDeck]
          shuffleArray(deck)
          const players = game.playerIds
            .slice(game.dealerIndex)
            .concat(game.playerIds.slice(0, game.dealerIndex))
          for (const id of players) {
            game.playerCards[id] = [deck.shift()!]
          }
          for (const id of players) {
            game.playerCards[id].push(deck.shift()!)
          }
          game.deck = deck
        }
      }
    },
  },
  events: {
    playerJoined(playerId, { game }) {
      if (game.step === Step.WAIT) {
        game.playerIds.push(playerId)
      } else {
        // Spectator (TODO)
      }
    },
    playerLeft(playerId, { game }) {
      if (game.step === Step.WAIT) {
        game.playerIds.splice(game.playerIds.indexOf(playerId), 1)
      } else {
        // If a player left during the game (TODO)
      }
    },
  },
})
