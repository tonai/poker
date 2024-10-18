import { computed, ref } from "vue"

import { startBlind } from "../constants"
import { getDealerId, getPlayerOrder, getRank } from "../helpers"
import { Bet, Cards, PlayerCards, Step, WinnerHand } from "../types"

export const bets = ref<Bet[]>([])
export const blind = ref(startBlind)
export const communityCards = ref<Cards>([])
export const dealerIndex = ref(0)
export const gameRound = ref(0)
export const playerId = ref("")
export const playerCards = ref<PlayerCards[]>([])
export const playerChips = ref<Record<string, number>>({})
export const playerIds = ref<string[]>([])
export const playersReady = ref<string[]>([])
export const remainingPlayers = ref<string[]>([])
export const round = ref(0)
export const roundWinners = ref<Record<string, number>>({})
export const step = ref<Step>(Step.WAIT)
export const turnIndex = ref(0)
export const winnerHands = ref<WinnerHand[]>([])

export const playerOut = computed(
  () => !remainingPlayers.value.includes(playerId.value)
)
export const foldPlayers = computed(() =>
  bets.value.filter(({ type }) => type === "fold").map(({ id }) => id)
)
export const allInPlayers = computed(() =>
  bets.value.filter(({ type }) => type === "allIn").map(({ id }) => id)
)
export const skipPlayers = computed(() =>
  foldPlayers.value.concat(allInPlayers.value)
)
export const otherPlayers = computed(() => {
  const index = playerIds.value.findIndex((id) => id === playerId.value)
  if (index === -1) {
    return playerIds.value
  }
  return playerIds.value
    .slice(index + 1)
    .concat(playerIds.value.slice(0, index))
})
export const dealerId = computed(() =>
  getDealerId(remainingPlayers.value, dealerIndex.value)
)
export const playerOrder = computed(() =>
  getPlayerOrder(remainingPlayers.value, dealerIndex.value, skipPlayers.value)
)
export const playerTurn = computed(() => playerOrder.value[turnIndex.value])
export const roundBets = computed(() =>
  bets.value.filter(
    (bet) => bet.round === round.value //&& !foldPlayers.value.includes(bet.id)
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
export const winners = computed(() => Object.keys(roundWinners.value))
export const winnerCards = computed(() => [
  ...new Set(
    winnerHands.value
      .map(({ hand }) => hand.cards)
      .flat()
      .map((card) => `${getRank(card.rank)}${card.suit}`)
  ),
])
export const disableRaise = computed(
  () =>
    playerOrder.value.filter((id) => !skipPlayers.value.includes(id)).length <=
    1
)
