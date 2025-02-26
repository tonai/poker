import { GameStateWithPersisted, PlayerId } from "rune-sdk"
import { modulo, shuffleArray } from "@tonai/game-utils/server"

import { initialDeck, startPlayerAmount } from "../constants"
import {
  getAction,
  getBetsByPlayers,
  getShares,
  getWinningHands,
} from "../helpers"
import { GameState, Persisted } from "../logic"
import { Action, Step } from "../types"

export function startGame(game: GameState) {
  // Start game
  game.game = -1
  game.dealerIndex = 0
  game.playerChips = Object.fromEntries(
    game.playerIds.map((id) => [id, startPlayerAmount])
  )
  game.remainingPlayers = game.playerIds
  game.playersOrder = Object.fromEntries(game.playerIds.map((id, i) => [id, i]))
}

export function nextGame(game: GameState) {
  // Start round
  game.bets = []
  game.communityCards = []
  game.deck = []
  game.game++
  game.playerCards = []
  game.playersReady = []
  game.round = 0
  game.roundWinners = {}
  game.step = Step.PLAY
  game.turnIndex = game.remainingPlayers.length === 2 ? 1 : 2
  game.winnerHands = []
  // Shuffle deck and deal 2 cards per players
  const deck = [...initialDeck]
  shuffleArray(deck)
  const players = game.remainingPlayers
    .slice(game.dealerIndex + 1)
    .concat(game.remainingPlayers.slice(0, game.dealerIndex + 1))
  for (const i in players) {
    game.playerCards[i] = { cards: [deck.shift()!], id: players[i] }
  }
  for (const i in players) {
    game.playerCards[i].cards.push(deck.shift()!)
  }
  game.deck = deck
  // Blinds
  if (game.dealerIndex === 0) {
    game.blind *= 2
  }
  let smallBlindPlayer = players[0]
  let bigBlindPlayer = players[1]
  if (game.remainingPlayers.length === 2) {
    smallBlindPlayer = players[1]
    bigBlindPlayer = players[0]
  }
  game.bets = [
    {
      ...getAction(
        game.blind / 2,
        0,
        game.playerChips[smallBlindPlayer],
        "smallBlind"
      ),
      id: smallBlindPlayer,
      round: 0,
    },
    {
      ...getAction(game.blind, 0, game.playerChips[bigBlindPlayer], "bigBlind"),
      id: bigBlindPlayer,
      round: 0,
    },
  ]
  game.playerChips[smallBlindPlayer] -= game.blind / 2
  game.playerChips[bigBlindPlayer] -= game.blind
}

export function addAction(
  game: GameState,
  playerId: PlayerId,
  action: Action,
  allPlayerIds: PlayerId[]
) {
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
      if (
        game.remainingPlayers.includes(id) &&
        (type === "fold" || type === "allIn")
      ) {
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
    const winner = game.remainingPlayers.find((id) => !foldPlayers.includes(id))
    if (winner) {
      const playerBets = getBetsByPlayers(game.bets)
      winRound(game, getShares(playerBets, [winner]), allPlayerIds)
    }
    return
  }

  // const roundBets = game.bets.filter(({ round }) => round === game.round)
  // const playerRoundBets = getBetsByPlayers(roundBets)
  // const maxRoundBet = Math.max(...Object.values(playerRoundBets))
  // const roundSkipPlayers = roundBets
  //   .filter(({ type }) => type === "fold" || type === "allIn")
  //   .map(({ id }) => id)
  // const playersIn = game.remainingPlayers.length - skipPlayers.length
  // const arePlayersNotBettingTheMax = Object.entries(playerRoundBets)
  //   .filter(([id]) => !skipPlayers.includes(id))
  //   .some(([, total]) => total !== maxRoundBet)

  const playersIn = game.remainingPlayers.length - skipPlayers.length
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

  if (everyoneAsSpoken && arePlayersAllBettingTheMax) {
    // Start next round
    nextRound(game, foldPlayers, allPlayerIds)
  } else {
    if (action.type !== "fold" && action.type !== "allIn") {
      game.turnIndex++
    }
    game.turnIndex = modulo(game.turnIndex, playersIn)
  }
}

export function nextRound(
  game: GameState,
  foldPlayers: string[],
  allPlayerIds: PlayerId[]
) {
  game.round++
  if (game.round === 4) {
    // Showdown
    game.turnIndex = -1

    // Calculate best hands
    const playerCards = game.playerCards.filter(
      ({ id }) => !foldPlayers.includes(id)
    )
    const winnerHands = getWinningHands(playerCards, game.communityCards)
    game.winnerHands = winnerHands
    const winners = winnerHands.map(({ id }) => id)
    const playerBets = getBetsByPlayers(game.bets)
    winRound(game, getShares(playerBets, winners), allPlayerIds)
  } else {
    game.turnIndex = 0
    // Burn card
    game.deck.shift()
    if (game.round === 1) {
      // Flop
      game.communityCards = [
        game.deck.shift()!,
        game.deck.shift()!,
        game.deck.shift()!,
      ]
    } else {
      // Turn and River
      game.communityCards.push(game.deck.shift()!)
    }

    const skipPlayers = game.bets
      .filter(({ type }) => type === "fold" || type === "allIn")
      .map(({ id }) => id)
    if (skipPlayers.length === game.remainingPlayers.length) {
      nextRound(game, foldPlayers, allPlayerIds)
    }
  }
}

export function winRound(
  game: GameState,
  winners: Record<string, number>,
  allPlayerIds: PlayerId[]
) {
  game.step = Step.WIN
  game.turnIndex = -1
  game.roundWinners = winners
  for (const [id, amount] of Object.entries(game.roundWinners)) {
    game.playerChips[id] += amount
  }
  game.remainingPlayers = Object.entries(game.playerChips)
    .filter(([, amount]) => amount !== 0)
    .map(([id]) => id)
  if (game.remainingPlayers.length === 1) {
    Rune.gameOver({
      players: Object.fromEntries(
        allPlayerIds.map((id) => [
          id,
          game.playerChips[id] === 0 ? "LOST" : "WON",
        ])
      ),
    })
  }
}

export function endGame(game: GameStateWithPersisted<GameState, Persisted>) {
  if (game.playersJoined.length > 0) {
    for (const playerId of game.playersJoined) {
      const { chips, order } = game.persisted[playerId]
      if (chips !== undefined && order !== undefined) {
        game.playerChips[playerId] = chips
        game.playersOrder[playerId] = order
        game.playerIds.push(playerId)
        game.playerIds.sort(
          (a, b) => game.playersOrder[a] - game.playersOrder[b]
        )
        if (chips > 0) {
          game.remainingPlayers.push(playerId)
          game.remainingPlayers.sort(
            (a, b) => game.playersOrder[a] - game.playersOrder[b]
          )
        }
      }
    }
    game.playersJoined = []
  }
  game.turnIndex = -1
  game.dealerIndex = modulo(game.dealerIndex + 1, game.remainingPlayers.length)
  game.roundWinners = {}
  game.winnerHands = []
  game.step = Step.ROUND_END
}
