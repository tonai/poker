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
}
