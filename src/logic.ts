import type { PlayerId, DuskClient } from "dusk-games-sdk/multiplayer"

import { startBlind } from "./constants"
import { Action, Bet, Cards, PlayerCards, Step } from "./types"
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
  round: number
  step: Step
  turnIndex: number
}

type GameActions = {
  action: (action: Action) => void
  ready: () => void
}

declare global {
  const Dusk: DuskClient<GameState, GameActions>
}

Dusk.initLogic({
  minPlayers: 3,
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
    round: 0,
    step: Step.WAIT,
    turnIndex: 0,
  }),
  actions: {
    action(action, { game, playerId }) {
      if (game.step !== Step.PLAY) {
        return Dusk.invalidAction()
      }
      const amount = action.amount ?? 0
      game.bets.push({
        amount,
        id: playerId,
        round: game.round,
        type: action.type,
      })
      game.playerChips[playerId] -= amount
      const foldPlayers = game.bets
        .filter(({ type }) => type === "fold")
        .map(({ id }) => id)
      const roundBets = game.bets.filter(
        ({ id, round }) => round === game.round && !foldPlayers.includes(id)
      )
      const playerBets = Object.values(
        roundBets.reduce<Record<string, number>>((acc, { amount, id }) => {
          acc[id] = (acc[id] ?? 0) + amount
          return acc
        }, {})
      )
      if (playerBets.some((total) => total !== playerBets[0])) {
        game.turnIndex = (game.turnIndex + 1) % game.playerIds.length
      }
    },
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
