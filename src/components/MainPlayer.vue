<script setup lang="ts">
import { ref, watch } from "vue"

import { dealerId, playerChips, playerId, winners } from "../store"

import Amount from "./Amount.vue"
import ChipPile from "./ChipPile.vue"
import Dealer from "./Dealer.vue"

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
    <ChipPile :amount="amount" class="chips" />
    <Amount :amount="amount" class="amount" />
    <Dealer v-if="dealerId === playerId" class="dealer" />
    <div
      v-if="winners.length > 0"
      class="result"
      :class="{
        winner: winners.includes(playerId),
        loser: !winners.includes(playerId),
      }"
    >
      {{ winners.includes(playerId) ? "Win" : "Lost" }}
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
.dealer {
  translate: 50% 0;
}
.result {
  position: absolute;
  bottom: calc(var(--size) * 29);
  width: calc(var(--size) * 20);
  text-align: center;
  font-size: calc(var(--size) * 7);
  font-weight: bold;
  background-color: white;
  border-radius: var(--size);
  animation: 400ms ease both slide;
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
