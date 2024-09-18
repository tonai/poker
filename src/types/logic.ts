import type { PlayerId } from "dusk-games-sdk/multiplayer"

import { Cards } from "./card"

export enum Step {
  PLAY,
  ROUND_END,
  WAIT,
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
  type: "big blind" | "checkOrCall" | "fold" | "raise" | "small blind"
}

export interface Action {
  type: "checkOrCall" | "fold" | "raise"
  amount: number
  raise?: number
}
