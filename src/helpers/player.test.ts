import { describe, expect, it } from "vitest"

import { getPlayerOrder } from "./player"

describe("Player helper", () => {
  describe("getPlayerOrder", () => {
    it("return the player order depending on the dealer position", () => {
      expect(getPlayerOrder(["a", "b", "c"], 0)).toEqual(["b", "c", "a"])
      expect(getPlayerOrder(["a", "b", "c"], 1)).toEqual(["c", "a", "b"])
      expect(getPlayerOrder(["a", "b", "c"], 2)).toEqual(["a", "b", "c"])
    })

    it("skip players and return the player order", () => {
      expect(getPlayerOrder(["a", "b", "c", "d", "e"], 0, ["a", "b"])).toEqual([
        "c",
        "d",
        "e",
      ])
      expect(getPlayerOrder(["a", "b", "c", "d", "e"], 1, ["a", "b"])).toEqual([
        "c",
        "d",
        "e",
      ])
      expect(getPlayerOrder(["a", "b", "c", "d", "e"], 2, ["a", "b"])).toEqual([
        "d",
        "e",
        "c",
      ])
      expect(getPlayerOrder(["a", "b", "c", "d", "e"], 3, ["a", "b"])).toEqual([
        "e",
        "c",
        "d",
      ])
      expect(getPlayerOrder(["a", "b", "c", "d", "e"], 4, ["a", "b"])).toEqual([
        "c",
        "d",
        "e",
      ])
    })
  })
})
