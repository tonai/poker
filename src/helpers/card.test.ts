import { describe, expect, it } from "vitest"

import { HandCategory } from "../types"

import {
  compareHands,
  compareRanks,
  getHand,
  getRank,
  getSortedRank,
} from "./card"

describe("Card helper", () => {
  describe("getRank", () => {
    it("should return the rank", () => {
      expect(getRank(2)).toEqual(2)
      expect(getRank(5)).toEqual(5)
      expect(getRank(10)).toEqual(10)
      expect(getRank(11)).toEqual("J")
      expect(getRank(12)).toEqual("Q")
      expect(getRank(13)).toEqual("K")
      expect(getRank(14)).toEqual(1)
    })
  })

  describe("getSortedRank", () => {
    it("should return the string rank for figures", () => {
      expect(getSortedRank(2)).toEqual(2)
      expect(getSortedRank(5)).toEqual(5)
      expect(getSortedRank(10)).toEqual(10)
      expect(getSortedRank("J")).toEqual(11)
      expect(getSortedRank("Q")).toEqual(12)
      expect(getSortedRank("K")).toEqual(13)
      expect(getSortedRank(1)).toEqual(14)
    })
  })

  describe("compareRanks", () => {
    it("should compares two ranks", () => {
      expect(compareRanks(14, 2)).toBeLessThan(0)
      expect(compareRanks(2, 3)).toBeGreaterThan(0)
      expect(compareRanks(14, 14)).toEqual(0)
      expect(compareRanks(11, 11)).toEqual(0)
    })
  })

  describe("getHand", () => {
    it("should return Straight Flush hand", () => {
      // Straight
      expect(
        getHand([
          { rank: 14, suit: "♠" },
          { rank: 10, suit: "♠" },
          { rank: 12, suit: "♠" },
          { rank: 11, suit: "♠" },
          { rank: 13, suit: "♠" },
        ])
      ).toEqual({
        cards: [
          { rank: 10, suit: "♠" },
          { rank: 11, suit: "♠" },
          { rank: 12, suit: "♠" },
          { rank: 13, suit: "♠" },
          { rank: 14, suit: "♠" },
        ],
        category: HandCategory.StraightFlush,
        value1: 14,
      })
      // Texas hold 'em
      expect(
        getHand([
          { rank: 8, suit: "♠" },
          { rank: 10, suit: "♠" },
          { rank: 9, suit: "♠" },
          { rank: 7, suit: "♠" },
          { rank: 11, suit: "♠" },
          { rank: 7, suit: "♥" },
          { rank: 11, suit: "♣" },
        ])
      ).toEqual({
        cards: [
          { rank: 7, suit: "♠" },
          { rank: 8, suit: "♠" },
          { rank: 9, suit: "♠" },
          { rank: 10, suit: "♠" },
          { rank: 11, suit: "♠" },
        ],
        category: HandCategory.StraightFlush,
        value1: 11,
      })
    })

    it("should return Four Of A Kind hand", () => {
      // Straight
      expect(
        getHand([
          { rank: 14, suit: "♠" },
          { rank: 14, suit: "♣" },
          { rank: 2, suit: "♠" },
          { rank: 14, suit: "♥" },
          { rank: 14, suit: "♦" },
        ])
      ).toEqual({
        cards: [
          { rank: 14, suit: "♠" },
          { rank: 14, suit: "♣" },
          { rank: 14, suit: "♥" },
          { rank: 14, suit: "♦" },
          { rank: 2, suit: "♠" },
        ],
        category: HandCategory.FourOfAKind,
        value1: 14,
        value2: 2,
      })
      // Texas hold 'em
      expect(
        getHand([
          { rank: 10, suit: "♠" },
          { rank: 10, suit: "♣" },
          { rank: 2, suit: "♥" },
          { rank: 5, suit: "♣" },
          { rank: 12, suit: "♦" },
          { rank: 10, suit: "♥" },
          { rank: 10, suit: "♦" },
        ])
      ).toEqual({
        cards: [
          { rank: 10, suit: "♠" },
          { rank: 10, suit: "♣" },
          { rank: 10, suit: "♥" },
          { rank: 10, suit: "♦" },
          { rank: 12, suit: "♦" },
        ],
        category: HandCategory.FourOfAKind,
        value1: 10,
        value2: 12,
      })
    })

    it("should return Full House hand", () => {
      // Straight
      expect(
        getHand([
          { rank: 5, suit: "♠" },
          { rank: 5, suit: "♥" },
          { rank: 10, suit: "♦" },
          { rank: 5, suit: "♣" },
          { rank: 10, suit: "♠" },
        ])
      ).toEqual({
        cards: [
          { rank: 5, suit: "♠" },
          { rank: 5, suit: "♥" },
          { rank: 5, suit: "♣" },
          { rank: 10, suit: "♦" },
          { rank: 10, suit: "♠" },
        ],
        category: HandCategory.FullHouse,
        value1: 5,
        value2: 10,
      })
      // Texas hold 'em
      expect(
        getHand([
          { rank: 11, suit: "♠" },
          { rank: 11, suit: "♣" },
          { rank: 12, suit: "♥" },
          { rank: 5, suit: "♣" },
          { rank: 3, suit: "♦" },
          { rank: 11, suit: "♥" },
          { rank: 5, suit: "♦" },
        ])
      ).toEqual({
        cards: [
          { rank: 11, suit: "♠" },
          { rank: 11, suit: "♣" },
          { rank: 11, suit: "♥" },
          { rank: 5, suit: "♣" },
          { rank: 5, suit: "♦" },
        ],
        category: HandCategory.FullHouse,
        value1: 11,
        value2: 5,
      })
    })

    it("should return Flush hand", () => {
      // Straight
      expect(
        getHand([
          { rank: 10, suit: "♣" },
          { rank: 5, suit: "♣" },
          { rank: 12, suit: "♣" },
          { rank: 7, suit: "♣" },
          { rank: 2, suit: "♣" },
        ])
      ).toEqual({
        cards: [
          { rank: 12, suit: "♣" },
          { rank: 10, suit: "♣" },
          { rank: 7, suit: "♣" },
          { rank: 5, suit: "♣" },
          { rank: 2, suit: "♣" },
        ],
        category: HandCategory.Flush,
        value1: 12,
        value2: 10,
        value3: 7,
        value4: 5,
        value5: 2,
      })
      // Texas hold 'em
      expect(
        getHand([
          { rank: 11, suit: "♥" },
          { rank: 5, suit: "♥" },
          { rank: 12, suit: "♥" },
          { rank: 14, suit: "♣" },
          { rank: 3, suit: "♥" },
          { rank: 6, suit: "♥" },
          { rank: 3, suit: "♦" },
        ])
      ).toEqual({
        cards: [
          { rank: 12, suit: "♥" },
          { rank: 11, suit: "♥" },
          { rank: 6, suit: "♥" },
          { rank: 5, suit: "♥" },
          { rank: 3, suit: "♥" },
        ],
        category: HandCategory.Flush,
        value1: 12,
        value2: 11,
        value3: 6,
        value4: 5,
        value5: 3,
      })
    })

    it("should return Straight Flush hand", () => {
      // Straight
      expect(
        getHand([
          { rank: 9, suit: "♦" },
          { rank: 10, suit: "♠" },
          { rank: 12, suit: "♥" },
          { rank: 11, suit: "♣" },
          { rank: 13, suit: "♠" },
        ])
      ).toEqual({
        cards: [
          { rank: 9, suit: "♦" },
          { rank: 10, suit: "♠" },
          { rank: 11, suit: "♣" },
          { rank: 12, suit: "♥" },
          { rank: 13, suit: "♠" },
        ],
        category: HandCategory.Straight,
        value1: 13,
      })
      // Texas hold 'em
      expect(
        getHand([
          { rank: 8, suit: "♠" },
          { rank: 10, suit: "♦" },
          { rank: 9, suit: "♠" },
          { rank: 7, suit: "♦" },
          { rank: 11, suit: "♠" },
          { rank: 12, suit: "♥" },
          { rank: 6, suit: "♣" },
        ])
      ).toEqual({
        cards: [
          { rank: 8, suit: "♠" },
          { rank: 9, suit: "♠" },
          { rank: 10, suit: "♦" },
          { rank: 11, suit: "♠" },
          { rank: 12, suit: "♥" },
        ],
        category: HandCategory.Straight,
        value1: 12,
      })
    })

    it("should return Three Of A Kind hand", () => {
      // Straight
      expect(
        getHand([
          { rank: 2, suit: "♣" },
          { rank: 7, suit: "♦" },
          { rank: 5, suit: "♥" },
          { rank: 7, suit: "♥" },
          { rank: 7, suit: "♣" },
        ])
      ).toEqual({
        cards: [
          { rank: 7, suit: "♦" },
          { rank: 7, suit: "♥" },
          { rank: 7, suit: "♣" },
          { rank: 5, suit: "♥" },
          { rank: 2, suit: "♣" },
        ],
        category: HandCategory.ThreeOfAKind,
        value1: 7,
        value2: 5,
        value3: 2,
      })
      // Texas hold 'em
      expect(
        getHand([
          { rank: 6, suit: "♦" },
          { rank: 6, suit: "♥" },
          { rank: 12, suit: "♥" },
          { rank: 6, suit: "♣" },
          { rank: 4, suit: "♥" },
          { rank: 8, suit: "♥" },
          { rank: 14, suit: "♦" },
        ])
      ).toEqual({
        cards: [
          { rank: 6, suit: "♦" },
          { rank: 6, suit: "♥" },
          { rank: 6, suit: "♣" },
          { rank: 14, suit: "♦" },
          { rank: 12, suit: "♥" },
        ],
        category: HandCategory.ThreeOfAKind,
        value1: 6,
        value2: 14,
        value3: 12,
      })
    })

    it("should return Two Pair hand", () => {
      // Straight
      expect(
        getHand([
          { rank: 4, suit: "♣" },
          { rank: 8, suit: "♦" },
          { rank: 11, suit: "♥" },
          { rank: 8, suit: "♥" },
          { rank: 11, suit: "♣" },
        ])
      ).toEqual({
        cards: [
          { rank: 11, suit: "♥" },
          { rank: 11, suit: "♣" },
          { rank: 8, suit: "♦" },
          { rank: 8, suit: "♥" },
          { rank: 4, suit: "♣" },
        ],
        category: HandCategory.TwoPair,
        value1: 11,
        value2: 8,
        value3: 4,
      })
      // Texas hold 'em
      expect(
        getHand([
          { rank: 8, suit: "♣" },
          { rank: 8, suit: "♥" },
          { rank: 14, suit: "♥" },
          { rank: 11, suit: "♣" },
          { rank: 5, suit: "♥" },
          { rank: 13, suit: "♥" },
          { rank: 14, suit: "♦" },
        ])
      ).toEqual({
        cards: [
          { rank: 14, suit: "♥" },
          { rank: 14, suit: "♦" },
          { rank: 8, suit: "♣" },
          { rank: 8, suit: "♥" },
          { rank: 13, suit: "♥" },
        ],
        category: HandCategory.TwoPair,
        value1: 14,
        value2: 8,
        value3: 13,
      })
    })

    it("should return One Pair hand", () => {
      // Straight
      expect(
        getHand([
          { rank: 8, suit: "♣" },
          { rank: 13, suit: "♦" },
          { rank: 6, suit: "♥" },
          { rank: 13, suit: "♣" },
          { rank: 2, suit: "♥" },
        ])
      ).toEqual({
        cards: [
          { rank: 13, suit: "♦" },
          { rank: 13, suit: "♣" },
          { rank: 8, suit: "♣" },
          { rank: 6, suit: "♥" },
          { rank: 2, suit: "♥" },
        ],
        category: HandCategory.OnePair,
        value1: 13,
        value2: 8,
        value3: 6,
        value4: 2,
      })
      // Texas hold 'em
      expect(
        getHand([
          { rank: 12, suit: "♣" },
          { rank: 8, suit: "♦" },
          { rank: 5, suit: "♥" },
          { rank: 14, suit: "♦" },
          { rank: 12, suit: "♥" },
          { rank: 2, suit: "♣" },
          { rank: 13, suit: "♠" },
        ])
      ).toEqual({
        cards: [
          { rank: 12, suit: "♣" },
          { rank: 12, suit: "♥" },
          { rank: 14, suit: "♦" },
          { rank: 13, suit: "♠" },
          { rank: 8, suit: "♦" },
        ],
        category: HandCategory.OnePair,
        value1: 12,
        value2: 14,
        value3: 13,
        value4: 8,
      })
    })

    it("should return High Card hand", () => {
      // Straight
      expect(
        getHand([
          { rank: 13, suit: "♠" },
          { rank: 8, suit: "♣" },
          { rank: 14, suit: "♦" },
          { rank: 6, suit: "♥" },
          { rank: 2, suit: "♠" },
        ])
      ).toEqual({
        cards: [
          { rank: 14, suit: "♦" },
          { rank: 13, suit: "♠" },
          { rank: 8, suit: "♣" },
          { rank: 6, suit: "♥" },
          { rank: 2, suit: "♠" },
        ],
        category: HandCategory.HighCard,
        value1: 14,
        value2: 13,
        value3: 8,
        value4: 6,
        value5: 2,
      })
      // Texas hold 'em
      expect(
        getHand([
          { rank: 7, suit: "♠" },
          { rank: 2, suit: "♦" },
          { rank: 14, suit: "♥" },
          { rank: 8, suit: "♠" },
          { rank: 10, suit: "♥" },
          { rank: 12, suit: "♣" },
          { rank: 13, suit: "♠" },
        ])
      ).toEqual({
        cards: [
          { rank: 14, suit: "♥" },
          { rank: 13, suit: "♠" },
          { rank: 12, suit: "♣" },
          { rank: 10, suit: "♥" },
          { rank: 8, suit: "♠" },
        ],
        category: HandCategory.HighCard,
        value1: 14,
        value2: 13,
        value3: 12,
        value4: 10,
        value5: 8,
      })
    })
  })

  describe("compareHands", () => {
    it("should compare two hands with different categories", () => {
      expect(
        compareHands(
          {
            cards: [
              { rank: 6, suit: "♦" },
              { rank: 6, suit: "♥" },
              { rank: 6, suit: "♣" },
              { rank: 14, suit: "♦" },
              { rank: 12, suit: "♥" },
            ],
            category: HandCategory.ThreeOfAKind,
            value1: 6,
            value2: 14,
            value3: 12,
          },
          {
            cards: [
              { rank: 14, suit: "♥" },
              { rank: 14, suit: "♦" },
              { rank: 8, suit: "♣" },
              { rank: 8, suit: "♥" },
              { rank: 13, suit: "♥" },
            ],
            category: HandCategory.TwoPair,
            value1: 14,
            value2: 8,
            value3: 13,
          }
        )
      ).toBeLessThan(0)
    })

    it("should compare two Four Of A Kind hands", () => {
      // value1
      expect(
        compareHands(
          {
            cards: [
              { rank: 14, suit: "♠" },
              { rank: 14, suit: "♣" },
              { rank: 14, suit: "♥" },
              { rank: 14, suit: "♦" },
              { rank: 2, suit: "♠" },
            ],
            category: HandCategory.FourOfAKind,
            value1: 14,
            value2: 2,
          },
          {
            cards: [
              { rank: 10, suit: "♠" },
              { rank: 10, suit: "♣" },
              { rank: 10, suit: "♥" },
              { rank: 10, suit: "♦" },
              { rank: 12, suit: "♦" },
            ],
            category: HandCategory.FourOfAKind,
            value1: 10,
            value2: 12,
          }
        )
      ).toBeLessThan(0)
      // value2
      expect(
        compareHands(
          {
            cards: [
              { rank: 10, suit: "♠" },
              { rank: 10, suit: "♣" },
              { rank: 10, suit: "♥" },
              { rank: 10, suit: "♦" },
              { rank: 2, suit: "♠" },
            ],
            category: HandCategory.FourOfAKind,
            value1: 10,
            value2: 2,
          },
          {
            cards: [
              { rank: 10, suit: "♠" },
              { rank: 10, suit: "♣" },
              { rank: 10, suit: "♥" },
              { rank: 10, suit: "♦" },
              { rank: 12, suit: "♦" },
            ],
            category: HandCategory.FourOfAKind,
            value1: 10,
            value2: 12,
          }
        )
      ).toBeGreaterThan(0)
      // equals
      expect(
        compareHands(
          {
            cards: [
              { rank: 10, suit: "♠" },
              { rank: 10, suit: "♣" },
              { rank: 10, suit: "♥" },
              { rank: 10, suit: "♦" },
              { rank: 2, suit: "♠" },
            ],
            category: HandCategory.FourOfAKind,
            value1: 10,
            value2: 2,
          },
          {
            cards: [
              { rank: 10, suit: "♠" },
              { rank: 10, suit: "♣" },
              { rank: 10, suit: "♥" },
              { rank: 10, suit: "♦" },
              { rank: 2, suit: "♦" },
            ],
            category: HandCategory.FourOfAKind,
            value1: 10,
            value2: 2,
          }
        )
      ).toEqual(0)
    })

    it("should compare two Full House hands", () => {
      // value1
      expect(
        compareHands(
          {
            cards: [
              { rank: 5, suit: "♠" },
              { rank: 5, suit: "♥" },
              { rank: 5, suit: "♣" },
              { rank: 10, suit: "♦" },
              { rank: 10, suit: "♠" },
            ],
            category: HandCategory.FullHouse,
            value1: 5,
            value2: 10,
          },
          {
            cards: [
              { rank: 11, suit: "♠" },
              { rank: 11, suit: "♣" },
              { rank: 11, suit: "♥" },
              { rank: 5, suit: "♣" },
              { rank: 5, suit: "♦" },
            ],
            category: HandCategory.FullHouse,
            value1: 11,
            value2: 5,
          }
        )
      ).toBeGreaterThan(0)
      // value2
      expect(
        compareHands(
          {
            cards: [
              { rank: 11, suit: "♠" },
              { rank: 11, suit: "♣" },
              { rank: 11, suit: "♥" },
              { rank: 10, suit: "♦" },
              { rank: 10, suit: "♠" },
            ],
            category: HandCategory.FullHouse,
            value1: 11,
            value2: 10,
          },
          {
            cards: [
              { rank: 11, suit: "♠" },
              { rank: 11, suit: "♣" },
              { rank: 11, suit: "♥" },
              { rank: 5, suit: "♣" },
              { rank: 5, suit: "♦" },
            ],
            category: HandCategory.FullHouse,
            value1: 11,
            value2: 5,
          }
        )
      ).toBeLessThan(0)
      // Equals
      expect(
        compareHands(
          {
            cards: [
              { rank: 11, suit: "♠" },
              { rank: 11, suit: "♣" },
              { rank: 11, suit: "♥" },
              { rank: 10, suit: "♦" },
              { rank: 10, suit: "♠" },
            ],
            category: HandCategory.FullHouse,
            value1: 11,
            value2: 10,
          },
          {
            cards: [
              { rank: 11, suit: "♠" },
              { rank: 11, suit: "♣" },
              { rank: 11, suit: "♥" },
              { rank: 10, suit: "♣" },
              { rank: 10, suit: "♥" },
            ],
            category: HandCategory.FullHouse,
            value1: 11,
            value2: 10,
          }
        )
      ).toEqual(0)
    })

    it("should compare two Flush hands", () => {
      // value1
      expect(
        compareHands(
          {
            cards: [
              { rank: 13, suit: "♣" },
              { rank: 10, suit: "♣" },
              { rank: 7, suit: "♣" },
              { rank: 5, suit: "♣" },
              { rank: 2, suit: "♣" },
            ],
            category: HandCategory.Flush,
            value1: 13,
            value2: 10,
            value3: 7,
            value4: 5,
            value5: 2,
          },
          {
            cards: [
              { rank: 12, suit: "♥" },
              { rank: 11, suit: "♥" },
              { rank: 6, suit: "♥" },
              { rank: 5, suit: "♥" },
              { rank: 3, suit: "♥" },
            ],
            category: HandCategory.Flush,
            value1: 12,
            value2: 11,
            value3: 6,
            value4: 5,
            value5: 3,
          }
        )
      ).toBeLessThan(0)
      // value2
      expect(
        compareHands(
          {
            cards: [
              { rank: 12, suit: "♣" },
              { rank: 10, suit: "♣" },
              { rank: 7, suit: "♣" },
              { rank: 5, suit: "♣" },
              { rank: 2, suit: "♣" },
            ],
            category: HandCategory.Flush,
            value1: 12,
            value2: 10,
            value3: 7,
            value4: 5,
            value5: 2,
          },
          {
            cards: [
              { rank: 12, suit: "♥" },
              { rank: 11, suit: "♥" },
              { rank: 6, suit: "♥" },
              { rank: 5, suit: "♥" },
              { rank: 3, suit: "♥" },
            ],
            category: HandCategory.Flush,
            value1: 12,
            value2: 11,
            value3: 6,
            value4: 5,
            value5: 3,
          }
        )
      ).toBeGreaterThan(0)
      // value3
      expect(
        compareHands(
          {
            cards: [
              { rank: 12, suit: "♣" },
              { rank: 10, suit: "♣" },
              { rank: 7, suit: "♣" },
              { rank: 5, suit: "♣" },
              { rank: 2, suit: "♣" },
            ],
            category: HandCategory.Flush,
            value1: 12,
            value2: 10,
            value3: 7,
            value4: 5,
            value5: 2,
          },
          {
            cards: [
              { rank: 12, suit: "♥" },
              { rank: 10, suit: "♥" },
              { rank: 6, suit: "♥" },
              { rank: 5, suit: "♥" },
              { rank: 3, suit: "♥" },
            ],
            category: HandCategory.Flush,
            value1: 12,
            value2: 10,
            value3: 6,
            value4: 5,
            value5: 3,
          }
        )
      ).toBeLessThan(0)
      // value4
      expect(
        compareHands(
          {
            cards: [
              { rank: 12, suit: "♣" },
              { rank: 10, suit: "♣" },
              { rank: 7, suit: "♣" },
              { rank: 5, suit: "♣" },
              { rank: 2, suit: "♣" },
            ],
            category: HandCategory.Flush,
            value1: 12,
            value2: 10,
            value3: 7,
            value4: 5,
            value5: 2,
          },
          {
            cards: [
              { rank: 12, suit: "♥" },
              { rank: 10, suit: "♥" },
              { rank: 7, suit: "♥" },
              { rank: 6, suit: "♥" },
              { rank: 3, suit: "♥" },
            ],
            category: HandCategory.Flush,
            value1: 12,
            value2: 10,
            value3: 7,
            value4: 6,
            value5: 3,
          }
        )
      ).toBeGreaterThan(0)
      // value5
      expect(
        compareHands(
          {
            cards: [
              { rank: 12, suit: "♣" },
              { rank: 10, suit: "♣" },
              { rank: 7, suit: "♣" },
              { rank: 5, suit: "♣" },
              { rank: 2, suit: "♣" },
            ],
            category: HandCategory.Flush,
            value1: 12,
            value2: 10,
            value3: 7,
            value4: 5,
            value5: 2,
          },
          {
            cards: [
              { rank: 12, suit: "♥" },
              { rank: 10, suit: "♥" },
              { rank: 7, suit: "♥" },
              { rank: 5, suit: "♥" },
              { rank: 3, suit: "♥" },
            ],
            category: HandCategory.Flush,
            value1: 12,
            value2: 10,
            value3: 7,
            value4: 5,
            value5: 3,
          }
        )
      ).toBeGreaterThan(0)
      // Equals
      expect(
        compareHands(
          {
            cards: [
              { rank: 12, suit: "♣" },
              { rank: 10, suit: "♣" },
              { rank: 7, suit: "♣" },
              { rank: 5, suit: "♣" },
              { rank: 2, suit: "♣" },
            ],
            category: HandCategory.Flush,
            value1: 12,
            value2: 10,
            value3: 7,
            value4: 5,
            value5: 2,
          },
          {
            cards: [
              { rank: 12, suit: "♥" },
              { rank: 10, suit: "♥" },
              { rank: 7, suit: "♥" },
              { rank: 5, suit: "♥" },
              { rank: 2, suit: "♥" },
            ],
            category: HandCategory.Flush,
            value1: 12,
            value2: 10,
            value3: 7,
            value4: 5,
            value5: 2,
          }
        )
      ).toEqual(0)
    })

    it("should compare two Three Of A Kind hands", () => {
      // value1
      expect(
        compareHands(
          {
            cards: [
              { rank: 7, suit: "♦" },
              { rank: 7, suit: "♥" },
              { rank: 7, suit: "♣" },
              { rank: 5, suit: "♥" },
              { rank: 2, suit: "♣" },
            ],
            category: HandCategory.ThreeOfAKind,
            value1: 7,
            value2: 5,
            value3: 2,
          },
          {
            cards: [
              { rank: 6, suit: "♦" },
              { rank: 6, suit: "♥" },
              { rank: 6, suit: "♣" },
              { rank: 14, suit: "♦" },
              { rank: 12, suit: "♥" },
            ],
            category: HandCategory.ThreeOfAKind,
            value1: 6,
            value2: 14,
            value3: 12,
          }
        )
      ).toBeLessThan(0)
      // value2
      expect(
        compareHands(
          {
            cards: [
              { rank: 7, suit: "♦" },
              { rank: 7, suit: "♥" },
              { rank: 7, suit: "♣" },
              { rank: 5, suit: "♥" },
              { rank: 2, suit: "♣" },
            ],
            category: HandCategory.ThreeOfAKind,
            value1: 7,
            value2: 5,
            value3: 2,
          },
          {
            cards: [
              { rank: 7, suit: "♦" },
              { rank: 7, suit: "♥" },
              { rank: 7, suit: "♣" },
              { rank: 14, suit: "♦" },
              { rank: 12, suit: "♥" },
            ],
            category: HandCategory.ThreeOfAKind,
            value1: 7,
            value2: 14,
            value3: 12,
          }
        )
      ).toBeGreaterThan(0)
      // value3
      expect(
        compareHands(
          {
            cards: [
              { rank: 7, suit: "♦" },
              { rank: 7, suit: "♥" },
              { rank: 7, suit: "♣" },
              { rank: 5, suit: "♥" },
              { rank: 2, suit: "♣" },
            ],
            category: HandCategory.ThreeOfAKind,
            value1: 7,
            value2: 5,
            value3: 2,
          },
          {
            cards: [
              { rank: 7, suit: "♦" },
              { rank: 7, suit: "♥" },
              { rank: 7, suit: "♣" },
              { rank: 3, suit: "♦" },
              { rank: 5, suit: "♠" },
            ],
            category: HandCategory.ThreeOfAKind,
            value1: 7,
            value2: 5,
            value3: 3,
          }
        )
      ).toBeGreaterThan(0)
      // Equals
      expect(
        compareHands(
          {
            cards: [
              { rank: 7, suit: "♦" },
              { rank: 7, suit: "♥" },
              { rank: 7, suit: "♣" },
              { rank: 5, suit: "♥" },
              { rank: 2, suit: "♣" },
            ],
            category: HandCategory.ThreeOfAKind,
            value1: 7,
            value2: 5,
            value3: 2,
          },
          {
            cards: [
              { rank: 7, suit: "♦" },
              { rank: 7, suit: "♥" },
              { rank: 7, suit: "♣" },
              { rank: 5, suit: "♦" },
              { rank: 2, suit: "♥" },
            ],
            category: HandCategory.ThreeOfAKind,
            value1: 7,
            value2: 5,
            value3: 2,
          }
        )
      ).toEqual(0)
    })

    it("should compare two Two Pair hands", () => {
      // value1
      expect(
        compareHands(
          {
            cards: [
              { rank: 11, suit: "♥" },
              { rank: 11, suit: "♣" },
              { rank: 8, suit: "♦" },
              { rank: 8, suit: "♥" },
              { rank: 4, suit: "♣" },
            ],
            category: HandCategory.TwoPair,
            value1: 11,
            value2: 8,
            value3: 4,
          },
          {
            cards: [
              { rank: 14, suit: "♥" },
              { rank: 14, suit: "♦" },
              { rank: 8, suit: "♣" },
              { rank: 8, suit: "♥" },
              { rank: 13, suit: "♥" },
            ],
            category: HandCategory.TwoPair,
            value1: 14,
            value2: 8,
            value3: 13,
          }
        )
      ).toBeGreaterThan(0)
      // value2
      expect(
        compareHands(
          {
            cards: [
              { rank: 11, suit: "♥" },
              { rank: 11, suit: "♣" },
              { rank: 9, suit: "♦" },
              { rank: 9, suit: "♥" },
              { rank: 4, suit: "♣" },
            ],
            category: HandCategory.TwoPair,
            value1: 11,
            value2: 9,
            value3: 4,
          },
          {
            cards: [
              { rank: 11, suit: "♥" },
              { rank: 11, suit: "♦" },
              { rank: 8, suit: "♣" },
              { rank: 8, suit: "♥" },
              { rank: 13, suit: "♥" },
            ],
            category: HandCategory.TwoPair,
            value1: 11,
            value2: 8,
            value3: 13,
          }
        )
      ).toBeLessThan(0)
      // value3
      expect(
        compareHands(
          {
            cards: [
              { rank: 11, suit: "♥" },
              { rank: 11, suit: "♣" },
              { rank: 8, suit: "♦" },
              { rank: 8, suit: "♥" },
              { rank: 4, suit: "♣" },
            ],
            category: HandCategory.TwoPair,
            value1: 11,
            value2: 8,
            value3: 4,
          },
          {
            cards: [
              { rank: 11, suit: "♥" },
              { rank: 11, suit: "♦" },
              { rank: 8, suit: "♣" },
              { rank: 8, suit: "♥" },
              { rank: 13, suit: "♥" },
            ],
            category: HandCategory.TwoPair,
            value1: 11,
            value2: 8,
            value3: 13,
          }
        )
      ).toBeGreaterThan(0)
      // Equals
      expect(
        compareHands(
          {
            cards: [
              { rank: 11, suit: "♥" },
              { rank: 11, suit: "♣" },
              { rank: 8, suit: "♦" },
              { rank: 8, suit: "♥" },
              { rank: 4, suit: "♣" },
            ],
            category: HandCategory.TwoPair,
            value1: 11,
            value2: 8,
            value3: 4,
          },
          {
            cards: [
              { rank: 11, suit: "♥" },
              { rank: 11, suit: "♦" },
              { rank: 8, suit: "♣" },
              { rank: 8, suit: "♥" },
              { rank: 4, suit: "♥" },
            ],
            category: HandCategory.TwoPair,
            value1: 11,
            value2: 8,
            value3: 4,
          }
        )
      ).toEqual(0)
    })

    it("should compare two One Pair hands", () => {
      // value1
      expect(
        compareHands(
          {
            cards: [
              { rank: 13, suit: "♦" },
              { rank: 13, suit: "♣" },
              { rank: 8, suit: "♣" },
              { rank: 6, suit: "♥" },
              { rank: 2, suit: "♥" },
            ],
            category: HandCategory.OnePair,
            value1: 13,
            value2: 8,
            value3: 6,
            value4: 2,
          },
          {
            cards: [
              { rank: 12, suit: "♣" },
              { rank: 12, suit: "♥" },
              { rank: 14, suit: "♦" },
              { rank: 13, suit: "♠" },
              { rank: 8, suit: "♦" },
            ],
            category: HandCategory.OnePair,
            value1: 12,
            value2: 14,
            value3: 13,
            value4: 8,
          }
        )
      ).toBeLessThan(0)
      // value2
      expect(
        compareHands(
          {
            cards: [
              { rank: 13, suit: "♦" },
              { rank: 13, suit: "♣" },
              { rank: 8, suit: "♣" },
              { rank: 6, suit: "♥" },
              { rank: 2, suit: "♥" },
            ],
            category: HandCategory.OnePair,
            value1: 13,
            value2: 8,
            value3: 6,
            value4: 2,
          },
          {
            cards: [
              { rank: 13, suit: "♣" },
              { rank: 13, suit: "♥" },
              { rank: 14, suit: "♦" },
              { rank: 10, suit: "♠" },
              { rank: 8, suit: "♦" },
            ],
            category: HandCategory.OnePair,
            value1: 13,
            value2: 14,
            value3: 10,
            value4: 8,
          }
        )
      ).toBeGreaterThan(0)
      // value3
      expect(
        compareHands(
          {
            cards: [
              { rank: 13, suit: "♦" },
              { rank: 13, suit: "♣" },
              { rank: 14, suit: "♣" },
              { rank: 6, suit: "♥" },
              { rank: 2, suit: "♥" },
            ],
            category: HandCategory.OnePair,
            value1: 13,
            value2: 14,
            value3: 6,
            value4: 2,
          },
          {
            cards: [
              { rank: 13, suit: "♣" },
              { rank: 13, suit: "♥" },
              { rank: 14, suit: "♦" },
              { rank: 10, suit: "♠" },
              { rank: 8, suit: "♦" },
            ],
            category: HandCategory.OnePair,
            value1: 13,
            value2: 14,
            value3: 10,
            value4: 8,
          }
        )
      ).toBeGreaterThan(0)
      // value4
      expect(
        compareHands(
          {
            cards: [
              { rank: 13, suit: "♦" },
              { rank: 13, suit: "♣" },
              { rank: 14, suit: "♣" },
              { rank: 10, suit: "♥" },
              { rank: 2, suit: "♥" },
            ],
            category: HandCategory.OnePair,
            value1: 13,
            value2: 14,
            value3: 10,
            value4: 2,
          },
          {
            cards: [
              { rank: 13, suit: "♣" },
              { rank: 13, suit: "♥" },
              { rank: 14, suit: "♦" },
              { rank: 10, suit: "♠" },
              { rank: 8, suit: "♦" },
            ],
            category: HandCategory.OnePair,
            value1: 13,
            value2: 14,
            value3: 10,
            value4: 8,
          }
        )
      ).toBeGreaterThan(0)
      // Equals
      expect(
        compareHands(
          {
            cards: [
              { rank: 13, suit: "♦" },
              { rank: 13, suit: "♣" },
              { rank: 14, suit: "♣" },
              { rank: 10, suit: "♥" },
              { rank: 2, suit: "♥" },
            ],
            category: HandCategory.OnePair,
            value1: 13,
            value2: 14,
            value3: 10,
            value4: 2,
          },
          {
            cards: [
              { rank: 13, suit: "♣" },
              { rank: 13, suit: "♥" },
              { rank: 14, suit: "♦" },
              { rank: 10, suit: "♠" },
              { rank: 2, suit: "♦" },
            ],
            category: HandCategory.OnePair,
            value1: 13,
            value2: 14,
            value3: 10,
            value4: 2,
          }
        )
      ).toEqual(0)
    })

    it("should compare two High Card hands", () => {
      // value1
      expect(
        compareHands(
          {
            cards: [
              { rank: 13, suit: "♦" },
              { rank: 12, suit: "♠" },
              { rank: 8, suit: "♣" },
              { rank: 6, suit: "♥" },
              { rank: 2, suit: "♠" },
            ],
            category: HandCategory.HighCard,
            value1: 13,
            value2: 12,
            value3: 8,
            value4: 6,
            value5: 2,
          },
          {
            cards: [
              { rank: 14, suit: "♥" },
              { rank: 13, suit: "♠" },
              { rank: 12, suit: "♣" },
              { rank: 10, suit: "♥" },
              { rank: 8, suit: "♠" },
            ],
            category: HandCategory.HighCard,
            value1: 14,
            value2: 13,
            value3: 12,
            value4: 10,
            value5: 8,
          }
        )
      ).toBeGreaterThan(0)
      // value2
      expect(
        compareHands(
          {
            cards: [
              { rank: 14, suit: "♦" },
              { rank: 12, suit: "♠" },
              { rank: 8, suit: "♣" },
              { rank: 6, suit: "♥" },
              { rank: 2, suit: "♠" },
            ],
            category: HandCategory.HighCard,
            value1: 14,
            value2: 12,
            value3: 8,
            value4: 6,
            value5: 2,
          },
          {
            cards: [
              { rank: 14, suit: "♥" },
              { rank: 13, suit: "♠" },
              { rank: 12, suit: "♣" },
              { rank: 10, suit: "♥" },
              { rank: 8, suit: "♠" },
            ],
            category: HandCategory.HighCard,
            value1: 14,
            value2: 13,
            value3: 12,
            value4: 10,
            value5: 8,
          }
        )
      ).toBeGreaterThan(0)
      // value3
      expect(
        compareHands(
          {
            cards: [
              { rank: 14, suit: "♦" },
              { rank: 13, suit: "♠" },
              { rank: 8, suit: "♣" },
              { rank: 6, suit: "♥" },
              { rank: 2, suit: "♠" },
            ],
            category: HandCategory.HighCard,
            value1: 14,
            value2: 13,
            value3: 8,
            value4: 6,
            value5: 2,
          },
          {
            cards: [
              { rank: 14, suit: "♥" },
              { rank: 13, suit: "♠" },
              { rank: 12, suit: "♣" },
              { rank: 10, suit: "♥" },
              { rank: 8, suit: "♠" },
            ],
            category: HandCategory.HighCard,
            value1: 14,
            value2: 13,
            value3: 12,
            value4: 10,
            value5: 8,
          }
        )
      ).toBeGreaterThan(0)
      // value4
      expect(
        compareHands(
          {
            cards: [
              { rank: 14, suit: "♦" },
              { rank: 13, suit: "♠" },
              { rank: 12, suit: "♣" },
              { rank: 6, suit: "♥" },
              { rank: 2, suit: "♠" },
            ],
            category: HandCategory.HighCard,
            value1: 14,
            value2: 13,
            value3: 12,
            value4: 6,
            value5: 2,
          },
          {
            cards: [
              { rank: 14, suit: "♥" },
              { rank: 13, suit: "♠" },
              { rank: 12, suit: "♣" },
              { rank: 10, suit: "♥" },
              { rank: 8, suit: "♠" },
            ],
            category: HandCategory.HighCard,
            value1: 14,
            value2: 13,
            value3: 12,
            value4: 10,
            value5: 8,
          }
        )
      ).toBeGreaterThan(0)
      // value5
      expect(
        compareHands(
          {
            cards: [
              { rank: 14, suit: "♦" },
              { rank: 13, suit: "♠" },
              { rank: 12, suit: "♣" },
              { rank: 10, suit: "♥" },
              { rank: 2, suit: "♠" },
            ],
            category: HandCategory.HighCard,
            value1: 14,
            value2: 13,
            value3: 12,
            value4: 10,
            value5: 2,
          },
          {
            cards: [
              { rank: 14, suit: "♥" },
              { rank: 13, suit: "♠" },
              { rank: 12, suit: "♣" },
              { rank: 10, suit: "♥" },
              { rank: 8, suit: "♠" },
            ],
            category: HandCategory.HighCard,
            value1: 14,
            value2: 13,
            value3: 12,
            value4: 10,
            value5: 8,
          }
        )
      ).toBeGreaterThan(0)
      // Equals
      expect(
        compareHands(
          {
            cards: [
              { rank: 14, suit: "♦" },
              { rank: 13, suit: "♠" },
              { rank: 12, suit: "♣" },
              { rank: 10, suit: "♥" },
              { rank: 8, suit: "♠" },
            ],
            category: HandCategory.HighCard,
            value1: 14,
            value2: 13,
            value3: 12,
            value4: 10,
            value5: 8,
          },
          {
            cards: [
              { rank: 14, suit: "♥" },
              { rank: 13, suit: "♠" },
              { rank: 12, suit: "♣" },
              { rank: 10, suit: "♥" },
              { rank: 8, suit: "♠" },
            ],
            category: HandCategory.HighCard,
            value1: 14,
            value2: 13,
            value3: 12,
            value4: 10,
            value5: 8,
          }
        )
      ).toEqual(0)
    })
  })
})
