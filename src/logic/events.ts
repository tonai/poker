import { PlayerId } from "rune-sdk"
import { modulo } from "@tonai/game-utils/server"

import { getBetsByPlayers, getPlayerOrder } from "../helpers"
import { GameState } from "../logic"
import { Step } from "../types"
import { nextRound } from "./round"

export function playerLeft(game: GameState, playerId: PlayerId) {
  game.playerIds.splice(game.playerIds.indexOf(playerId), 1)
  if (!game.remainingPlayers.includes(playerId)) {
    return
  }

  // If a player left during the game
  const foldPlayers = game.bets
    .filter(({ type }) => type === "fold")
    .map(({ id }) => id)
  const playersOrder = getPlayerOrder(
    game.remainingPlayers,
    game.dealerIndex,
    foldPlayers
  )
  const playerOrder = playersOrder.indexOf(playerId)

  // If a was the dealer
  const isDealer = game.remainingPlayers[game.dealerIndex] === playerId
  if (isDealer) {
    game.dealerIndex = modulo(
      game.dealerIndex,
      game.remainingPlayers.length - 1
    )
  }

  // Remove player
  game.playersLeft.push(playerId)
  game.remainingPlayers = game.remainingPlayers.filter((id) => id !== playerId)

  // Compute new turnIndex
  const skipPlayers = game.bets
    .filter(
      ({ id, type }) =>
        game.remainingPlayers.includes(id) &&
        (type === "fold" || type === "allIn")
    )
    .map(({ id }) => id)
  const playersIn = game.remainingPlayers.length - skipPlayers.length
  if (game.turnIndex !== -1) {
    if (isDealer) {
      game.turnIndex = modulo(game.turnIndex - 1, playersIn)
    }
    if (playerOrder === game.turnIndex) {
      // Player left during his turn
      game.turnIndex = modulo(game.turnIndex, playersIn)
    } else if (playerOrder < game.turnIndex) {
      // Player left and he was before current turnIndex
      game.turnIndex = modulo(game.turnIndex - 1, playersIn)
    } else {
      // Player left but he was after current turnIndex
      // Nothing to do
    }
  }

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

  const roundBets = game.bets.filter(
    ({ id, round, type }) =>
      round === game.round &&
      (game.remainingPlayers.includes(id) ||
        type === "bigBlind" ||
        type === "smallBlind")
  )
  const playerRoundBets = getBetsByPlayers(
    roundBets.filter(({ id }) => game.remainingPlayers.includes(id))
  )
  const maxRoundBet = Math.max(...Object.values(playerRoundBets))
  const arePlayersAllBettingTheMax = !Object.entries(playerRoundBets)
    .filter(([id]) => !skipPlayers.includes(id))
    .some(([, total]) => total !== maxRoundBet)
  const everyoneAsSpoken =
    (game.round !== 0 && roundBets.length >= playersIn) ||
    (game.round === 0 && roundBets.length >= game.remainingPlayers.length + 2)

  if (
    game.step === Step.PLAY &&
    everyoneAsSpoken &&
    arePlayersAllBettingTheMax
  ) {
    nextRound(game, foldPlayers)
  }
}
