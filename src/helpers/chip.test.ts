import { describe, expect, it } from "vitest"

import { getShares } from "./chip"

describe("Chip helper", () => {
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
