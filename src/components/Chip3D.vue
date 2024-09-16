<script setup lang="ts">
import { computed } from "vue"

import { getColor } from "../helpers"

import Chip from "./Chip.vue"

const props = defineProps<{
  amount?: number | string
}>()

const color = computed(() => getColor(props.amount))
</script>

<template>
  <div class="chip">
    <Chip class="front" :amount="amount" />
    <div class="back" :style="{ backgroundColor: color }"></div>
  </div>
</template>

<style scoped>
.chip {
  position: relative;
  transform-style: preserve-3d;
  transform: rotateX(70deg);
  width: 20em;
}
.front {
  transform: translateZ(0.5em);
}
.back {
  transform: translateZ(-0.5em);
  position: absolute;
  inset: 0;
  border-radius: 50%;
}
.back:before {
  content: "";
  display: block;
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(
    to left,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0) 40%,
    rgba(0, 0, 0, 0) 60%,
    rgba(0, 0, 0, 0.5) 100%
  );
}
</style>
