<script setup lang="ts">
import { CSSProperties } from "vue"

import { dealerId } from "../store"
import { Position } from "../types"

defineProps<{
  playerPositions: Record<string, Position>
}>()
</script>

<template>
  <div class="dealer" :style="playerPositions[dealerId] as CSSProperties">
    D
  </div>
</template>

<style scoped>
.dealer {
  position: absolute;
  width: calc(var(--size) * 8);
  height: calc(var(--size) * 8);
  aspect-ratio: 1 / 1;
  background-color: black;
  border-radius: 50%;
  font-size: calc(var(--size) * 6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border: 1px solid gold;
  color: gold;
  translate: -50% -50%;
  transition:
    left 1s ease,
    top 1s ease;
}
</style>
