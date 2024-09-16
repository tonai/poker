import { computed, ref } from "vue"

import { Bet, PlayerCards, Step } from "../types"

export const bets = ref<Bet[]>([])
export const dealerIndex = ref(0)
export const playerId = ref("")
export const playerCards = ref<PlayerCards[]>([])
export const playerChips = ref<Record<string, number>>({})
export const playerIds = ref<string[]>([])
export const playersReady = ref<string[]>([])
export const step = ref<Step>(Step.WAIT)

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
)
