import { PlayerId } from "rune-sdk"
import { modulo, shuffleArray } from "@tonai/game-utils/server"

import { initialDeck, startPlayerAmount } from "../constants"
import {
  compareHands,
  getAction,
  getBetsByPlayers,
  getHand,
  getShares,
  getSortedCards,
} from "../helpers"
import { GameState } from "../logic"
import { Action, Step } from "../types"

export function startGame(game: GameState) {
  // Start game
  game.game = -1
  game.dealerIndex = 0
  game.playerChips = Object.fromEntries(
    game.playerIds.map((id) => [id, startPlayerAmount])
  )
  // game.playerChips = Object.fromEntries(
  //   game.playerIds.map((id, i) => [id, Math.floor(startPlayerAmount / (i + 1))])
  // )
  game.remainingPlayers = game.playerIds
  nextGame(game)
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
  action: Action
  // left = false
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
    const winner = game.remainingPlayers.find((id) => !foldPlayers.includes(id))
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
  const arePlayersNotBettingTheMax = Object.entries(playerRoundBets)
    .filter(([id]) => !skipPlayers.includes(id))
    .some(([, total]) => total !== maxRoundBet)

  if (
    (game.round === 0 && roundBets.length < game.remainingPlayers.length + 2) ||
    roundBets.length < playersIn + roundSkipPlayers.length ||
    arePlayersNotBettingTheMax
  ) {
    // console.log(
    //   "before",
    //   game.turnIndex,
    //   left,
    //   action.type !== "fold" && action.type !== "allIn",
    //   playersIn
    // )
    // // Continue betting round
    // if (left) {
    //   game.turnIndex--
    // }
    if (action.type !== "fold" && action.type !== "allIn") {
      game.turnIndex++
    }
    game.turnIndex = modulo(game.turnIndex, playersIn)
  } else {
    // Start next round
    nextRound(game, foldPlayers)
  }
}

export function nextRound(game: GameState, foldPlayers: string[]) {
  game.round++
  if (game.round === 4) {
    // Showdown
    game.turnIndex = -1

    // Calculate best hands
    const hands = game.playerCards
      .filter(({ id }) => !foldPlayers.includes(id))
      .map(({ cards, id }) => ({
        hand: getHand(getSortedCards(cards.concat(game.communityCards))),
        id,
      }))
      .sort(({ hand: handA }, { hand: handB }) => compareHands(handA, handB))
    const [first, ...otherHands] = hands
    const winnerHands = [first].concat(
      otherHands.filter(({ hand }) => compareHands(first.hand, hand) === 0)
    )
    game.winnerHands = winnerHands
    const winners = winnerHands.map(({ id }) => id)
    const playerBets = getBetsByPlayers(game.bets)
    winRound(game, getShares(playerBets, winners))
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
      nextRound(game, foldPlayers)
    }
  }
}

export function winRound(game: GameState, winners: Record<string, number>) {
  game.step = Step.WIN
  game.turnIndex = -1
  game.roundWinners = winners
  for (const [id, amount] of Object.entries(game.roundWinners)) {
    game.playerChips[id] += amount
  }
  game.remainingPlayers = Object.entries(game.playerChips)
    .filter(([, amount]) => amount !== 0 /*&& !game.playersLeft.includes(id)*/)
    .map(([id]) => id)
  if (game.remainingPlayers.length === 1) {
    Rune.gameOver({
      players: Object.fromEntries(
        game.playerIds.map((id) => [
          id,
          game.playerChips[id] === 0 ? "LOST" : "WON",
        ])
      ),
    })
  }
}

export function endGame(game: GameState) {
  game.turnIndex = -1
  game.dealerIndex = modulo(game.dealerIndex + 1, game.remainingPlayers.length)
  game.roundWinners = {}
  game.winnerHands = []
  game.step = Step.ROUND_END
}
