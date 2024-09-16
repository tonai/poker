import type { PlayerId, DuskClient } from "dusk-games-sdk/multiplayer"

import { startBlind } from "./constants"
import { Bet, Cards, PlayerCards, Step } from "./types"
import { startRound } from "./logic/round"

export interface GameState {
  bets: Bet[]
  blind: number
  dealerIndex: number
  deck: Cards
  playerCards: PlayerCards[]
  playerChips: Record<PlayerId, number>
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
    bets: [],
    blind: startBlind,
    dealerIndex: 0,
    deck: [],
    playerCards: [],
    playerChips: {},
    playerIds: allPlayerIds,
    playersReady: [],
    step: Step.WAIT,
  }),
  actions: {
    ready(_, { game, playerId }) {
      if (game.step !== Step.WAIT) {
        return Dusk.invalidAction()
      }
      startRound(game)
      /*const index = game.playersReady.indexOf(playerId)
      if (index !== -1) {
        game.playersReady.splice(index, 1)
      } else {
        game.playersReady.push(playerId)
        if (game.playersReady.length === game.playerIds.length) {
          startRound(game)
        }
      }*/
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
