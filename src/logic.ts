import type { PlayerId, DuskClient } from "dusk-games-sdk/multiplayer"

import { startBlind } from "./constants"
import { Action, Bet, Cards, PlayerCards, Step } from "./types"
import { endGame, nextRound, startGame } from "./logic/round"

export interface GameState {
  bets: Bet[]
  blind: number
  communityCards: Cards
  dealerIndex: number
  deck: Cards
  hand: number
  playerCards: PlayerCards[]
  playerChips: Record<PlayerId, number>
  playerIds: PlayerId[]
  playersReady: PlayerId[]
  round: number
  roundWinners: Record<PlayerId, number>
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
  minPlayers: 6,
  maxPlayers: 6,
  setup: (allPlayerIds) => ({
    bets: [],
    blind: startBlind,
    communityCards: [],
    dealerIndex: -1,
    deck: [],
    hand: -1,
    playerCards: [],
    playerChips: {},
    playerIds: allPlayerIds,
    playersReady: [],
    round: 0,
    roundWinners: {},
    step: Step.WAIT,
    turnIndex: 0,
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
      const foldPlayers = game.bets
        .filter(({ type }) => type === "fold")
        .map(({ id }) => id)
      if (foldPlayers.length === game.playerIds.length - 1) {
        // Everybody fold
        const winner = game.playerIds.find((id) => !foldPlayers.includes(id))
        if (winner) {
          const total = game.bets.reduce((acc, { amount }) => acc + amount, 0)
          endGame(game, { [winner]: total })
        }
        return
      }
      const roundBets = game.bets.filter(({ round }) => round === game.round)
      const nonFoldBets = roundBets.filter(
        ({ id }) => !foldPlayers.includes(id)
      )
      const playerBets = Object.values(
        nonFoldBets.reduce<Record<string, number>>((acc, { amount, id }) => {
          acc[id] = (acc[id] ?? 0) + amount
          return acc
        }, {})
      )
      const roundFoldPlayers = roundBets
        .filter(({ type }) => type === "fold")
        .map(({ id }) => id)
      const playersIn = game.playerIds.length - foldPlayers.length
      if (
        (game.round === 0 && roundBets.length < game.playerIds.length + 2) ||
        roundBets.length < playersIn + roundFoldPlayers.length ||
        playerBets.some((total) => total !== playerBets[0])
      ) {
        // Continue betting round
        if (action.type !== "fold") {
          game.turnIndex++
        }
        game.turnIndex = game.turnIndex % playersIn
      } else {
        // Start next round
        nextRound(game)
      }
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
