<script setup lang="ts">
import { watch } from "vue"
import { playSound } from "@tonai/game-utils"

import { Rank, Suit } from "../types"

import CardBack from "./CardBack.vue"
import CardFront from "./CardFront.vue"

const props = withDefaults(
  defineProps<{
    flipped?: boolean
    opacity?: boolean
    rank: Rank
    suit: Suit
  }>(),
  {
    flipped: false,
  }
)

watch(
  () => props.flipped,
  () => playSound("cardSingleFlip")
)
</script>

<template>
  <div class="card" :class="{ flipped, opacity }">
    <CardFront class="front" :rank="rank" :suit="suit" />
    <CardBack class="back" />
  </div>
</template>

<style scoped>
.card {
  aspect-ratio: 25 / 35;
  display: grid;
  transform-style: preserve-3d;
  perspective: 1000px;
  transition: transform 200ms 100ms ease;
}
.flipped {
  transform: rotateY(180deg);
}
.card > svg {
  grid-area: 1 / 1;
}
.front {
  backface-visibility: hidden;
  transform-style: preserve-3d;
}
.back {
  translate: 0 0 -1px;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  transform: rotateY(180deg);
}
.opacity .front,
.opacity .back {
  opacity: 0.5;
}
</style>
