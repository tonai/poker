import type { PlayerId } from "dusk-games-sdk/multiplayer"

import { Cards, Hand } from "./card"

export enum Step {
  PLAY,
  ROUND_END,
  WAIT,
  WIN,
}

export interface PlayerCards {
  cards: Cards
  id: PlayerId
}

export interface Bet {
  amount: number
  id: PlayerId
  raise: number
  round: number
  type: "big blind" | "call" | "check" | "fold" | "raise" | "small blind"
}

export interface Action {
  type: "call" | "check" | "fold" | "raise"
  amount: number
  raise?: number
}

export interface WinnerHand {
  hand: Hand
  id: string
}
