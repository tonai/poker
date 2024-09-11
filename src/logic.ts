import type { PlayerId, DuskClient } from "dusk-games-sdk/multiplayer"

import { Cards, Step } from "./types"
import { shuffleArray } from "@tonai/game-utils"
import { initialDeck } from "./constants"

export interface GameState {
  deck: Cards
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
  minPlayers: 2,
  maxPlayers: 6,
  setup: (allPlayerIds) => ({
    deck: [],
    playerIds: allPlayerIds,
    playersReady: [],
    step: Step.WAIT
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
          const deck = [...initialDeck]
          shuffleArray(deck)
          game.step = Step.PLAY
          game.deck = deck
        }
      }
    }
  },
})
