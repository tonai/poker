<script setup lang="ts">
import { watchEffect } from "vue"

import { Rank, Suit } from "../types"

import Background from "./Background.vue"
import Front from "./Front.vue"
import { withFiguresClub, withFiguresDiamond, withFiguresHeart, withFiguresSpade } from './store';

const props = defineProps<{
  rank: Rank
  suit: Suit
}>()

watchEffect(() => {
  switch (props.suit) {
    case '♣':
      return withFiguresClub.value = true
    case '♦':
      return withFiguresDiamond.value = true
    case '♥':
      return withFiguresHeart.value = true
    case '♠':
      return withFiguresSpade.value = true
  }
})
</script>

<template>
  <svg class="card-front" viewBox="-120 -168 240 336">
    <Background />
    <Front :rank="rank" :suit="suit" />
  </svg>
</template>

<style scoped>
.card-front {
  aspect-ratio: 25 / 35;
}
</style>
