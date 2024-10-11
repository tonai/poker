import { describe, expect, it } from "vitest"

import { getAction } from "./action"

describe("Action helper", () => {
  describe("getAction", () => {
    it("blinds", () => {
      expect(getAction(10, 0, 1000, "bigBlind")).toEqual({
        type: "bigBlind",
        amount: 10,
        raise: 0,
      })
    })

    it("checks", () => {
      expect(getAction(0, 0, 1000)).toEqual({
        type: "check",
        amount: 0,
        raise: 0,
      })
    })

    it("calls", () => {
      expect(getAction(20, 0, 1000)).toEqual({
        type: "call",
        amount: 20,
        raise: 0,
      })
    })

    it("raises (first)", () => {
      expect(getAction(0, 100, 1000)).toEqual({
        type: "raise",
        amount: 100,
        raise: 100,
      })
    })

    it("raises (second)", () => {
      expect(getAction(100, 200, 1000)).toEqual({
        type: "raise",
        amount: 300,
        raise: 200,
      })
    })

    it("all-in (raise)", () => {
      expect(getAction(0, 200, 200)).toEqual({
        type: "allIn",
        amount: 200,
        raise: 200,
      })
    })

    it("all-in (not enough chips)", () => {
      expect(getAction(200, 0, 100)).toEqual({
        type: "allIn",
        amount: 100,
        raise: 0,
      })
    })
  })
})
