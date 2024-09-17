import type { PlayerId } from "dusk-games-sdk/multiplayer"

import { Cards } from "./card"

export enum Step {
  PLAY,
  WAIT,
}

export interface PlayerCards {
  cards: Cards
  id: PlayerId
}

export interface Bet {
  amount: number
  id: PlayerId
  round: number
  type: "big blind" | "checkOrCall" | "fold" | "raise" | "small blind"
}

export interface Action {
  type: "checkOrCall" | "fold" | "raise"
  amount?: number
}
