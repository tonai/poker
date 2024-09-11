import { computed, ref } from "vue"

import { Cards, Step } from "../types"

export const dealerIndex = ref(0)
export const playerId = ref("")
export const playerCards = ref<Record<string, Cards>>({})
export const playerIds = ref<string[]>([])
export const playersReady = ref<string[]>([])
export const step = ref<Step>(Step.WAIT)

export const otherPlayers = computed(() => {
  const index = playerIds.value.findIndex((id) => id === playerId.value)
  return playerIds.value
    .slice(index + 1)
    .concat(playerIds.value.slice(0, index))
})
