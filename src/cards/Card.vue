<script setup lang="ts">
import { Rank, Suit } from "../types"

import CardBack from "./CardBack.vue"
import CardFront from "./CardFront.vue"

defineProps<{
  flipped: boolean
  rank: Rank
  suit: Suit
}>()
</script>

<template>
  <div class="card" :class="{ flipped }">
    <CardFront :rank="rank" :suit="suit"/>
    <CardBack class="back"/>
  </div>
</template>

<style scoped>
.card {
  aspect-ratio: 25 / 35;
  display: grid;
  transform-style: preserve-3d;
  perspective: 1000px;
  transition: transform 200ms ease;
}
.flipped {
  transform: rotateY(180deg);
}
.card > svg {
  grid-area: 1 / 1;
}
.back {
  translate: 0 0 -1px;
}
</style>
