<script setup lang="ts">
import Chip from "./Chip.vue"

defineProps<{
  allIn?: boolean
  amount: number
}>()
</script>

<template>
  <div class="chips" :class="{ allIn }">
    {{ allIn ? "All-in" : amount }}
    <Chip class="chip" :color="allIn ? '#950000' : undefined" />
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
.allIn {
  font-weight: bold;
  color: #950000;
}
.chip {
  width: 1em;
}
</style>
