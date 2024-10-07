import type { PlayerId } from "rune-sdk"

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

export type ActionType = "allIn" | "call" | "check" | "fold" | "raise"

export type FullActionType = ActionType | "bigBlind" | "smallBlind"

export interface Bet {
  amount: number
  id: PlayerId
  raise: number
  round: number
  type: FullActionType
}

export interface Action {
  type: FullActionType
  amount: number
  raise: number
}

export interface WinnerHand {
  hand: Hand
  id: string
}
