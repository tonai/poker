import { describe, expect, it, Mock, vi } from "vitest"
import { RuneClient } from "rune-sdk"

import { initialDeck } from "../constants"
import { getPlayerOrder } from "../helpers"
import { GameActions, GameState } from "../logic"
import { Step } from "../types"

import {
  addAction,
  endGame,
  nextGame,
  nextRound,
  startGame,
  winRound,
} from "./round"

globalThis.Rune = {
  gameOver: vi.fn(),
} as unknown as RuneClient<GameState, GameActions>

describe("Round logic", () => {
  describe("addAction", () => {
    it("should add call and checks actions and start next round", () => {
      // Init
      const deck = [...initialDeck]
      const playerCards = [
        { id: "b", cards: [deck.shift()!, deck.shift()!] },
        { id: "c", cards: [deck.shift()!, deck.shift()!] },
        { id: "a", cards: [deck.shift()!, deck.shift()!] },
      ]
      const state: GameState = {
        bets: [
          { amount: 10, id: "b", raise: 0, round: 0, type: "smallBlind" },
          { amount: 20, id: "c", raise: 0, round: 0, type: "bigBlind" },
        ],
        blind: 10,
        communityCards: [],
        dealerIndex: 0,
        deck,
        game: 0,
        playerCards,
        playerChips: { a: 1000, b: 990, c: 980 },
        playerIds: ["a", "b", "c"],
        playersLeft: [],
        playersReady: [],
        remainingPlayers: ["a", "b", "c"],
        round: 0,
        roundWinners: {},
        step: Step.PLAY,
        turnIndex: 2,
        winnerHands: [],
      }
      // "a" call
      addAction(state, "a", { amount: 20, raise: 0, type: "call" })
      expect(state.bets).toEqual([
        { amount: 10, id: "b", raise: 0, round: 0, type: "smallBlind" },
        { amount: 20, id: "c", raise: 0, round: 0, type: "bigBlind" },
        { amount: 20, id: "a", raise: 0, round: 0, type: "call" },
      ])
      expect(state.communityCards.length).toEqual(0)
      expect(state.dealerIndex).toEqual(0)
      expect(state.deck.length).toEqual(52 - 2 - 2 - 2)
      expect(state.game).toEqual(0)
      expect(state.playerCards[0].id).toEqual("b")
      expect(state.playerCards[0].cards.length).toEqual(2)
      expect(state.playerCards[1].id).toEqual("c")
      expect(state.playerCards[1].cards.length).toEqual(2)
      expect(state.playerCards[2].id).toEqual("a")
      expect(state.playerCards[2].cards.length).toEqual(2)
      expect(state.playerChips).toEqual({ a: 980, b: 990, c: 980 })
      expect(state.playersReady).toEqual([])
      expect(state.remainingPlayers).toEqual(["a", "b", "c"])
      expect(state.round).toEqual(0)
      expect(state.roundWinners).toEqual({})
      expect(state.step).toEqual(Step.PLAY)
      expect(state.turnIndex).toEqual(0)
      expect(
        getPlayerOrder(state.remainingPlayers, state.dealerIndex)[
          state.turnIndex
        ]
      ).toEqual("b")
      expect(state.winnerHands).toEqual([])
      // "b" call
      addAction(state, "b", { amount: 10, raise: 0, type: "call" })
      expect(state.bets).toEqual([
        { amount: 10, id: "b", raise: 0, round: 0, type: "smallBlind" },
        { amount: 20, id: "c", raise: 0, round: 0, type: "bigBlind" },
        { amount: 20, id: "a", raise: 0, round: 0, type: "call" },
        { amount: 10, id: "b", raise: 0, round: 0, type: "call" },
      ])
      expect(state.communityCards.length).toEqual(0)
      expect(state.dealerIndex).toEqual(0)
      expect(state.deck.length).toEqual(52 - 2 - 2 - 2)
      expect(state.game).toEqual(0)
      expect(state.playerCards[0].id).toEqual("b")
      expect(state.playerCards[0].cards.length).toEqual(2)
      expect(state.playerCards[1].id).toEqual("c")
      expect(state.playerCards[1].cards.length).toEqual(2)
      expect(state.playerCards[2].id).toEqual("a")
      expect(state.playerCards[2].cards.length).toEqual(2)
      expect(state.playerChips).toEqual({ a: 980, b: 980, c: 980 })
      expect(state.playersReady).toEqual([])
      expect(state.remainingPlayers).toEqual(["a", "b", "c"])
      expect(state.round).toEqual(0)
      expect(state.roundWinners).toEqual({})
      expect(state.step).toEqual(Step.PLAY)
      expect(state.turnIndex).toEqual(1)
      expect(
        getPlayerOrder(state.remainingPlayers, state.dealerIndex)[
          state.turnIndex
        ]
      ).toEqual("c")
      expect(state.winnerHands).toEqual([])
      // "c" check -> start next round
      addAction(state, "c", { amount: 0, raise: 0, type: "check" })
      expect(state.bets).toEqual([
        { amount: 10, id: "b", raise: 0, round: 0, type: "smallBlind" },
        { amount: 20, id: "c", raise: 0, round: 0, type: "bigBlind" },
        { amount: 20, id: "a", raise: 0, round: 0, type: "call" },
        { amount: 10, id: "b", raise: 0, round: 0, type: "call" },
        { amount: 0, id: "c", raise: 0, round: 0, type: "check" },
      ])
      expect(state.communityCards.length).toEqual(3)
      expect(state.dealerIndex).toEqual(0)
      expect(state.deck.length).toEqual(52 - 2 - 2 - 2 - 1 - 3)
      expect(state.game).toEqual(0)
      expect(state.playerCards[0].id).toEqual("b")
      expect(state.playerCards[0].cards.length).toEqual(2)
      expect(state.playerCards[1].id).toEqual("c")
      expect(state.playerCards[1].cards.length).toEqual(2)
      expect(state.playerCards[2].id).toEqual("a")
      expect(state.playerCards[2].cards.length).toEqual(2)
      expect(state.playerChips).toEqual({ a: 980, b: 980, c: 980 })
      expect(state.playersReady).toEqual([])
      expect(state.remainingPlayers).toEqual(["a", "b", "c"])
      expect(state.round).toEqual(1)
      expect(state.roundWinners).toEqual({})
      expect(state.step).toEqual(Step.PLAY)
      expect(state.turnIndex).toEqual(0)
      expect(
        getPlayerOrder(state.remainingPlayers, state.dealerIndex)[
          state.turnIndex
        ]
      ).toEqual("b")
      expect(state.winnerHands).toEqual([])
    })

    it("should add fold actions and end the current game", () => {
      // Init
      const deck = [...initialDeck]
      const playerCards = [
        { id: "b", cards: [deck.shift()!, deck.shift()!] },
        { id: "c", cards: [deck.shift()!, deck.shift()!] },
        { id: "a", cards: [deck.shift()!, deck.shift()!] },
      ]
      const state: GameState = {
        bets: [
          { amount: 10, id: "b", raise: 0, round: 0, type: "smallBlind" },
          { amount: 20, id: "c", raise: 0, round: 0, type: "bigBlind" },
        ],
        blind: 10,
        communityCards: [],
        dealerIndex: 0,
        deck,
        game: 0,
        playerCards,
        playerChips: { a: 1000, b: 990, c: 980 },
        playerIds: ["a", "b", "c"],
        playersLeft: [],
        playersReady: [],
        remainingPlayers: ["a", "b", "c"],
        round: 0,
        roundWinners: {},
        step: Step.PLAY,
        turnIndex: 2,
        winnerHands: [],
      }
      // "a" fold
      addAction(state, "a", { amount: 0, raise: 0, type: "fold" })
      expect(state.bets).toEqual([
        { amount: 10, id: "b", raise: 0, round: 0, type: "smallBlind" },
        { amount: 20, id: "c", raise: 0, round: 0, type: "bigBlind" },
        { amount: 0, id: "a", raise: 0, round: 0, type: "fold" },
      ])
      expect(state.communityCards.length).toEqual(0)
      expect(state.dealerIndex).toEqual(0)
      expect(state.deck.length).toEqual(52 - 2 - 2 - 2)
      expect(state.game).toEqual(0)
      expect(state.playerCards[0].id).toEqual("b")
      expect(state.playerCards[0].cards.length).toEqual(2)
      expect(state.playerCards[1].id).toEqual("c")
      expect(state.playerCards[1].cards.length).toEqual(2)
      expect(state.playerCards[2].id).toEqual("a")
      expect(state.playerCards[2].cards.length).toEqual(2)
      expect(state.playerChips).toEqual({ a: 1000, b: 990, c: 980 })
      expect(state.playersReady).toEqual([])
      expect(state.remainingPlayers).toEqual(["a", "b", "c"])
      expect(state.round).toEqual(0)
      expect(state.roundWinners).toEqual({})
      expect(state.step).toEqual(Step.PLAY)
      expect(state.turnIndex).toEqual(0)
      expect(
        getPlayerOrder(state.remainingPlayers, state.dealerIndex)[
          state.turnIndex
        ]
      ).toEqual("b")
      expect(state.winnerHands).toEqual([])
      // "b" fold -> end current game
      addAction(state, "b", { amount: 0, raise: 0, type: "fold" })
      expect(state.bets).toEqual([
        { amount: 10, id: "b", raise: 0, round: 0, type: "smallBlind" },
        { amount: 20, id: "c", raise: 0, round: 0, type: "bigBlind" },
        { amount: 0, id: "a", raise: 0, round: 0, type: "fold" },
        { amount: 0, id: "b", raise: 0, round: 0, type: "fold" },
      ])
      expect(state.communityCards.length).toEqual(0)
      expect(state.dealerIndex).toEqual(0)
      expect(state.deck.length).toEqual(52 - 2 - 2 - 2)
      expect(state.game).toEqual(0)
      expect(state.playerCards[0].id).toEqual("b")
      expect(state.playerCards[0].cards.length).toEqual(2)
      expect(state.playerCards[1].id).toEqual("c")
      expect(state.playerCards[1].cards.length).toEqual(2)
      expect(state.playerCards[2].id).toEqual("a")
      expect(state.playerCards[2].cards.length).toEqual(2)
      expect(state.playerChips).toEqual({ a: 1000, b: 990, c: 1010 })
      expect(state.playersReady).toEqual([])
      expect(state.remainingPlayers).toEqual(["a", "b", "c"])
      expect(state.round).toEqual(0)
      expect(state.roundWinners).toEqual({ c: 30 })
      expect(state.step).toEqual(Step.WIN)
      expect(state.turnIndex).toEqual(-1)
      expect(state.winnerHands).toEqual([])
    })

    it("should add fold actions and end the current game (one player left)", () => {
      // Init
      const deck = [...initialDeck]
      const playerCards = [
        { id: "b", cards: [deck.shift()!, deck.shift()!] },
        { id: "c", cards: [deck.shift()!, deck.shift()!] },
        { id: "a", cards: [deck.shift()!, deck.shift()!] },
      ]
      const state: GameState = {
        bets: [
          { amount: 10, id: "b", raise: 0, round: 0, type: "smallBlind" },
          { amount: 20, id: "c", raise: 0, round: 0, type: "bigBlind" },
        ],
        blind: 10,
        communityCards: [],
        dealerIndex: 0,
        deck,
        game: 0,
        playerCards,
        playerChips: { a: 1000, b: 990, c: 980 },
        playerIds: ["a", "c"],
        playersLeft: ["b"],
        playersReady: [],
        remainingPlayers: ["a", "c"],
        round: 0,
        roundWinners: {},
        step: Step.PLAY,
        turnIndex: 1,
        winnerHands: [],
      }
      // "a" fold
      addAction(state, "a", { amount: 0, raise: 0, type: "fold" })
      expect(state.bets).toEqual([
        { amount: 10, id: "b", raise: 0, round: 0, type: "smallBlind" },
        { amount: 20, id: "c", raise: 0, round: 0, type: "bigBlind" },
        { amount: 0, id: "a", raise: 0, round: 0, type: "fold" },
      ])
      expect(state.communityCards.length).toEqual(0)
      expect(state.dealerIndex).toEqual(0)
      expect(state.deck.length).toEqual(52 - 2 - 2 - 2)
      expect(state.game).toEqual(0)
      expect(state.playerCards[0].id).toEqual("b")
      expect(state.playerCards[0].cards.length).toEqual(2)
      expect(state.playerCards[1].id).toEqual("c")
      expect(state.playerCards[1].cards.length).toEqual(2)
      expect(state.playerCards[2].id).toEqual("a")
      expect(state.playerCards[2].cards.length).toEqual(2)
      expect(state.playerChips).toEqual({ a: 1000, b: 990, c: 1010 })
      expect(state.playersReady).toEqual([])
      expect(state.remainingPlayers).toEqual(["a", "c"])
      expect(state.round).toEqual(0)
      expect(state.roundWinners).toEqual({ c: 30 })
      expect(state.step).toEqual(Step.WIN)
      expect(state.turnIndex).toEqual(-1)
      expect(state.winnerHands).toEqual([])
    })
  })

  describe("endGame", () => {
    it("should return end game state", () => {
      const deck = [...initialDeck]
      const playerCards = [
        { id: "b", cards: [deck.shift()!, deck.shift()!] },
        { id: "c", cards: [deck.shift()!, deck.shift()!] },
        { id: "a", cards: [deck.shift()!, deck.shift()!] },
      ]
      deck.shift()!
      const communityCards = [deck.shift()!, deck.shift()!, deck.shift()!]
      deck.shift()!
      communityCards.push(deck.shift()!)
      deck.shift()!
      communityCards.push(deck.shift()!)
      const state: GameState = {
        bets: [
          { amount: 10, id: "b", raise: 0, round: 0, type: "smallBlind" },
          { amount: 20, id: "c", raise: 0, round: 0, type: "bigBlind" },
          { amount: 0, id: "a", raise: 0, round: 0, type: "fold" },
          { amount: 0, id: "b", raise: 0, round: 0, type: "fold" },
        ],
        blind: 10,
        communityCards: [],
        dealerIndex: 0,
        deck,
        game: 0,
        playerCards,
        playerChips: { a: 1000, b: 990, c: 1010 },
        playerIds: ["a", "b", "c"],
        playersLeft: [],
        playersReady: [],
        remainingPlayers: ["a", "b", "c"],
        round: 0,
        roundWinners: { c: 30 },
        step: Step.WIN,
        turnIndex: -1,
        winnerHands: [],
      }
      endGame(state)
      expect(state.dealerIndex).toEqual(1)
      expect(state.roundWinners).toEqual({})
      expect(state.step).toEqual(Step.ROUND_END)
      expect(state.turnIndex).toEqual(-1)
      expect(state.winnerHands).toEqual([])
    })
  })

  describe("nextGame", () => {
    it("should start the first game with 2 players", () => {
      const state: GameState = {
        bets: [],
        blind: 10,
        communityCards: [],
        dealerIndex: 0,
        deck: [],
        game: -1,
        playerCards: [],
        playerChips: { a: 1000, b: 1000 },
        playerIds: ["a", "b"],
        playersLeft: [],
        playersReady: [],
        remainingPlayers: ["a", "b"],
        round: 0,
        roundWinners: {},
        step: Step.WAIT,
        turnIndex: 0,
        winnerHands: [],
      }
      nextGame(state)
      // "a" is dealer and small blind, "b" is big blind
      expect(state.bets).toEqual([
        { amount: 10, id: "a", raise: 0, round: 0, type: "smallBlind" },
        { amount: 20, id: "b", raise: 0, round: 0, type: "bigBlind" },
      ])
      expect(state.communityCards).toEqual([])
      expect(state.dealerIndex).toEqual(0)
      expect(state.deck.length).toEqual(52 - 2 - 2)
      expect(state.game).toEqual(0)
      expect(state.playerCards[0].id).toEqual("b")
      expect(state.playerCards[0].cards.length).toEqual(2)
      expect(state.playerCards[1].id).toEqual("a")
      expect(state.playerCards[1].cards.length).toEqual(2)
      expect(state.playerChips).toEqual({ a: 990, b: 980 })
      expect(state.playersReady).toEqual([])
      expect(state.remainingPlayers).toEqual(["a", "b"])
      expect(state.round).toEqual(0)
      expect(state.roundWinners).toEqual({})
      expect(state.step).toEqual(Step.PLAY)
      expect(state.turnIndex).toEqual(1)
      expect(
        getPlayerOrder(state.remainingPlayers, state.dealerIndex)[
          state.turnIndex
        ]
      ).toEqual("a")
      expect(state.winnerHands).toEqual([])
    })

    it("should start the first game with 3 players", () => {
      const state: GameState = {
        bets: [],
        blind: 10,
        communityCards: [],
        dealerIndex: 0,
        deck: [],
        game: -1,
        playerCards: [],
        playerChips: { a: 1000, b: 1000, c: 1000 },
        playerIds: ["a", "b", "c"],
        playersLeft: [],
        playersReady: [],
        remainingPlayers: ["a", "b", "c"],
        round: 0,
        roundWinners: {},
        step: Step.WAIT,
        turnIndex: 0,
        winnerHands: [],
      }
      nextGame(state)
      // "a" is dealer, "b" is small blind, "c" is big blind
      expect(state.bets).toEqual([
        { amount: 10, id: "b", raise: 0, round: 0, type: "smallBlind" },
        { amount: 20, id: "c", raise: 0, round: 0, type: "bigBlind" },
      ])
      expect(state.communityCards).toEqual([])
      expect(state.dealerIndex).toEqual(0)
      expect(state.deck.length).toEqual(52 - 2 - 2 - 2)
      expect(state.game).toEqual(0)
      expect(state.playerCards[0].id).toEqual("b")
      expect(state.playerCards[0].cards.length).toEqual(2)
      expect(state.playerCards[1].id).toEqual("c")
      expect(state.playerCards[1].cards.length).toEqual(2)
      expect(state.playerCards[2].id).toEqual("a")
      expect(state.playerCards[2].cards.length).toEqual(2)
      expect(state.playerChips).toEqual({ a: 1000, b: 990, c: 980 })
      expect(state.playersReady).toEqual([])
      expect(state.remainingPlayers).toEqual(["a", "b", "c"])
      expect(state.round).toEqual(0)
      expect(state.roundWinners).toEqual({})
      expect(state.step).toEqual(Step.PLAY)
      expect(state.turnIndex).toEqual(2)
      expect(
        getPlayerOrder(state.remainingPlayers, state.dealerIndex)[
          state.turnIndex
        ]
      ).toEqual("a")
      expect(state.winnerHands).toEqual([])
    })
  })

  describe("nextRound", () => {
    it("should start first round (flop)", () => {
      const deck = [...initialDeck]
      const playerCards = [
        { id: "b", cards: [deck.shift()!, deck.shift()!] },
        { id: "c", cards: [deck.shift()!, deck.shift()!] },
        { id: "a", cards: [deck.shift()!, deck.shift()!] },
      ]
      const state: GameState = {
        bets: [
          { amount: 10, id: "b", raise: 0, round: 0, type: "smallBlind" },
          { amount: 20, id: "c", raise: 0, round: 0, type: "bigBlind" },
          { amount: 20, id: "a", raise: 0, round: 0, type: "call" },
          { amount: 10, id: "b", raise: 0, round: 0, type: "call" },
          { amount: 0, id: "c", raise: 0, round: 0, type: "check" },
        ],
        blind: 10,
        communityCards: [],
        dealerIndex: 0,
        deck,
        game: 0,
        playerCards,
        playerChips: { a: 980, b: 980, c: 980 },
        playerIds: ["a", "b", "c"],
        playersLeft: [],
        playersReady: [],
        remainingPlayers: ["a", "b", "c"],
        round: 0,
        roundWinners: {},
        step: Step.PLAY,
        turnIndex: 1,
        winnerHands: [],
      }
      nextRound(state, [])
      expect(state.communityCards.length).toEqual(3)
      expect(state.dealerIndex).toEqual(0)
      expect(state.deck.length).toEqual(52 - 2 - 2 - 2 - 1 - 3)
      expect(state.game).toEqual(0)
      expect(state.playerCards[0].id).toEqual("b")
      expect(state.playerCards[0].cards.length).toEqual(2)
      expect(state.playerCards[1].id).toEqual("c")
      expect(state.playerCards[1].cards.length).toEqual(2)
      expect(state.playerCards[2].id).toEqual("a")
      expect(state.playerCards[2].cards.length).toEqual(2)
      expect(state.playerChips).toEqual({ a: 980, b: 980, c: 980 })
      expect(state.playersReady).toEqual([])
      expect(state.remainingPlayers).toEqual(["a", "b", "c"])
      expect(state.round).toEqual(1)
      expect(state.roundWinners).toEqual({})
      expect(state.step).toEqual(Step.PLAY)
      expect(state.turnIndex).toEqual(0)
      expect(
        getPlayerOrder(state.remainingPlayers, state.dealerIndex)[
          state.turnIndex
        ]
      ).toEqual("b")
      expect(state.winnerHands).toEqual([])
    })

    it("should start second round (turn)", () => {
      const deck = [...initialDeck]
      const playerCards = [
        { id: "b", cards: [deck.shift()!, deck.shift()!] },
        { id: "c", cards: [deck.shift()!, deck.shift()!] },
        { id: "a", cards: [deck.shift()!, deck.shift()!] },
      ]
      deck.shift()!
      const communityCards = [deck.shift()!, deck.shift()!, deck.shift()!]
      const state: GameState = {
        bets: [
          { amount: 10, id: "b", raise: 0, round: 0, type: "smallBlind" },
          { amount: 20, id: "c", raise: 0, round: 0, type: "bigBlind" },
          { amount: 20, id: "a", raise: 0, round: 0, type: "call" },
          { amount: 10, id: "b", raise: 0, round: 0, type: "call" },
          { amount: 0, id: "c", raise: 0, round: 0, type: "check" },
          { amount: 0, id: "b", raise: 0, round: 1, type: "check" },
          { amount: 0, id: "c", raise: 0, round: 1, type: "check" },
          { amount: 0, id: "a", raise: 0, round: 1, type: "check" },
        ],
        blind: 10,
        communityCards,
        dealerIndex: 0,
        deck,
        game: 0,
        playerCards,
        playerChips: { a: 980, b: 980, c: 980 },
        playerIds: ["a", "b", "c"],
        playersLeft: [],
        playersReady: [],
        remainingPlayers: ["a", "b", "c"],
        round: 1,
        roundWinners: {},
        step: Step.PLAY,
        turnIndex: 1,
        winnerHands: [],
      }
      nextRound(state, [])
      expect(state.communityCards.length).toEqual(4)
      expect(state.dealerIndex).toEqual(0)
      expect(state.deck.length).toEqual(52 - 2 - 2 - 2 - 1 - 3 - 1 - 1)
      expect(state.game).toEqual(0)
      expect(state.playerCards[0].id).toEqual("b")
      expect(state.playerCards[0].cards.length).toEqual(2)
      expect(state.playerCards[1].id).toEqual("c")
      expect(state.playerCards[1].cards.length).toEqual(2)
      expect(state.playerCards[2].id).toEqual("a")
      expect(state.playerCards[2].cards.length).toEqual(2)
      expect(state.playerChips).toEqual({ a: 980, b: 980, c: 980 })
      expect(state.playersReady).toEqual([])
      expect(state.remainingPlayers).toEqual(["a", "b", "c"])
      expect(state.round).toEqual(2)
      expect(state.roundWinners).toEqual({})
      expect(state.step).toEqual(Step.PLAY)
      expect(state.turnIndex).toEqual(0)
      expect(
        getPlayerOrder(state.remainingPlayers, state.dealerIndex)[
          state.turnIndex
        ]
      ).toEqual("b")
      expect(state.winnerHands).toEqual([])
    })

    it("should start third round (river)", () => {
      const deck = [...initialDeck]
      const playerCards = [
        { id: "b", cards: [deck.shift()!, deck.shift()!] },
        { id: "c", cards: [deck.shift()!, deck.shift()!] },
        { id: "a", cards: [deck.shift()!, deck.shift()!] },
      ]
      deck.shift()!
      const communityCards = [deck.shift()!, deck.shift()!, deck.shift()!]
      deck.shift()!
      communityCards.push(deck.shift()!)
      const state: GameState = {
        bets: [
          { amount: 10, id: "b", raise: 0, round: 0, type: "smallBlind" },
          { amount: 20, id: "c", raise: 0, round: 0, type: "bigBlind" },
          { amount: 20, id: "a", raise: 0, round: 0, type: "call" },
          { amount: 10, id: "b", raise: 0, round: 0, type: "call" },
          { amount: 0, id: "c", raise: 0, round: 0, type: "check" },
          { amount: 0, id: "b", raise: 0, round: 1, type: "check" },
          { amount: 0, id: "c", raise: 0, round: 1, type: "check" },
          { amount: 0, id: "a", raise: 0, round: 1, type: "check" },
          { amount: 0, id: "b", raise: 0, round: 2, type: "check" },
          { amount: 0, id: "c", raise: 0, round: 2, type: "check" },
          { amount: 0, id: "a", raise: 0, round: 2, type: "check" },
        ],
        blind: 10,
        communityCards,
        dealerIndex: 0,
        deck,
        game: 0,
        playerCards,
        playerChips: { a: 980, b: 980, c: 980 },
        playerIds: ["a", "b", "c"],
        playersLeft: [],
        playersReady: [],
        remainingPlayers: ["a", "b", "c"],
        round: 2,
        roundWinners: {},
        step: Step.PLAY,
        turnIndex: 1,
        winnerHands: [],
      }
      nextRound(state, [])
      expect(state.communityCards.length).toEqual(5)
      expect(state.dealerIndex).toEqual(0)
      expect(state.deck.length).toEqual(52 - 2 - 2 - 2 - 1 - 3 - 1 - 1 - 1 - 1)
      expect(state.game).toEqual(0)
      expect(state.playerCards[0].id).toEqual("b")
      expect(state.playerCards[0].cards.length).toEqual(2)
      expect(state.playerCards[1].id).toEqual("c")
      expect(state.playerCards[1].cards.length).toEqual(2)
      expect(state.playerCards[2].id).toEqual("a")
      expect(state.playerCards[2].cards.length).toEqual(2)
      expect(state.playerChips).toEqual({ a: 980, b: 980, c: 980 })
      expect(state.playersReady).toEqual([])
      expect(state.remainingPlayers).toEqual(["a", "b", "c"])
      expect(state.round).toEqual(3)
      expect(state.roundWinners).toEqual({})
      expect(state.step).toEqual(Step.PLAY)
      expect(state.turnIndex).toEqual(0)
      expect(
        getPlayerOrder(state.remainingPlayers, state.dealerIndex)[
          state.turnIndex
        ]
      ).toEqual("b")
      expect(state.winnerHands).toEqual([])
    })

    it("should start fourth round (showdown)", () => {
      const deck = [...initialDeck]
      const playerCards = [
        { id: "b", cards: [deck.shift()!, deck.shift()!] },
        { id: "c", cards: [deck.shift()!, deck.shift()!] },
        { id: "a", cards: [deck.shift()!, deck.shift()!] },
      ]
      deck.shift()!
      const communityCards = [deck.shift()!, deck.shift()!, deck.shift()!]
      deck.shift()!
      communityCards.push(deck.shift()!)
      deck.shift()!
      communityCards.push(deck.shift()!)
      const state: GameState = {
        bets: [
          { amount: 10, id: "b", raise: 0, round: 0, type: "smallBlind" },
          { amount: 20, id: "c", raise: 0, round: 0, type: "bigBlind" },
          { amount: 20, id: "a", raise: 0, round: 0, type: "call" },
          { amount: 10, id: "b", raise: 0, round: 0, type: "call" },
          { amount: 0, id: "c", raise: 0, round: 0, type: "check" },
          { amount: 0, id: "b", raise: 0, round: 1, type: "check" },
          { amount: 0, id: "c", raise: 0, round: 1, type: "check" },
          { amount: 0, id: "a", raise: 0, round: 1, type: "check" },
          { amount: 0, id: "b", raise: 0, round: 2, type: "check" },
          { amount: 0, id: "c", raise: 0, round: 2, type: "check" },
          { amount: 0, id: "a", raise: 0, round: 2, type: "check" },
          { amount: 0, id: "b", raise: 0, round: 3, type: "check" },
          { amount: 0, id: "c", raise: 0, round: 3, type: "check" },
          { amount: 0, id: "a", raise: 0, round: 3, type: "check" },
        ],
        blind: 10,
        communityCards,
        dealerIndex: 0,
        deck,
        game: 0,
        playerCards,
        playerChips: { a: 980, b: 980, c: 980 },
        playerIds: ["a", "b", "c"],
        playersLeft: [],
        playersReady: [],
        remainingPlayers: ["a", "b", "c"],
        round: 3,
        roundWinners: {},
        step: Step.PLAY,
        turnIndex: 1,
        winnerHands: [],
      }
      nextRound(state, [])
      expect(state.communityCards.length).toEqual(5)
      expect(state.dealerIndex).toEqual(0)
      expect(state.deck.length).toEqual(52 - 2 - 2 - 2 - 1 - 3 - 1 - 1 - 1 - 1)
      expect(state.game).toEqual(0)
      expect(state.playerCards[0].id).toEqual("b")
      expect(state.playerCards[0].cards.length).toEqual(2)
      expect(state.playerCards[1].id).toEqual("c")
      expect(state.playerCards[1].cards.length).toEqual(2)
      expect(state.playerCards[2].id).toEqual("a")
      expect(state.playerCards[2].cards.length).toEqual(2)
      expect(state.playerChips).toEqual({ a: 980, b: 1040, c: 980 })
      expect(state.playersReady).toEqual([])
      expect(state.remainingPlayers).toEqual(["a", "b", "c"])
      expect(state.round).toEqual(4)
      expect(state.roundWinners).toEqual({ b: 60 })
      expect(state.step).toEqual(Step.WIN)
      expect(state.turnIndex).toEqual(-1)
      expect(state.winnerHands[0].id).toEqual("b")
    })

    it("should directly advance to showdown if remaining players are all all-in and trigger game over", () => {
      const deck = [...initialDeck]
      const playerCards = [
        { id: "b", cards: [deck.shift()!, deck.shift()!] },
        { id: "c", cards: [deck.shift()!, deck.shift()!] },
        { id: "a", cards: [deck.shift()!, deck.shift()!] },
      ]
      const state: GameState = {
        bets: [
          { amount: 10, id: "b", raise: 0, round: 0, type: "smallBlind" },
          { amount: 20, id: "c", raise: 0, round: 0, type: "bigBlind" },
          { amount: 1000, id: "a", raise: 980, round: 0, type: "allIn" },
          { amount: 990, id: "b", raise: 0, round: 0, type: "allIn" },
          { amount: 980, id: "c", raise: 0, round: 0, type: "allIn" },
        ],
        blind: 10,
        communityCards: [],
        dealerIndex: 0,
        deck,
        game: 0,
        playerCards,
        playerChips: { a: 0, b: 0, c: 0 },
        playerIds: ["a", "b", "c"],
        playersLeft: [],
        playersReady: [],
        remainingPlayers: ["a", "b", "c"],
        round: 0,
        roundWinners: {},
        step: Step.PLAY,
        turnIndex: 1,
        winnerHands: [],
      }
      nextRound(state, [])
      expect(state.communityCards.length).toEqual(5)
      expect(state.dealerIndex).toEqual(0)
      expect(state.deck.length).toEqual(52 - 2 - 2 - 2 - 1 - 3 - 1 - 1 - 1 - 1)
      expect(state.game).toEqual(0)
      expect(state.playerCards[0].id).toEqual("b")
      expect(state.playerCards[0].cards.length).toEqual(2)
      expect(state.playerCards[1].id).toEqual("c")
      expect(state.playerCards[1].cards.length).toEqual(2)
      expect(state.playerCards[2].id).toEqual("a")
      expect(state.playerCards[2].cards.length).toEqual(2)
      expect(state.playerChips).toEqual({ a: 0, b: 3000, c: 0 })
      expect(state.playersReady).toEqual([])
      expect(state.remainingPlayers).toEqual(["b"])
      expect(state.round).toEqual(4)
      expect(state.roundWinners).toEqual({ b: 3000 })
      expect(state.step).toEqual(Step.WIN)
      expect(state.turnIndex).toEqual(-1)
      expect(state.winnerHands[0].id).toEqual("b")
      expect(Rune.gameOver as Mock).toHaveBeenCalledWith({
        players: { a: "LOST", b: "WON", c: "LOST" },
      })
    })
  })

  describe("startGame", () => {
    it("should initialize the state", () => {
      const state: GameState = {
        bets: [],
        blind: 10,
        communityCards: [],
        dealerIndex: -1,
        deck: [],
        game: -1,
        playerCards: [],
        playerChips: {},
        playerIds: ["a", "b"],
        playersLeft: [],
        playersReady: [],
        remainingPlayers: [],
        round: 0,
        roundWinners: {},
        step: Step.WAIT,
        turnIndex: 0,
        winnerHands: [],
      }
      startGame(state)
      expect(state.game).toEqual(-1)
      expect(state.dealerIndex).toEqual(0)
      expect(state.playerChips).toEqual({ a: 1000, b: 1000 })
      expect(state.remainingPlayers).toEqual(["a", "b"])
    })
  })

  describe("winRound", () => {
    it("should win the round", () => {
      const deck = [...initialDeck]
      const playerCards = [
        { id: "b", cards: [deck.shift()!, deck.shift()!] },
        { id: "c", cards: [deck.shift()!, deck.shift()!] },
        { id: "a", cards: [deck.shift()!, deck.shift()!] },
      ]
      deck.shift()!
      const communityCards = [deck.shift()!, deck.shift()!, deck.shift()!]
      deck.shift()!
      communityCards.push(deck.shift()!)
      deck.shift()!
      communityCards.push(deck.shift()!)
      const state: GameState = {
        bets: [
          { amount: 10, id: "b", raise: 0, round: 0, type: "smallBlind" },
          { amount: 20, id: "c", raise: 0, round: 0, type: "bigBlind" },
          { amount: 0, id: "a", raise: 0, round: 0, type: "fold" },
          { amount: 0, id: "b", raise: 0, round: 0, type: "fold" },
        ],
        blind: 10,
        communityCards,
        dealerIndex: 0,
        deck,
        game: 0,
        playerCards,
        playerChips: { a: 1000, b: 990, c: 980 },
        playerIds: ["a", "b", "c"],
        playersLeft: [],
        playersReady: [],
        remainingPlayers: ["a", "b", "c"],
        round: 0,
        roundWinners: {},
        step: Step.PLAY,
        turnIndex: 1,
        winnerHands: [],
      }
      winRound(state, { c: 30 })
      expect(state.playerChips).toEqual({ a: 1000, b: 990, c: 1010 })
      expect(state.remainingPlayers).toEqual(["a", "b", "c"])
      expect(state.roundWinners).toEqual({ c: 30 })
      expect(state.step).toEqual(Step.WIN)
      expect(state.turnIndex).toEqual(-1)
    })

    it("should win the round (one player left the game)", () => {
      const deck = [...initialDeck]
      const playerCards = [
        { id: "b", cards: [deck.shift()!, deck.shift()!] },
        { id: "c", cards: [deck.shift()!, deck.shift()!] },
      ]
      deck.shift()!
      const communityCards = [deck.shift()!, deck.shift()!, deck.shift()!]
      deck.shift()!
      communityCards.push(deck.shift()!)
      deck.shift()!
      communityCards.push(deck.shift()!)
      const state: GameState = {
        bets: [
          { amount: 10, id: "b", raise: 0, round: 0, type: "smallBlind" },
          { amount: 20, id: "c", raise: 0, round: 0, type: "bigBlind" },
          { amount: 0, id: "b", raise: 0, round: 0, type: "fold" },
        ],
        blind: 10,
        communityCards,
        dealerIndex: 0,
        deck,
        game: 0,
        playerCards,
        playerChips: { a: 1000, b: 990, c: 980 },
        playerIds: ["b", "c"],
        playersLeft: ["a"],
        playersReady: [],
        remainingPlayers: ["b", "c"],
        round: 0,
        roundWinners: {},
        step: Step.PLAY,
        turnIndex: 1,
        winnerHands: [],
      }
      winRound(state, { c: 30 })
      expect(state.playerChips).toEqual({ a: 1000, b: 990, c: 1010 })
      expect(state.remainingPlayers).toEqual(["b", "c"])
      expect(state.roundWinners).toEqual({ c: 30 })
      expect(state.step).toEqual(Step.WIN)
      expect(state.turnIndex).toEqual(-1)
    })

    it("should win the round and trigger game over", () => {
      const deck = [...initialDeck]
      const playerCards = [
        { id: "b", cards: [deck.shift()!, deck.shift()!] },
        { id: "c", cards: [deck.shift()!, deck.shift()!] },
        { id: "a", cards: [deck.shift()!, deck.shift()!] },
      ]
      deck.shift()!
      const communityCards = [deck.shift()!, deck.shift()!, deck.shift()!]
      deck.shift()!
      communityCards.push(deck.shift()!)
      deck.shift()!
      communityCards.push(deck.shift()!)
      const state: GameState = {
        bets: [
          { amount: 10, id: "b", raise: 0, round: 0, type: "smallBlind" },
          { amount: 20, id: "c", raise: 0, round: 0, type: "bigBlind" },
          { amount: 1000, id: "a", raise: 980, round: 0, type: "allIn" },
          { amount: 990, id: "b", raise: 0, round: 0, type: "allIn" },
          { amount: 980, id: "c", raise: 0, round: 0, type: "allIn" },
        ],
        blind: 10,
        communityCards,
        dealerIndex: 0,
        deck,
        game: 0,
        playerCards,
        playerChips: { a: 0, b: 0, c: 0 },
        playerIds: ["a", "b", "c"],
        playersLeft: [],
        playersReady: [],
        remainingPlayers: ["a", "b", "c"],
        round: 0,
        roundWinners: {},
        step: Step.PLAY,
        turnIndex: 1,
        winnerHands: [],
      }
      winRound(state, { b: 3000 })
      expect(state.playerChips).toEqual({ a: 0, b: 3000, c: 0 })
      expect(state.remainingPlayers).toEqual(["b"])
      expect(state.roundWinners).toEqual({ b: 3000 })
      expect(state.step).toEqual(Step.WIN)
      expect(state.turnIndex).toEqual(-1)
      expect(Rune.gameOver as Mock).toHaveBeenCalledWith({
        players: { a: "LOST", b: "WON", c: "LOST" },
      })
    })
  })
})
