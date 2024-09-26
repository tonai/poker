import { shuffleArray } from "@tonai/game-utils/server"

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
import { Step } from "../types"

export function startGame(game: GameState) {
  // Start game
  game.game = -1
  game.dealerIndex = 0
  game.playerChips = Object.fromEntries(
    game.playerIds.map((id) => [id, startPlayerAmount])
  )
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
    .filter(([, amount]) => amount !== 0)
    .map(([id]) => id)
  if (game.remainingPlayers.length === 1) {
    Dusk.gameOver({
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
  game.dealerIndex = (game.dealerIndex + 1) % game.remainingPlayers.length
  game.roundWinners = {}
  game.winnerHands = []
  game.step = Step.ROUND_END
}
