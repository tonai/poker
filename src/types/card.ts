// export enum Suit {
//   CLUBS,
//   SPADES,
//   HEARTS,
//   DIAMONDS,
// }

export type Rank =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | "J"
  | "Q"
  | "K"
  | "P"
  | "O"
  | "E"
  | "R"

export type SortedRank =
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11 // J
  | 12 // Q
  | 13 // K
  | 14 // A

export type Suit = "♣" | "♠" | "♥" | "♦"

export interface Card {
  rank: Rank
  suit: Suit
}

export interface SortedCard {
  rank: SortedRank
  suit: Suit
}

export type Cards = Card[]

export type SortedCards = SortedCard[]

export enum HandCategory {
  StraightFlush,
  FourOfAKind,
  FullHouse,
  Flush,
  Straight,
  ThreeOfAKind,
  TwoPair,
  OnePair,
  HighCard,
}

export interface Values {
  cards: SortedCards
  value1?: SortedRank
  value2?: SortedRank
  value3?: SortedRank
  value4?: SortedRank
  value5?: SortedRank
}

export interface Combination extends Values {
  cards: SortedCards
  value1: SortedRank
}

export interface Hand extends Combination {
  category: HandCategory
}
