<script setup lang="ts">
import { computed, ref, watch } from "vue"

import {
  allInPlayers,
  playerChips,
  playerId,
  playerIds,
  playerOut,
  winners,
} from "../store"

import Amount from "./Amount.vue"
import ChipPile from "./ChipPile.vue"

const isSpectator = computed(() => !playerIds.value.includes(playerId.value))
const isWinner = computed(() => winners.value.includes(playerId.value))

const label = computed(() => {
  if (isSpectator.value) {
    return "Spectator"
  } else if (playerOut.value) {
    return "Out"
  } else if (isWinner.value) {
    return "Won"
  }
  return "Lost"
})

const resultClasses = computed(() => ({
  winner: isWinner.value,
  loser: (!isWinner.value || playerOut.value) && !isSpectator.value,
}))

// Amount sync with bet transitions
const amount = ref(playerChips.value[playerId.value])
watch(playerChips, () => {
  if (amount.value > playerChips.value[playerId.value]) {
    amount.value = playerChips.value[playerId.value]
  } else if (amount.value < playerChips.value[playerId.value]) {
    setTimeout(() => (amount.value = playerChips.value[playerId.value]), 2200)
  }
})
</script>

<template>
  <div class="main-player">
    <template v-if="typeof amount === 'number'">
      <ChipPile :amount="amount" class="chips" />
      <Amount
        :all-in="allInPlayers.includes(playerId)"
        :amount="amount"
        class="amount"
      />
    </template>
    <div
      v-if="winners.length > 0 || playerOut"
      class="result"
      :class="resultClasses"
    >
      {{ label }}
    </div>
  </div>
</template>

<style scoped>
.main-player {
  position: absolute;
  bottom: calc(var(--size) * 5);
  padding: 0 0 0 calc(var(--size) * 5);
  width: 50%;
  display: flex;
  justify-content: space-between;
}
.chips {
  bottom: calc(var(--size) * -7);
  left: calc(var(--size) * 15);
}
.main-player .amount {
  font-size: calc(var(--size) * 7);
}
.result {
  position: absolute;
  bottom: calc(var(--size) * 29);
  min-width: calc(var(--size) * 20);
  text-align: center;
  font-size: calc(var(--size) * 7);
  font-weight: bold;
  background-color: white;
  border-radius: var(--size);
  animation: 400ms ease both slide;
  padding: var(--size);
}
@keyframes slide {
  0% {
    translate: -150% 0;
  }
  100% {
    translate: 0 0;
  }
}
.winner {
  color: green;
}
.loser {
  color: red;
}
</style>
