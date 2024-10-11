import { describe, expect, it } from "vitest"

import { getBetsByPlayers, getChips, getColor, getShares } from "./chip"

describe("Chip helper", () => {
  describe("getBetsByPlayers", () => {
    it("should return the bets grouped by players", () => {
      expect(
        getBetsByPlayers([
          { amount: 5, id: "b", raise: 0, round: 0, type: "smallBlind" },
          { amount: 10, id: "c", raise: 0, round: 0, type: "bigBlind" },
          { amount: 10, id: "a", raise: 0, round: 0, type: "call" },
          { amount: 5, id: "b", raise: 0, round: 0, type: "call" },
          { amount: 0, id: "b", raise: 0, round: 1, type: "check" },
          { amount: 100, id: "c", raise: 100, round: 1, type: "raise" },
          { amount: 300, id: "a", raise: 200, round: 1, type: "raise" },
          { amount: 0, id: "b", raise: 0, round: 1, type: "fold" },
          { amount: 200, id: "c", raise: 0, round: 1, type: "call" },
          { amount: 200, id: "c", raise: 200, round: 2, type: "raise" },
          { amount: 100, id: "a", raise: 0, round: 2, type: "allIn" },
        ])
      ).toEqual({
        a: 410,
        b: 10,
        c: 510,
      })
    })
  })

  describe("getChips", () => {
    it("should amount distributed using available chips", () => {
      expect(getChips(136)).toEqual([100, 20, 10, 5, 1])
      expect(getChips(888)).toEqual([500, 200, 100, 50, 20, 10, 5, 2, 1])
    })
  })

  describe("getColor", () => {
    it("should return the bets grouped by players", () => {
      ;[1000, 500, 200, 100, 50, 20, 10, 5, 2, 1].forEach((chip) =>
        expect(getColor(chip)).toEqual(expect.any(String))
      )
    })
  })

  describe("getShares", () => {
    it("should return the shares between winners", () => {
      expect(
        getShares({ a: 100, b: 200, c: 300, d: 400, e: 400 }, ["d"])
      ).toEqual({ d: 1400 })
      // equality
      expect(
        getShares({ a: 100, b: 200, c: 300, d: 400, e: 400 }, ["d", "e"])
      ).toEqual({ d: 700, e: 700 })
      // b all-in
      expect(
        getShares({ a: 100, b: 200, c: 300, d: 400, e: 400 }, ["b", "d"])
      ).toEqual({ b: 450, d: 950 })
      // b and c all-in
      expect(
        getShares({ a: 100, b: 200, c: 300, d: 400, e: 400 }, ["b", "c", "d"])
      ).toEqual({ b: 300, c: 450, d: 650 })
      // d and e fold
      expect(
        getShares({ a: 100, b: 200, c: 300, d: 400, e: 400 }, ["c"])
      ).toEqual({ c: 1200, d: 100, e: 100 })
      expect(
        getShares({ a: 100, b: 200, c: 300, d: 400, e: 400 }, ["b", "c"])
      ).toEqual({ b: 450, c: 750, d: 100, e: 100 })
    })
  })
})
