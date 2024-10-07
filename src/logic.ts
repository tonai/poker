import type { PlayerId, RuneClient } from "rune-sdk"
// import { modulo } from "@tonai/game-utils/server"

import { startBlind } from "./constants"
import { Action, Bet, Cards, PlayerCards, Step, WinnerHand } from "./types"
import { addAction, endGame, nextGame, startGame } from "./logic/round"

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
  // playersLeft: PlayerId[]
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
  const Rune: RuneClient<GameState, GameActions>
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
    // playersLeft: [],
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
        // const remainingPlayers = game.remainingPlayers.filter((id) =>
        //   game.playerIds.includes(id)
        // )
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
      }
      /*
      else if (game.remainingPlayers.includes(playerId)) {
        // If a player left during the game
        const foldPlayers = game.bets
          .filter(({ type }) => type === "fold")
          .map(({ id }) => id)
        const playerOrder = game.remainingPlayers
          .slice(game.dealerIndex + 1)
          .concat(game.remainingPlayers.slice(0, game.dealerIndex + 1))
          .filter((id) => !foldPlayers.includes(id))
        const leftOutsideHisTurn = playerId !== playerOrder[game.turnIndex]
        // If a was the dealer
        if (game.remainingPlayers[game.dealerIndex] === playerId) {
          game.dealerIndex = modulo(
            game.dealerIndex - 1,
            game.remainingPlayers.length - 1
          )
        }
        // Remove player
        game.playersLeft.push(playerId)
        game.remainingPlayers = game.remainingPlayers.filter(
          (id) => id !== playerId
        )
        // Compute new turnIndex
        const skipPlayers = game.bets
          .filter(({ type }) => type === "fold" || type === "allIn")
          .map(({ id }) => id)
        const playersIn = game.remainingPlayers.length - skipPlayers.length
        game.turnIndex = modulo(
          leftOutsideHisTurn ? game.turnIndex - 1 : game.turnIndex,
          playersIn
        )
        // Insert a fold action
        // addAction(
        //   game,
        //   playerId,
        //   {
        //     amount: 0,
        //     raise: 0,
        //     type: "fold",
        //   },
        //   leftOutsideHisTurn
        // )
        // Game over if there is only one remaining player
        if (game.remainingPlayers.length === 1) {
          Rune.gameOver({
            players: Object.fromEntries(
              game.playerIds.map((id) => [
                id,
                id !== game.remainingPlayers[0] ? "LOST" : "WON",
              ])
            ),
          })
        }
      }
      */
    },
  },
})
