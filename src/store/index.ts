import { computed, ref } from "vue"

import { startBlind } from "../constants"
import { Bet, Cards, PlayerCards, Step } from "../types"

export const bets = ref<Bet[]>([])
export const blind = ref(startBlind)
export const communityCards = ref<Cards>([])
export const dealerIndex = ref(0)
export const hand = ref(0)
export const playerId = ref("")
export const playerCards = ref<PlayerCards[]>([])
export const playerChips = ref<Record<string, number>>({})
export const playerIds = ref<string[]>([])
export const playersReady = ref<string[]>([])
export const round = ref(0)
export const roundWinners = ref<Record<string, number>>({})
export const step = ref<Step>(Step.WAIT)
export const turnIndex = ref(0)

export const foldPlayers = computed(() =>
  bets.value.filter(({ type }) => type === "fold").map(({ id }) => id)
)
export const otherPlayers = computed(() => {
  const index = playerIds.value.findIndex((id) => id === playerId.value)
  return playerIds.value
    .slice(index + 1)
    .concat(playerIds.value.slice(0, index))
})
export const dealerId = computed(() => playerIds.value[dealerIndex.value])
export const playerOrder = computed(() =>
  playerIds.value
    .slice(dealerIndex.value + 1)
    .concat(playerIds.value.slice(0, dealerIndex.value + 1))
    .filter((id) => !foldPlayers.value.includes(id))
)
export const playerTurn = computed(() => {
  return playerOrder.value[turnIndex.value]
})
export const roundBets = computed(() =>
  bets.value.filter(
    (bet) => bet.round === round.value && !foldPlayers.value.includes(bet.id)
  )
)
export const playerBets = computed(() =>
  roundBets.value.reduce<Record<string, number>>((acc, { amount, id }) => {
    acc[id] = (acc[id] ?? 0) + amount
    return acc
  }, {})
)
export const maxRoundBet = computed(() =>
  Math.max(...Object.values(playerBets.value), 0)
)
