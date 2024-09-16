<script setup lang="ts">
import { dealerId, playerChips, playerId } from "../store"

import Amount from "./Amount.vue"
import ChipPile from "./ChipPile.vue"
import Dealer from "./Dealer.vue"
</script>

<template>
  <div class="main-player">
    <ChipPile :amount="playerChips[playerId]" class="chips" />
    <Amount :amount="playerChips[playerId]" class="amount" />
    <Dealer v-if="dealerId === playerId" class="dealer" />
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
</style>
