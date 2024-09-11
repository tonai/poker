import { ref } from "vue"

import { Step } from "../types"

export const playerId = ref("")
export const playerIds = ref<string[]>([])
export const playersReady = ref<string[]>([])
export const step = ref<Step>(Step.WAIT)
