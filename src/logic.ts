import type { PlayerId, DuskClient } from "dusk-games-sdk/multiplayer"

import { startBlind } from "./constants"
import { Action, Bet, Cards, PlayerCards, Step, WinnerHand } from "./types"
import {
  endGame,
  nextGame,
  nextRound,
  startGame,
  winRound,
} from "./logic/round"
import { getBetsByPlayers, getShares } from "./helpers"

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
  playersReady: PlayerId[]
  remainingPlayers: PlayerId[]
  round: number
  roundWinners: Record<PlayerId, number>
  step: Step
  turnIndex: number
  winnerHands: WinnerHand[]
}

type GameActions = {
  action: (action: Action) => void
  endRound: () => void
  nextRound: () => void
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
    communityCards: [],
    dealerIndex: -1,
    deck: [],
    game: -1,
    playerCards: [],
    playerChips: {},
    playerIds: allPlayerIds,
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
        return Dusk.invalidAction()
      }
      game.bets.push({
        amount: action.amount,
        id: playerId,
        raise: action.raise ?? 0,
        round: game.round,
        type: action.type,
      })
      game.playerChips[playerId] -= action.amount

      // Player states (fold / all-in)
      const playerStates = game.bets.reduce<Record<string, "allIn" | "fold">>(
        (acc, { id, type }) => {
          if (type === "fold" || type === "allIn") {
            acc[id] = type
          }
          return acc
        },
        {}
      )
      const foldPlayers = Object.entries(playerStates)
        .filter(([, type]) => type === "fold")
        .map(([id]) => id)
      const skipPlayers = Object.keys(playerStates)

      if (foldPlayers.length === game.remainingPlayers.length - 1) {
        // Everybody fold
        const winner = game.remainingPlayers.find(
          (id) => !foldPlayers.includes(id)
        )
        if (winner) {
          const playerBets = getBetsByPlayers(game.bets)
          winRound(game, getShares(playerBets, [winner]))
        }
        return
      }

      const roundBets = game.bets.filter(({ round }) => round === game.round)
      const playerRoundBets = getBetsByPlayers(roundBets)
      const maxRoundBet = Math.max(...Object.values(playerRoundBets))
      const roundSkipPlayers = roundBets
        .filter(({ type }) => type === "fold" || type === "allIn")
        .map(({ id }) => id)
      const playersIn = game.remainingPlayers.length - skipPlayers.length
      const arePlayersBettingTheMax = Object.entries(playerRoundBets)
        .filter(([id]) => !skipPlayers.includes(id))
        .some(([, total]) => total !== maxRoundBet)

      if (
        (game.round === 0 && roundBets.length < game.remainingPlayers.length + 2) ||
        roundBets.length < playersIn + roundSkipPlayers.length ||
        arePlayersBettingTheMax
      ) {
        // Continue betting round
        if (action.type !== "fold" && action.type !== "allIn") {
          game.turnIndex++
        }
        game.turnIndex = game.turnIndex % playersIn
      } else {
        // Start next round
        nextRound(game, foldPlayers)
      }
    },
    endRound(_, { game, playerId }) {
      if (game.step !== Step.WIN) {
        return Dusk.invalidAction()
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
        return Dusk.invalidAction()
      }
      nextGame(game)
    },
    ready(_, { game, playerId }) {
      if (game.step !== Step.WAIT) {
        return Dusk.invalidAction()
      }
      startGame(game)
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
        // If a player left during the game
      }
    },
  },
})
