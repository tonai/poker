import type { PlayerId, RuneClient } from "rune-sdk"

import { startBlind } from "./constants"
import { Action, Bet, Cards, PlayerCards, Step, WinnerHand } from "./types"
import { addAction, endGame, nextGame, startGame } from "./logic/round"
import { playerLeft } from "./logic/events"

export interface GameState {
  bets: Bet[]
  blind: number
  communityCards: Cards
  dealerIndex: number
  deck: Cards
  game: number
  playerCards: PlayerCards[]
  playerChips: Record<PlayerId, number>
  playerIds: PlayerId[]
  playersLeft: PlayerId[]
  playersReady: PlayerId[]
  remainingPlayers: PlayerId[]
  round: number
  roundWinners: Record<PlayerId, number>
  step: Step
  turnIndex: number
  winnerHands: WinnerHand[]
}

export type GameActions = {
  action: (action: Action) => void
  endRound: () => void
  nextRound: () => void
  ready: () => void
}

declare global {
  // eslint-disable-next-line no-var
  var Rune: RuneClient<GameState, GameActions>
}

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 6,
  setup: (allPlayerIds) => ({
    bets: [],
    blind: startBlind,
    communityCards: [],
    dealerIndex: -1,
    deck: [],
    game: -1,
    playerCards: [],
    playerChips: {},
    playerIds: allPlayerIds,
    playersLeft: [],
    playersReady: [],
    remainingPlayers: [],
    round: 0,
    roundWinners: {},
    step: Step.WAIT,
    turnIndex: 0,
    winnerHands: [],
  }),
  actions: {
    action(action, { game, playerId }) {
      if (game.step !== Step.PLAY) {
        return Rune.invalidAction()
      }
      addAction(game, playerId, action)
    },
    endRound(_, { game, playerId }) {
      if (game.step !== Step.WIN) {
        return Rune.invalidAction()
      }
      const index = game.playersReady.indexOf(playerId)
      if (index !== -1) {
        game.playersReady.splice(index, 1)
      } else {
        game.playersReady.push(playerId)
        if (game.playersReady.length === game.remainingPlayers.length) {
          endGame(game)
        }
      }
    },
    nextRound(_, { game }) {
      if (game.step !== Step.ROUND_END) {
        return Rune.invalidAction()
      }
      nextGame(game)
    },
    ready(_, { game }) {
      if (game.step !== Step.WAIT) {
        return Rune.invalidAction()
      }
      startGame(game)
      nextGame(game)
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
        // Spectator
      }
    },
    playerLeft(playerId, { game }) {
      if (game.step === Step.WAIT) {
        game.playerIds.splice(game.playerIds.indexOf(playerId), 1)
      } else {
        playerLeft(game, playerId)
      }
    },
  },
})
