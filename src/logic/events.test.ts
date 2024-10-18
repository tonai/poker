import { beforeEach, describe, expect, it, vi } from "vitest"
import { RuneClient } from "rune-sdk"

import { initialDeck } from "../constants"
import { getDealerId, getPlayerOrder } from "../helpers"
import { GameActions, GameState } from "../logic"
import { Step } from "../types"

import { playerLeft } from "./events"
import { nextRound } from "./round"

globalThis.Rune = {
  gameOver: vi.fn(),
} as unknown as RuneClient<GameState, GameActions>

vi.mock("./round.ts", { spy: true })

describe("Event logic", () => {
  describe("playerLeft", () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it("should remove the player if he was already out", () => {
      const state: GameState = {
        bets: [],
        blind: 10,
        communityCards: [],
        dealerIndex: 0,
        deck: [],
        game: 0,
        playerCards: [],
        playerChips: { a: 1500, b: 0, c: 1500, d: 1000 },
        playerIds: ["a", "b", "c", "d"],
        playersLeft: [],
        playersReady: [],
        remainingPlayers: ["a", "c", "d"],
        round: 0,
        roundWinners: {},
        step: Step.PLAY,
        turnIndex: 1,
        winnerHands: [],
      }
      // "b" left
      playerLeft(state, "b")
      expect(state.dealerIndex).toEqual(0)
      expect(state.playerIds).toEqual(["a", "c", "d"])
      expect(state.playersLeft).toEqual([])
      expect(state.remainingPlayers).toEqual(["a", "c", "d"])
      expect(state.round).toEqual(0)
      expect(state.step).toEqual(Step.PLAY)
      expect(state.turnIndex).toEqual(1)
      expect(nextRound).not.toHaveBeenCalled()
    })

    it("should add the player to playersLeft array (step is Step.WIN)", () => {
      const deck = [...initialDeck]
      const playerCards = [
        { id: "b", cards: [deck.shift()!, deck.shift()!] },
        { id: "c", cards: [deck.shift()!, deck.shift()!] },
        { id: "a", cards: [deck.shift()!, deck.shift()!] },
        { id: "d", cards: [deck.shift()!, deck.shift()!] },
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
          { amount: 0, id: "d", raise: 0, round: 0, type: "fold" },
          { amount: 0, id: "a", raise: 0, round: 0, type: "fold" },
          { amount: 0, id: "b", raise: 0, round: 0, type: "fold" },
        ],
        blind: 10,
        communityCards,
        dealerIndex: 0,
        deck,
        game: 0,
        playerCards,
        playerChips: { a: 1000, b: 990, c: 1010, d: 1000 },
        playerIds: ["a", "b", "c", "d"],
        playersLeft: [],
        playersReady: [],
        remainingPlayers: ["a", "b", "c", "d"],
        round: 0,
        roundWinners: { c: 30 },
        step: Step.WIN,
        turnIndex: -1,
        winnerHands: [],
      }
      // "b" left
      playerLeft(state, "b")
      expect(state.dealerIndex).toEqual(0)
      expect(state.playerIds).toEqual(["a", "c", "d"])
      expect(state.playersLeft).toEqual(["b"])
      expect(state.remainingPlayers).toEqual(["a", "c", "d"])
      expect(state.round).toEqual(0)
      expect(state.step).toEqual(Step.WIN)
      expect(state.turnIndex).toEqual(-1)
      expect(nextRound).not.toHaveBeenCalled()
    })

    it("should add the player to playersLeft array (step is Step.ROUND_END)", () => {
      const deck = [...initialDeck]
      const playerCards = [
        { id: "b", cards: [deck.shift()!, deck.shift()!] },
        { id: "c", cards: [deck.shift()!, deck.shift()!] },
        { id: "a", cards: [deck.shift()!, deck.shift()!] },
        { id: "d", cards: [deck.shift()!, deck.shift()!] },
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
          { amount: 0, id: "d", raise: 0, round: 0, type: "fold" },
          { amount: 0, id: "a", raise: 0, round: 0, type: "fold" },
          { amount: 0, id: "b", raise: 0, round: 0, type: "fold" },
        ],
        blind: 10,
        communityCards,
        dealerIndex: 0,
        deck,
        game: 0,
        playerCards,
        playerChips: { a: 1000, b: 990, c: 1010, d: 1000 },
        playerIds: ["a", "b", "c", "d"],
        playersLeft: [],
        playersReady: [],
        remainingPlayers: ["a", "b", "c", "d"],
        round: 0,
        roundWinners: {},
        step: Step.ROUND_END,
        turnIndex: -1,
        winnerHands: [],
      }
      // "b" left
      playerLeft(state, "b")
      expect(state.dealerIndex).toEqual(0)
      expect(state.playerIds).toEqual(["a", "c", "d"])
      expect(state.playersLeft).toEqual(["b"])
      expect(state.remainingPlayers).toEqual(["a", "c", "d"])
      expect(state.round).toEqual(0)
      expect(state.step).toEqual(Step.ROUND_END)
      expect(state.turnIndex).toEqual(-1)
      expect(nextRound).not.toHaveBeenCalled()
    })

    it("should add the player to playersLeft array (left outside his turn and after turnIndex)", () => {
      const deck = [...initialDeck]
      const playerCards = [
        { id: "a", cards: [deck.shift()!, deck.shift()!] },
        { id: "b", cards: [deck.shift()!, deck.shift()!] },
        { id: "c", cards: [deck.shift()!, deck.shift()!] },
        { id: "d", cards: [deck.shift()!, deck.shift()!] },
      ]
      const state: GameState = {
        bets: [
          { amount: 10, id: "b", raise: 0, round: 0, type: "smallBlind" },
          { amount: 20, id: "c", raise: 0, round: 0, type: "bigBlind" },
          { amount: 20, id: "d", raise: 0, round: 0, type: "call" },
          { amount: 20, id: "a", raise: 0, round: 0, type: "call" },
        ],
        blind: 10,
        communityCards: [],
        dealerIndex: 0,
        deck,
        game: 0,
        playerCards,
        playerChips: { a: 980, b: 990, c: 980, d: 980 },
        playerIds: ["a", "b", "c", "d"],
        playersLeft: [],
        playersReady: [],
        remainingPlayers: ["a", "b", "c", "d"],
        round: 0,
        roundWinners: {},
        step: Step.PLAY,
        turnIndex: 0,
        winnerHands: [],
      }
      // "c" left
      playerLeft(state, "c")
      expect(state.dealerIndex).toEqual(0)
      expect(getDealerId(state.remainingPlayers, state.dealerIndex)).toEqual(
        "a"
      )
      expect(state.playerIds).toEqual(["a", "b", "d"])
      expect(state.playersLeft).toEqual(["c"])
      expect(state.remainingPlayers).toEqual(["a", "b", "d"])
      expect(state.round).toEqual(0)
      expect(state.step).toEqual(Step.PLAY)
      expect(state.turnIndex).toEqual(0)
      expect(
        getPlayerOrder(state.remainingPlayers, state.dealerIndex)[
          state.turnIndex
        ]
      ).toEqual("b")
      expect(nextRound).not.toHaveBeenCalled()
      // "d" left
      playerLeft(state, "d")
      expect(state.dealerIndex).toEqual(0)
      expect(getDealerId(state.remainingPlayers, state.dealerIndex)).toEqual(
        "a"
      )
      expect(state.playerIds).toEqual(["a", "b"])
      expect(state.playersLeft).toEqual(["c", "d"])
      expect(state.remainingPlayers).toEqual(["a", "b"])
      expect(state.round).toEqual(0)
      expect(state.step).toEqual(Step.PLAY)
      expect(state.turnIndex).toEqual(0)
      expect(
        getPlayerOrder(state.remainingPlayers, state.dealerIndex)[
          state.turnIndex
        ]
      ).toEqual("b")
      expect(nextRound).not.toHaveBeenCalled()
    })

    it("should add the player to playersLeft array (left outside his turn and before turnIndex)", () => {
      const deck = [...initialDeck]
      const playerCards = [
        { id: "a", cards: [deck.shift()!, deck.shift()!] },
        { id: "b", cards: [deck.shift()!, deck.shift()!] },
        { id: "c", cards: [deck.shift()!, deck.shift()!] },
        { id: "d", cards: [deck.shift()!, deck.shift()!] },
      ]
      const state: GameState = {
        bets: [
          { amount: 10, id: "b", raise: 0, round: 0, type: "smallBlind" },
          { amount: 20, id: "c", raise: 0, round: 0, type: "bigBlind" },
          { amount: 20, id: "d", raise: 0, round: 0, type: "call" },
        ],
        blind: 10,
        communityCards: [],
        dealerIndex: 0,
        deck,
        game: 0,
        playerCards,
        playerChips: { a: 1000, b: 990, c: 980, d: 980 },
        playerIds: ["a", "b", "c", "d"],
        playersLeft: [],
        playersReady: [],
        remainingPlayers: ["a", "b", "c", "d"],
        round: 0,
        roundWinners: {},
        step: Step.PLAY,
        turnIndex: 3,
        winnerHands: [],
      }
      // "c" left
      playerLeft(state, "c")
      expect(state.dealerIndex).toEqual(0)
      expect(getDealerId(state.remainingPlayers, state.dealerIndex)).toEqual(
        "a"
      )
      expect(state.playerIds).toEqual(["a", "b", "d"])
      expect(state.playersLeft).toEqual(["c"])
      expect(state.remainingPlayers).toEqual(["a", "b", "d"])
      expect(state.round).toEqual(0)
      expect(state.step).toEqual(Step.PLAY)
      expect(state.turnIndex).toEqual(2)
      expect(
        getPlayerOrder(state.remainingPlayers, state.dealerIndex)[
          state.turnIndex
        ]
      ).toEqual("a")
      expect(nextRound).not.toHaveBeenCalled()
      // "d" left
      playerLeft(state, "d")
      expect(state.dealerIndex).toEqual(0)
      expect(getDealerId(state.remainingPlayers, state.dealerIndex)).toEqual(
        "a"
      )
      expect(state.playerIds).toEqual(["a", "b"])
      expect(state.playersLeft).toEqual(["c", "d"])
      expect(state.remainingPlayers).toEqual(["a", "b"])
      expect(state.round).toEqual(0)
      expect(state.step).toEqual(Step.PLAY)
      expect(state.turnIndex).toEqual(1)
      expect(
        getPlayerOrder(state.remainingPlayers, state.dealerIndex)[
          state.turnIndex
        ]
      ).toEqual("a")
      expect(nextRound).not.toHaveBeenCalled()
    })

    it("should pass to the next round (last to speak)", () => {
      const deck = [...initialDeck]
      const playerCards = [
        { id: "a", cards: [deck.shift()!, deck.shift()!] },
        { id: "b", cards: [deck.shift()!, deck.shift()!] },
        { id: "c", cards: [deck.shift()!, deck.shift()!] },
        { id: "d", cards: [deck.shift()!, deck.shift()!] },
      ]
      const state: GameState = {
        bets: [
          { amount: 10, id: "b", raise: 0, round: 0, type: "smallBlind" },
          { amount: 20, id: "c", raise: 0, round: 0, type: "bigBlind" },
          { amount: 20, id: "d", raise: 0, round: 0, type: "call" },
          { amount: 20, id: "a", raise: 0, round: 0, type: "call" },
          { amount: 10, id: "b", raise: 0, round: 0, type: "call" },
        ],
        blind: 10,
        communityCards: [],
        dealerIndex: 0,
        deck,
        game: 0,
        playerCards,
        playerChips: { a: 980, b: 980, c: 980, d: 1000 },
        playerIds: ["a", "b", "c", "d"],
        playersLeft: [],
        playersReady: [],
        remainingPlayers: ["a", "b", "c", "d"],
        round: 0,
        roundWinners: {},
        step: Step.PLAY,
        turnIndex: 1,
        winnerHands: [],
      }
      // "c" left (last to speak)
      playerLeft(state, "c")
      expect(state.dealerIndex).toEqual(0)
      expect(getDealerId(state.remainingPlayers, state.dealerIndex)).toEqual(
        "a"
      )
      expect(state.playerIds).toEqual(["a", "b", "d"])
      expect(state.playersLeft).toEqual(["c"])
      expect(state.remainingPlayers).toEqual(["a", "b", "d"])
      expect(state.round).toEqual(1)
      expect(state.step).toEqual(Step.PLAY)
      expect(state.turnIndex).toEqual(0)
      expect(
        getPlayerOrder(state.remainingPlayers, state.dealerIndex)[
          state.turnIndex
        ]
      ).toEqual("b")
      expect(nextRound).toHaveBeenCalled()
    })

    it("should pass the turn to the next player (left during his turn + last to speak)", () => {
      const deck = [...initialDeck]
      const playerCards = [
        { id: "a", cards: [deck.shift()!, deck.shift()!] },
        { id: "b", cards: [deck.shift()!, deck.shift()!] },
        { id: "c", cards: [deck.shift()!, deck.shift()!] },
        { id: "d", cards: [deck.shift()!, deck.shift()!] },
      ]
      const state: GameState = {
        bets: [
          { amount: 10, id: "b", raise: 0, round: 0, type: "smallBlind" },
          { amount: 20, id: "c", raise: 0, round: 0, type: "bigBlind" },
          { amount: 20, id: "d", raise: 0, round: 0, type: "call" },
          { amount: 20, id: "a", raise: 0, round: 0, type: "call" },
        ],
        blind: 10,
        communityCards: [],
        dealerIndex: 0,
        deck,
        game: 0,
        playerCards,
        playerChips: { a: 980, b: 990, c: 980, d: 980 },
        playerIds: ["a", "b", "c", "d"],
        playersLeft: [],
        playersReady: [],
        remainingPlayers: ["a", "b", "c", "d"],
        round: 0,
        roundWinners: {},
        step: Step.PLAY,
        turnIndex: 0,
        winnerHands: [],
      }
      // "b" left
      playerLeft(state, "b")
      expect(state.dealerIndex).toEqual(0)
      expect(getDealerId(state.remainingPlayers, state.dealerIndex)).toEqual(
        "a"
      )
      expect(state.playerIds).toEqual(["a", "c", "d"])
      expect(state.playersLeft).toEqual(["b"])
      expect(state.remainingPlayers).toEqual(["a", "c", "d"])
      expect(state.round).toEqual(0)
      expect(state.step).toEqual(Step.PLAY)
      expect(state.turnIndex).toEqual(0)
      expect(
        getPlayerOrder(state.remainingPlayers, state.dealerIndex)[
          state.turnIndex
        ]
      ).toEqual("c")
      expect(nextRound).not.toHaveBeenCalled()
      // "c" left (last to speak)
      playerLeft(state, "c")
      expect(state.dealerIndex).toEqual(0)
      expect(getDealerId(state.remainingPlayers, state.dealerIndex)).toEqual(
        "a"
      )
      expect(state.playerIds).toEqual(["a", "d"])
      expect(state.playersLeft).toEqual(["b", "c"])
      expect(state.remainingPlayers).toEqual(["a", "d"])
      expect(state.round).toEqual(1)
      expect(state.step).toEqual(Step.PLAY)
      expect(state.turnIndex).toEqual(0)
      expect(
        getPlayerOrder(state.remainingPlayers, state.dealerIndex)[
          state.turnIndex
        ]
      ).toEqual("d")
      expect(nextRound).toHaveBeenCalled()
    })

    it("should pass the dealer button to the next player (left outside his turn)", () => {
      const deck = [...initialDeck]
      const playerCards = [
        { id: "a", cards: [deck.shift()!, deck.shift()!] },
        { id: "b", cards: [deck.shift()!, deck.shift()!] },
        { id: "c", cards: [deck.shift()!, deck.shift()!] },
        { id: "d", cards: [deck.shift()!, deck.shift()!] },
      ]
      const state: GameState = {
        bets: [
          { amount: 10, id: "a", raise: 0, round: 0, type: "smallBlind" },
          { amount: 20, id: "b", raise: 0, round: 0, type: "bigBlind" },
        ],
        blind: 10,
        communityCards: [],
        dealerIndex: 0,
        deck,
        game: 0,
        playerCards,
        playerChips: { a: 990, b: 980, c: 1000, d: 1000 },
        playerIds: ["a", "b", "c", "d"],
        playersLeft: [],
        playersReady: [],
        remainingPlayers: ["a", "b", "c", "d"],
        round: 0,
        roundWinners: {},
        step: Step.PLAY,
        turnIndex: 1,
        winnerHands: [],
      }
      // "a" left
      playerLeft(state, "a")
      expect(state.dealerIndex).toEqual(0)
      expect(getDealerId(state.remainingPlayers, state.dealerIndex)).toEqual(
        "b"
      )
      expect(state.playerIds).toEqual(["b", "c", "d"])
      expect(state.playersLeft).toEqual(["a"])
      expect(state.remainingPlayers).toEqual(["b", "c", "d"])
      expect(state.round).toEqual(0)
      expect(state.step).toEqual(Step.PLAY)
      expect(state.turnIndex).toEqual(0)
      expect(
        getPlayerOrder(state.remainingPlayers, state.dealerIndex)[
          state.turnIndex
        ]
      ).toEqual("c")
      expect(nextRound).not.toHaveBeenCalled()
      // "b" left
      playerLeft(state, "b")
      expect(state.dealerIndex).toEqual(0)
      expect(getDealerId(state.remainingPlayers, state.dealerIndex)).toEqual(
        "c"
      )
      expect(state.playerIds).toEqual(["c", "d"])
      expect(state.playersLeft).toEqual(["a", "b"])
      expect(state.remainingPlayers).toEqual(["c", "d"])
      expect(state.round).toEqual(0)
      expect(state.step).toEqual(Step.PLAY)
      expect(state.turnIndex).toEqual(1)
      expect(
        getPlayerOrder(state.remainingPlayers, state.dealerIndex)[
          state.turnIndex
        ]
      ).toEqual("c")
      expect(nextRound).not.toHaveBeenCalled()
    })

    it("should pass the dealer button to the next player (left during his turn)", () => {
      const deck = [...initialDeck]
      const playerCards = [
        { id: "a", cards: [deck.shift()!, deck.shift()!] },
        { id: "b", cards: [deck.shift()!, deck.shift()!] },
        { id: "c", cards: [deck.shift()!, deck.shift()!] },
        { id: "d", cards: [deck.shift()!, deck.shift()!] },
      ]
      const state: GameState = {
        bets: [
          { amount: 10, id: "a", raise: 0, round: 0, type: "smallBlind" },
          { amount: 20, id: "b", raise: 0, round: 0, type: "bigBlind" },
          { amount: 20, id: "c", raise: 0, round: 0, type: "call" },
        ],
        blind: 10,
        communityCards: [],
        dealerIndex: 3,
        deck,
        game: 0,
        playerCards,
        playerChips: { a: 990, b: 980, c: 980, d: 1000 },
        playerIds: ["a", "b", "c", "d"],
        playersLeft: [],
        playersReady: [],
        remainingPlayers: ["a", "b", "c", "d"],
        round: 0,
        roundWinners: {},
        step: Step.PLAY,
        turnIndex: 3,
        winnerHands: [],
      }
      // "d" left
      playerLeft(state, "d")
      expect(state.dealerIndex).toEqual(0)
      expect(getDealerId(state.remainingPlayers, state.dealerIndex)).toEqual(
        "a"
      )
      expect(state.playerIds).toEqual(["a", "b", "c"])
      expect(state.playersLeft).toEqual(["d"])
      expect(state.remainingPlayers).toEqual(["a", "b", "c"])
      expect(state.round).toEqual(0)
      expect(state.step).toEqual(Step.PLAY)
      expect(state.turnIndex).toEqual(2)
      expect(
        getPlayerOrder(state.remainingPlayers, state.dealerIndex)[
          state.turnIndex
        ]
      ).toEqual("a")
      expect(nextRound).not.toHaveBeenCalled()
      // "a" left
      playerLeft(state, "a")
      expect(state.dealerIndex).toEqual(0)
      expect(getDealerId(state.remainingPlayers, state.dealerIndex)).toEqual(
        "b"
      )
      expect(state.playerIds).toEqual(["b", "c"])
      expect(state.playersLeft).toEqual(["d", "a"])
      expect(state.remainingPlayers).toEqual(["b", "c"])
      expect(state.round).toEqual(0)
      expect(state.step).toEqual(Step.PLAY)
      expect(state.turnIndex).toEqual(1)
      expect(
        getPlayerOrder(state.remainingPlayers, state.dealerIndex)[
          state.turnIndex
        ]
      ).toEqual("b")
      expect(nextRound).not.toHaveBeenCalled()
    })
  })
})
