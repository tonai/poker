import type { PlayerId, RuneClient } from "rune-sdk"
import { generateId } from "@tonai/game-utils/server"

import { startBlind } from "./constants"
import { Action, Bet, Cards, PlayerCards, Step, WinnerHand } from "./types"
import { addAction, endGame, nextGame, startGame } from "./logic/round"
import { playerJoin, playerLeft } from "./logic/events"

export interface GameState {
  bets: Bet[] // List of bet actions: includes smallBlind, bigBlind, check, call, raise, allIn and fold actions
  blind: number // The small blind amount
  communityCards: Cards // Flop, turn and river common cards
  dealerIndex: number // Index of the dealer inside remainingPlayers array
  deck: Cards // Shuffled deck of cards
  game: number // The current game number
  id: string // Global session id
  playerCards: PlayerCards[] // Player distributed cards
  playerChips: Record<PlayerId, number> // Chips per players
  playerIds: PlayerId[] // List of players in the session
  playersJoined: PlayerId[] // List of players that joined back and are waiting for the next game to start
  playersOrder: Record<PlayerId, number> // Used when player join back (keep the same player order)
  playersReady: PlayerId[] // List of player that are ready for the first or next game
  remainingPlayers: PlayerId[] // List of player that are still on tracks
  round: number // current game round (0: pre-flop, 1 flop, 2: tu_rn, 3 river, 4: showdown)
  roundWinners: Record<PlayerId, number> // Amount gained per players
  step: Step // Current session step: WAIT, PLAY, WIN or ROUND_END
  turnIndex: number // Index of player to speak
  winnerHands: WinnerHand[] // Winning hands of 5 cards
}

export type GameActions = {
  action: (action: Action) => void
  endRound: () => void
  nextRound: () => void
  ready: () => void
}

export type Persisted = {
  chips?: number
  gameId?: string
  order?: number
}

declare global {
  // eslint-disable-next-line no-var
  var Rune: RuneClient<GameState, GameActions, Persisted>
}

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 6,
  persistPlayerData: true,
  setup: (allPlayerIds) => ({
    bets: [],
    blind: startBlind,
    communityCards: [],
    dealerIndex: -1,
    deck: [],
    game: -1,
    id: generateId(),
    playerCards: [],
    playerChips: {},
    playerIds: allPlayerIds,
    playersJoined: [],
    playersOrder: {},
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
    ready(_, { game, playerId }) {
      if (game.step !== Step.WAIT) {
        return Rune.invalidAction()
      }
      const index = game.playersReady.indexOf(playerId)
      if (index !== -1) {
        game.playersReady.splice(index, 1)
      } else {
        game.playersReady.push(playerId)
        if (game.playersReady.length === game.playerIds.length) {
          startGame(game)
          nextGame(game)
        }
      }
    },
  },
  events: {
    playerJoined(playerId, { game }) {
      if (game.step === Step.WAIT) {
        game.playerIds.push(playerId)
      } else {
        playerJoin(game, playerId)
      }
    },
    playerLeft(playerId, { game }) {
      const index = game.playersReady.indexOf(playerId)
      if (index !== -1) {
        game.playersReady.splice(index, 1)
      }
      if (game.step === Step.WAIT) {
        game.playerIds.splice(game.playerIds.indexOf(playerId), 1)
      } else {
        playerLeft(game, playerId)
      }
    },
  },
})
