<script setup lang="ts">
import { computed } from "vue"

import { step } from "../store"
import { Step } from "../types"

import Chip from "./Chip.vue"

const props = defineProps<{
  allIn?: boolean
  amount: number
}>()

const isAllIn = computed(() => props.allIn && step.value === Step.PLAY)
</script>

<template>
  <div class="chips" :class="{ isAllIn }">
    {{ isAllIn ? "All-in" : amount }}
    <Chip class="chip" :color="isAllIn ? '#950000' : undefined" />
  </div>
</template>

<style scoped>
.chips {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1em;
  gap: var(--size);
  transition: color 400ms ease;
}
.isAllIn {
  font-weight: bold;
  color: #950000;
}
.chip {
  width: 1em;
}
</style>
